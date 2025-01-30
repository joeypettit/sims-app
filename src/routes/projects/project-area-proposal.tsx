import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { simulateNetworkLatency, sortArrayByIndexProperty, updateGroupIndexInCategory } from "../../util/utils";
import { filterGroupsByCategory } from "../../util/utils";
import {
  createGroup,
  getAllGroupCategories,
  getProjectAreaById,
  setIndexOfGroupInCategory,
  setIsOpenOnAllGroupsInArea,
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
import StickyTierToolbar from "../../components/tier-toolbar";
import { ProjectArea } from "../../app/types/project-area";
import { DragDropContext, Droppable, DropResult, OnDragEndResponder } from "@hello-pangea/dnd";

type ProjectAreaProposalProps = {
  areaId?: string;
  templateTitle?: string;
};

export default function ProjectAreaProposal({
  areaId,
  templateTitle
}: ProjectAreaProposalProps) {
  const queryClient = useQueryClient();
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [createGroupErrorMessage, setCreateGroupErrorMessage] =
    useState<string>("");
  const [groupNameInput, setGroupNameInput] = useState("");
  const [newGroupCategoryId, setNewGroupCategoryId] = useState<string>("");

  function handleOpenCreateGroupModal(categoryId: string) {
    setNewGroupCategoryId(categoryId);
    setIsCreateGroupModalOpen(true);
  }

  function handleCloseCreateGroupModal() {
    setGroupNameInput("");
    setIsCreateGroupModalOpen(false);
  }


  function handleToggleOpenAllGroups(isOpen: boolean) {
    if (areaId) {
      setIsOpenAllGroupsInAreaMutation.mutate({ areaId: areaId, isOpen: isOpen })
    }
  }
  function getTitle() {
    if (templateTitle) {
      return templateTitle;
    }
    return projectAreaQuery.data?.name || ""
  }
  const projectAreaQuery = useQuery({
    queryKey: ["area"],
    queryFn: async () => {
      if (!areaId) {
        throw new Error("Area ID is required");
      }
      console.log("running area query")
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


  const changeGroupIndexInCategoryMutation = useMutation({
    mutationFn: async ({ categoryId, groupId, newIndex, }: { categoryId: string, groupId: string, newIndex: number }) => {
      const result = await setIndexOfGroupInCategory({ categoryId, groupId, newIndex })
      return result;
    },
    onMutate: async ({ groupId, newIndex }) => {
      await queryClient.cancelQueries({ queryKey: ["area"] });
      const previousArea: ProjectArea | undefined = queryClient.getQueryData(["area"]);
      if (previousArea) {
        console.log("setting area", groupId,)
        const reorderedGroups = updateGroupIndexInCategory({ groups: previousArea.lineItemGroups, newIndex, groupId })
        queryClient.setQueryData(["area"], {
          ...projectAreaQuery.data,
          lineItemGroups: reorderedGroups,
        });
      }
      return previousArea; // Return to rollback in case of error
    },
    onError: (error) => {
      console.log("Error in setIsOpenAllGroupsInArea", error);
      setCreateGroupErrorMessage(
        "There has been an error setting isOpen on all groups. Please try again."
      );
    },
    onSuccess: () => {
      // Optionally refetch to ensure data consistency
      // queryClient.invalidateQueries({ queryKey: ["area"] });
    },
  });

  const setIsOpenAllGroupsInAreaMutation = useMutation({
    mutationFn: setIsOpenOnAllGroupsInArea,
    onMutate: async ({ areaId, isOpen }) => {
      await queryClient.cancelQueries({ queryKey: ["area"] });

      // Optimistic Update: Update the query cache directly
      const previousArea: ProjectArea | undefined = queryClient.getQueryData(["area"]);
      if (previousArea) {
        queryClient.setQueryData(["area"], {
          ...previousArea,
          lineItemGroups: previousArea.lineItemGroups.map((group) => ({
            ...group,
            isOpen: isOpen, // Update the isOpen property for all groups
          })),
        });
      }

      return previousArea; // Return to rollback in case of error
    },
    onError: (error) => {
      console.log("Error in setIsOpenAllGroupsInArea", error);
      setCreateGroupErrorMessage(
        "There has been an error setting isOpen on all groups. Please try again."
      );
    },
    onSuccess: () => {
      // Optionally refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["area"] });
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

  function onDragEnd(
    result: DropResult<string>
  ) {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    if (!projectAreaQuery.data?.lineItemGroups) return;
    const categoryId = result.destination.droppableId;
    const groupId = result.draggableId;
    const newIndex = result.destination.index;

    changeGroupIndexInCategoryMutation.mutate({ groupId, categoryId, newIndex })
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

  function GroupCategoryList({ groups }: { groups: LineItemGroup[] | undefined }) {
    if (!groups) return;
    const orderedGroups = sortArrayByIndexProperty({ arr: groups, indexProperty: "indexInCategory" })
    return orderedGroups.map(
      (group: LineItemGroup, index) => {
        return (
          <LineItemGroupContainer
            key={group.id}
            group={group}
            index={index}
          />
        );
      }
    )
  }

  return (
    <>
      <StickyTierToolbar title={getTitle()} handleSetIsOpen={handleToggleOpenAllGroups} />
      {categoriesQuery.data?.map((category) => {
        if (!projectAreaQuery.data?.lineItemGroups) return;
        console.log("projectAreaQuery.data?.lineItemGroups",projectAreaQuery.data?.lineItemGroups)
        const groupsInCategory = filterGroupsByCategory({ groups: projectAreaQuery.data?.lineItemGroups, categoryId: category.id })
        return (
          <div key={category.id} className="py-4">
            <h2 className="text-md font-bold text-center border  border-b-slate-200 border-r-0 border-l-0 border-t-0">
              {category.name}
            </h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId={category.id}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <GroupCategoryList groups={groupsInCategory} />
                    {provided.placeholder}
                  </div>
                )
                }
              </Droppable>
            </DragDropContext>
            <Button
              size="sm"
              variant="white"
              onClick={() => handleOpenCreateGroupModal(category.id)}
            >
              + Add Group
            </Button>
          </div>
        );
      })}
      {renderCreateGroupModal()}
      <div className="flex justify-center">
        <div className="p-8 border border-gray-300 font-bold rounded shadow">
          Project Total: {getAreasTotalSalePrice()}
        </div>
      </div>
    </>
  );
}
