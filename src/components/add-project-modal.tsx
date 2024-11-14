import React, { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createBlankProject } from "../api/api";

type AddProjectModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddProjectModal({
  isOpen,
  setIsOpen,
}: AddProjectModalProps) {
  const navigate = useNavigate();
  const [projectNameInput, setProjectNameInput] = useState("");
  const [modalErrorMessage, setModalErrorMessage] = useState<String>("");

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const result = await createBlankProject({ name: projectNameInput });
      return result;
    },
    onSuccess: (data) => {
      navigate(`/edit-project/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      throw Error(`Error creating project: ${error}`);
    },
  });

  function handleConfirm() {
    createProjectMutation.mutate();
  }

  function handleCancel() {
    setProjectNameInput("");
    setIsOpen(false);
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
      title="Please give your project a name."
      onConfirm={() => handleConfirm()}
      onCancel={() => handleCancel()}
    >
      <div className="flex flex-col justify-center items-center">
        {/* <p className="text-sm text-gray-500 pb-4">
   
        </p> */}
        <label htmlFor="projectName" className={`block mb-2`}>
          Project Name:
        </label>
        <input
          type="text"
          autoComplete="off"
          id="projectName"
          name="projectName"
          ref={inputRef}
          value={projectNameInput}
          onChange={(e) => setProjectNameInput(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-4"
        />
        {modalErrorMessage && (
          <div className="text-rose-700">{modalErrorMessage}</div>
        )}
      </div>
    </Modal>
  );
}
