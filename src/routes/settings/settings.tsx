import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { useEffect, useRef, useState } from "react";
import Modal from "../../components/modal";
import { validateTemplateName } from "../../util/form-validation";
import { createAreaTemplate, logout } from "../../api/api";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import { getAllAreaTemplates } from "../../api/api";
import { AreaTemplate } from "../../app/types/area-template";
import { FaSignOutAlt } from "react-icons/fa";

export default function SettingsPanel() {
  const navigate = useNavigate();
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);
  const [templateNameInput, setTemplateNameInput] = useState("");
  const [templateModalErrorMessage, setTemplateModalErrorMessage] =
    useState<String>("");

  // Set focus on the input element when the modal opens
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isCreateTemplateModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreateTemplateModalOpen]);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate('/login');
    }
  });

  // Fetch the details for the specific item using the ID from the route params
  const allTemplatesQuery = useQuery({
    queryKey: ["all-area-templates"],
    queryFn: async () => {
      const templates = await getAllAreaTemplates();
      return templates;
    },
  });

  const createAreaTemplateMutation = useMutation({
    mutationFn: createAreaTemplate,
    onError: (error, variables, context) => {
      setTemplateModalErrorMessage(
        "There has been an error creating a new template. Please try again."
      );
    },
    onSuccess: (data, variables, context) => {
      setTemplateNameInput("");
      setIsCreateTemplateModalOpen(false);
      navigate(`/settings/edit-template/${data.id}`);
    },
  });

  async function handleTemplateModalConfirm() {
    setTemplateModalErrorMessage("");
    const errorMessage = validateTemplateName(templateNameInput);
    if (errorMessage) {
      setTemplateModalErrorMessage(errorMessage);
      return;
    }
    const trimmedName = templateNameInput.trim();
    createAreaTemplateMutation.mutate(trimmedName);
  }

  function handleTemplateModalCancel() {
    setIsCreateTemplateModalOpen(false);
    setTemplateNameInput("");
    setTemplateModalErrorMessage("");
  }

  function handleLogout() {
    logoutMutation.mutate();
  }

  if (allTemplatesQuery.isLoading || createAreaTemplateMutation.isPending) {
    return (
      <>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner />
        </div>
      </>
    );
  }

  if (allTemplatesQuery.isError) {
    return <p>Error: {allTemplatesQuery.error.message}</p>;
  }

  function renderTemplateModal() {
    return (
      <Modal
        isOpen={isCreateTemplateModalOpen}
        title="Please give your template a name."
        onConfirm={() => handleTemplateModalConfirm()}
        onCancel={() => handleTemplateModalCancel()}
      >
        <div className="flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 pb-4">
            This template name will be used for internal reference only and will
            not be displayed to clients.
          </p>
          <label htmlFor="templateName" className={`block mb-2`}>
            Template Name:
          </label>
          <input
            type="text"
            autoComplete="off"
            id="template-name"
            name="template-name"
            ref={inputRef}
            value={templateNameInput}
            onChange={(e) => setTemplateNameInput(e.target.value)}
            required
            className="w-full p-2 border rounded-md mb-4"
          />
          {templateModalErrorMessage && (
            <div className="text-rose-700">{templateModalErrorMessage}</div>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <>
      <h1 className="font-bold">Settings</h1>
      <div className="flex flex-col items-center gap-6">
        <div className="border border-gray-300 p-1 my-20 rounded w-1/2">
          <div className="flex flex-row justify-between">
            <h2 className="font-bold my-4">Templates</h2>
            <Button
              className="my-4"
              size="xs"
              variant="white"
              onClick={() => setIsCreateTemplateModalOpen(true)}
            >
              +
            </Button>
          </div>
          <ul>
            {allTemplatesQuery.data?.map((template) => {
              return (
                <li
                  key={template.id}
                  className="p-1 cursor-pointer bg-white odd:bg-sims-green-100 hover:bg-sims-green-200 active:shadow-inner"
                  onClick={() => {
                    navigate(`/settings/edit-template/${template.id}`);
                  }}
                >
                  {template.name}
                </li>
              );
            })}
          </ul>
        </div>
        <Button
          variant="outline-danger"
          onClick={handleLogout}
          className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50"
        >
          <FaSignOutAlt /> Logout
        </Button>
      </div>
      {renderTemplateModal()}
    </>
  );
}
