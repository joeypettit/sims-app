import React from "react";
import ReactDOM from "react-dom";
import Button from "./button";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
};

export default function Modal({
  isOpen,
  title = "Are you sure?",
  onConfirm,
  onCancel,
  children,
}: ModalProps) {
  // Only render the modal if it's open
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-center rounded-lg shadow-lg w-96 p-6">
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

        <div className="mb-4">{children}</div>

        <div className="flex justify-center gap-2">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onConfirm && (
            <Button variant="primary" onClick={onConfirm}>
              Confirm
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
