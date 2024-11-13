import React, { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createBlankProjectArea } from "../api/api";
import Button from "./button";
import type { Project } from "../app/types/project";

type AddProjectAreaModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project?: Project;
};

export default function AddProjectAreaModal({
  isOpen,
  setIsOpen,
  project,
}: AddProjectAreaModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [areaNameInput, setAreaNameInput] = useState("");
  const [modalErrorMessage, setModalErrorMessage] = useState<string>("");
  const [creationOption, setCreationOption] = useState<"scratch" | "template">(
    "template"
  );

  const createBlankAreaMutation = useMutation({
    mutationFn: async () => {
      if (project?.id) {
        const result = await createBlankProjectArea({
          name: areaNameInput,
          projectId: project.id,
        });
        return result;
      }
      throw Error("Project Id required to create new project area");
    },
    onSuccess: (data) => {
      console.log("SUCCESS", data, project?.id);
      if (project?.id) {
        navigate(`/project/${project.id}/area/${data.id}`);
      }
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      throw Error(`Error creating project: ${error}`);
    },
  });

  function handleCancel() {
    setAreaNameInput("");
    setModalErrorMessage("");
    setCreationOption("template");
    setIsOpen(false);
  }

  function handleNextButtonClick() {
    setModalErrorMessage("");
    if (areaNameInput == "") {
      setModalErrorMessage("Area Name Is Required");
      return;
    }
    if (creationOption == "scratch") {
      createBlankAreaMutation.mutate();
    }
  }

  // Set focus on the input element when the modal opens
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      title="New Project Area"
      onCancel={handleCancel}
      actionButtons={[
        {
          variant: "primary",
          children: "Next",
          onClick: handleNextButtonClick,
        },
      ]}
    >
      <div className="flex flex-col justify-center items-center">
        <label htmlFor="project-name" className="block mb-2">
          Project Area Name:
        </label>
        <input
          type="text"
          autoComplete="off"
          id="project-name"
          name="project-name"
          ref={inputRef}
          value={areaNameInput}
          onChange={(e) => setAreaNameInput(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-4"
        />
        <fieldset className="mb-4">
          <legend className="text-sm font-medium mb-2">Create Option:</legend>
          <div className="flex flex-col">
            <label>
              <input
                type="radio"
                name="creationOption"
                value="template"
                checked={creationOption === "template"}
                onChange={() => setCreationOption("template")}
                className="mr-2"
              />
              Create from template
            </label>
            <label className="mb-2">
              <input
                type="radio"
                name="creationOption"
                value="scratch"
                checked={creationOption === "scratch"}
                onChange={() => setCreationOption("scratch")}
                className="mr-2"
              />
              Create from scratch
            </label>
          </div>
        </fieldset>
        {modalErrorMessage && (
          <div className="text-rose-700">{modalErrorMessage}</div>
        )}
      </div>
    </Modal>
  );
}
