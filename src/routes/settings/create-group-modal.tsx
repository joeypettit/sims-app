import { useState } from "react";
import Modal from "../../components/modal";

export default function CreateGroupModal() {
  return (
    <Modal
      isOpen={isCreateGroupModalOpen}
      onConfirm={handleCreateGroup}
      onCancel={handleCloseCreateGroupModal}
    >
      <label htmlFor="group-name" className="block text-left mb-2 font-medium">
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
