import { useMutation, useQuery } from "@tanstack/react-query";
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

export default function EditAreaTemplate() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [groupNameInput, setGroupNameInput] = useState("");
  const [newGroupCategoryId, setNewGroupCategoryId] = useState<string>("");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

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
    onMutate: (variables) => {
      // A mutation is about to happen!

      // Optionally return a context containing data to use when for example rolling back
      return { id: 1 };
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${context?.id}`);
    },
    onSuccess: (data, variables, context) => {
      // Boom baby!
    },
    onSettled: (data, error, variables, context) => {
      // Error or success... doesn't matter!
    },
  });

  function handleCreateGroup() {
    // createGroupMutation.mutate({
    //   categoryId,
    //   groupName,
    //   projectAreaId
    // });)
    handleCloseCreateGroupModal();
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

  function renderCreateGroupModal() {
    return (
      <Modal
        isOpen={isCreateGroupModalOpen}
        onConfirm={handleCreateGroup}
        onCancel={handleCloseCreateGroupModal}
      >
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
      </Modal>
    );
  }

  return (
    <PanelWindow>
      <h1>{areaTemplateQuery.data?.name}</h1>
      {categoriesQuery.data?.map((category) => {
        return (
          <div key={category.id}>
            <h2 className="text-md font-bold text-center bg-sims-green-50 rounded-sm">
              {category.name}
            </h2>
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
