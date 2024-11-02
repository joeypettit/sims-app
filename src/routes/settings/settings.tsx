import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PanelWindow from "../../components/panel-window";
import Button from "../../components/button";
import { useEffect, useRef, useState } from "react";
import Modal from "../../components/modal";
import { validateTemplateName } from "../../util/form-validation";
import { createAreaTemplate } from "../../api/api";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";

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

  // Fetch the details for the specific item using the ID from the route params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      return { blah: "blahblah" };
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
      console.log("template Created with id", data.id);
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
    setTemplateModalErrorMessage("");
  }

  if (isLoading || createAreaTemplateMutation.isPending) {
    return (
      <PanelWindow>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner />
        </div>
      </PanelWindow>
    );
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
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
    <PanelWindow>
      <h1>Settings</h1>
      <div>
        <div className="flex flex-row bg-sims-green-100">
          <h2>Templates</h2>
          <Button
            size="xs"
            variant="primary"
            // onClick={() => navigate("/settings/add-template")}
            onClick={() => setIsCreateTemplateModalOpen(true)}
          >
            +
          </Button>
        </div>
      </div>
      {renderTemplateModal()}
    </PanelWindow>
  );
}
