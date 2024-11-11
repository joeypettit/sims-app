import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  createGroup,
  getAllGroupCategories,
  getProjectAreaById,
} from "../../api/api";
import LineItemGroupContainer from "../../components/budget-columns/line-item-group";
import type { LineItemGroup } from "../../app/types/line-item-group";
import { getGroupsTotalSalePrice } from "../../util/utils";
import type { PriceRange } from "../../app/types/price-range";
import { formatNumberWithCommas } from "../../util/utils";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import Modal from "../../components/modal";
import { useState } from "react";
import { validateGroupName } from "../../util/form-validation";
import Button from "../../components/button";

type ProjectAreaProposalProps = {
  areaIdFromProps?: string;
};

export default function ProjectAreaProposal({
  areaIdFromProps,
}: ProjectAreaProposalProps) {
  const { areaIdFromParams } = useParams();
  const queryClient = useQueryClient();
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [createGroupErrorMessage, setCreateGroupErrorMessage] =
    useState<string>("");
  const [groupNameInput, setGroupNameInput] = useState("");
  const [newGroupCategoryId, setNewGroupCategoryId] = useState<string>("");
  const [panelIsLoading, setPanelIsLoading] = useState(false);
  const areaId = areaIdFromProps || areaIdFromParams;

  function handleOpenCreateGroupModal(categoryId: string) {
    setNewGroupCategoryId(categoryId);
    setIsCreateGroupModalOpen(true);
  }
  function handleCloseCreateGroupModal() {
    setGroupNameInput("");
    setIsCreateGroupModalOpen(false);
  }

  const projectAreaQuery = useQuery({
    queryKey: ["area"],
    queryFn: async () => {
      if (!areaId) {
        throw new Error("Area ID is required");
      }
      const response = await getProjectAreaById(areaId);
      return response;
    },
    select: (data) => {
      const updatedGroups: LineItemGroup[] = data.lineItemGroups.map(
        (group) => {
          const salePrice = getGroupsTotalSalePrice(group);
          return { ...group, totalSalePrice: salePrice };
        }
      );
      const totalAreaPrice: PriceRange = updatedGroups.reduce(
        (acc: PriceRange, currentGroup: LineItemGroup) => {
          return {
            lowPriceInDollars:
              acc.lowPriceInDollars +
              currentGroup.totalSalePrice.lowPriceInDollars,
            highPriceInDollars:
              acc.highPriceInDollars +
              currentGroup.totalSalePrice.highPriceInDollars,
          };
        },
        { lowPriceInDollars: 0, highPriceInDollars: 0 } as PriceRange
      );

      return {
        ...data,
        lineItemGroups: updatedGroups,
        totalSalePrice: totalAreaPrice,
      };
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["all-group-categories"],
    queryFn: async () => {
      const result = await getAllGroupCategories();
      return result;
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["area"],
      });
      const previousArea = queryClient.getQueryData(["area"]);
      return previousArea;
    },
    onError: (error) => {
      console.log("Error in createGroupMutation", error);
      setCreateGroupErrorMessage(
        "There has been an error creating new group. Please try again."
      );
    },
    onSuccess: () => {
      setGroupNameInput("");
      setIsCreateGroupModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["area"],
      });
    },
  });

  function getAreasTotalSalePrice() {
    if (projectAreaQuery.data?.totalSalePrice) {
      if (
        projectAreaQuery.data.totalSalePrice?.lowPriceInDollars <= 0 &&
        projectAreaQuery.data.totalSalePrice?.highPriceInDollars <= 0
      )
        return "-";
      const lowPrice = formatNumberWithCommas(
        projectAreaQuery.data.totalSalePrice?.lowPriceInDollars
      );
      const highPrice = formatNumberWithCommas(
        projectAreaQuery.data.totalSalePrice?.highPriceInDollars
      );
      return `$${lowPrice} - $${highPrice}`;
    }
    return "-";
  }

  async function handleCreateGroup() {
    setCreateGroupErrorMessage("");
    const errorMessage = validateGroupName(groupNameInput);

    if (errorMessage) {
      setCreateGroupErrorMessage(errorMessage);
      return;
    }

    if (!projectAreaQuery.data?.id) {
      throw Error("Project Id Requred to create new group");
    }

    if (!newGroupCategoryId) {
      throw Error("A category id is required to create a new group");
    }

    const trimmedName = groupNameInput.trim();

    createGroupMutation.mutate({
      categoryId: newGroupCategoryId,
      groupName: trimmedName,
      projectAreaId: projectAreaQuery.data?.id,
    });
  }

  function renderCreateGroupModal() {
    return (
      <Modal
        isOpen={isCreateGroupModalOpen}
        onConfirm={handleCreateGroup}
        onCancel={handleCloseCreateGroupModal}
      >
        {createGroupMutation.isPending ? (
          <SimsSpinner centered />
        ) : (
          <div className="flex flex-col justify-center items-center">
            <label
              htmlFor="group-name"
              className="block text-left mb-2 font-medium"
            >
              Group Name
            </label>
            <input
              type="text"
              autoComplete="off"
              id="group-name"
              value={groupNameInput}
              onChange={(e) => setGroupNameInput(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded"
              placeholder="Enter group name"
              required
            />
            {createGroupErrorMessage && (
              <div className="text-rose-700">{createGroupErrorMessage}</div>
            )}
          </div>
        )}
      </Modal>
    );
  }

  if (projectAreaQuery.isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <SimsSpinner />
      </div>
    );
  }

  if (projectAreaQuery.isError) {
    return <p>Error: {projectAreaQuery.error.message}</p>;
  }
  console.log("rerender");
  return (
    <>
      <h1>{projectAreaQuery.data?.name}</h1>
      {categoriesQuery.data?.map((category) => {
        const key = category.id;
        console.log("key is", key);
        return (
          <div key={key}>
            <h2 className="text-md font-bold text-center bg-sims-green-50 rounded-sm">
              {category.name}
            </h2>
            {projectAreaQuery.data?.lineItemGroups.map(
              (group: LineItemGroup) => {
                if (category.id == group.groupCategory.id) {
                  return (
                    <div key={group.id}>
                      <LineItemGroupContainer
                        group={group}
                        setPanelIsLoading={setPanelIsLoading}
                      />
                    </div>
                  );
                }
              }
            )}
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleOpenCreateGroupModal(category.id)}
            >
              + Add Group
            </Button>
          </div>
        );
      })}
      {renderCreateGroupModal()}
      <div>Project Total: {getAreasTotalSalePrice()}</div>
    </>
  );
}
