import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { validateUnitName } from "../util/form-validation";
import { createUnit } from "../api/api";
import Modal from "./modal";

type AddUnitModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddUnitModal({ isOpen, setIsOpen }: AddUnitModalProps) {
  const queryClient = useQueryClient();
  const [unitNameInput, setUnitNameInput] = useState("");
  const [modalErrorMessage, setModalErrorMessage] = useState<String>("");
  async function handleModalConfirm() {
    setModalErrorMessage("");
    const errorMessage = validateUnitName(unitNameInput);
    if (errorMessage) {
      setModalErrorMessage(errorMessage);
      return;
    }
    const trimmedName = unitNameInput.trim();
    createUnitMutation.mutate({ unitName: trimmedName });
  }

  function handleModalCancel() {
    setIsOpen(false);
    setUnitNameInput("");
    setModalErrorMessage("");
  }

  const createUnitMutation = useMutation({
    mutationFn: createUnit,
    onError: (error, variables, context) => {
      setModalErrorMessage(
        "There has been an error creating a new unit. Please try again."
      );
    },
    onSuccess: (data, variables, context) => {
      console.log("Unit Created with id", data.id);
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setUnitNameInput("");
      setIsOpen(false);
    },
  });

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
      title="Create New Unit"
      onConfirm={() => handleModalConfirm()}
      onCancel={() => handleModalCancel()}
    >
      <div className="flex flex-col justify-center items-center">
        <p className="text-sm text-gray-500 pb-4">
          Create a new unit that can be used across the application.
        </p>
        <label htmlFor="unitName" className={`block mb-2`}>
          Unit Name:
        </label>
        <input
          type="text"
          id="unit-name"
          name="unit-name"
          autoComplete="off"
          ref={inputRef}
          value={unitNameInput}
          onChange={(e) => setUnitNameInput(e.target.value)}
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
