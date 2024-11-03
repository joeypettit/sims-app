import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PanelWindow from "../../components/panel-window";
import Button from "../../components/button";
import { getAllGroupCategories } from "../../api/api";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import { getAreaTemplate } from "../../api/api";
import { createGroup } from "../../api/api";
import Modal from "../../components/modal";
import { useState } from "react";
import type { AreaTemplate } from "../../app/types/area-template";
import { validateGroupName } from "../../util/form-validation";
import LineItemGroupContainer from "../../components/budget-columns/line-item-group";
import type { LineItemGroup } from "../../app/types/line-item-group";

export default function EditAreaTemplate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [groupNameInput, setGroupNameInput] = useState("");
  const [newGroupCategoryId, setNewGroupCategoryId] = useState<string>("");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [createGroupErrorMessage, setCreateGroupErrorMessage] =
    useState<string>("");

  function handleOpenCreateGroupModal(categoryId: string) {
    setNewGroupCategoryId(categoryId);
    setIsCreateGroupModalOpen(true);
  }
  function handleCloseCreateGroupModal() {
    setGroupNameInput("");
    setIsCreateGroupModalOpen(false);
  }

  const categoriesQuery = useQuery({
    queryKey: ["all-group-categories"],
    queryFn: async () => {
      const result = await getAllGroupCategories();
      return result;
    },
  });

  const areaTemplateQuery = useQuery({
    queryKey: ["area-template", templateId],
    queryFn: async () => {
      if (templateId) {
        const result = await getAreaTemplate(templateId);
        return result;
      }
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["area-template", templateId],
      });
      const previousTemplate = queryClient.getQueryData([
        "area-template",
        templateId,
      ]);
      return previousTemplate;
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
        queryKey: ["area-template", templateId],
      });
    },
  });

  async function handleCreateGroup() {
    setCreateGroupErrorMessage("");
    const errorMessage = validateGroupName(groupNameInput);

    if (errorMessage) {
      setCreateGroupErrorMessage(errorMessage);
      return;
    }

    if (!areaTemplateQuery.data?.projectAreaId) {
      throw Error("Area Template Does Not Have a Project Area Id");
    }

    if (!newGroupCategoryId) {
      throw Error("Area Template Does Not Have a Group Category Id");
    }

    const trimmedName = groupNameInput.trim();

    createGroupMutation.mutate({
      categoryId: newGroupCategoryId,
      groupName: trimmedName,
      projectAreaId: areaTemplateQuery.data?.projectAreaId,
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

  if (categoriesQuery.isLoading || areaTemplateQuery.isLoading) {
    return (
      <PanelWindow>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner />
        </div>
      </PanelWindow>
    );
  }
  if (categoriesQuery.isError || areaTemplateQuery.isError) {
    const error = categoriesQuery.error || areaTemplateQuery.error;
    return <p>Error: {error?.message}</p>;
  }
  console.log("template", areaTemplateQuery.data);
  return (
    <PanelWindow>
      <h1>{areaTemplateQuery.data?.name}</h1>
      {categoriesQuery.data?.map((category) => {
        return (
          <div key={category.id}>
            <h2 className="text-md font-bold text-center bg-sims-green-50 rounded-sm">
              {category.name}
            </h2>
            {areaTemplateQuery.data?.projectArea.lineItemGroups.map(
              (group: LineItemGroup) => {
                if (category.id == group.groupCategory.id)
                  return <LineItemGroupContainer group={group} />;
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
    </PanelWindow>
  );
}
