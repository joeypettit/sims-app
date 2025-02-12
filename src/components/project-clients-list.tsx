import { Client } from "../app/types/client";
import Button from "./button";
import { IoMdCloseCircle } from "react-icons/io";
import { FiAlertCircle } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

type ProjectClientsListProps = {
  clients: Client[];
  onRemoveClient: (clientId: string) => void;
  onAddClient: () => void;
  errorMessage: string | null;
  isRemoveLoading: boolean;
};

export default function ProjectClientsList({
  clients,
  onRemoveClient,
  onAddClient,
  errorMessage,
  isRemoveLoading
}: ProjectClientsListProps) {
  return (
    <div className="border border-gray-300 p-4 rounded shadow">
      <div className="flex flex-row mb-4 justify-between items-center">
        <h2 className="font-bold">Clients</h2>
        <Button
          size="xs"
          variant="white"
          onClick={onAddClient}
          className="py-1"
        >
          <FaPlus />
        </Button>
      </div>
      <div>
        {errorMessage && (
          <div className="mb-2 text-sm text-red-600 bg-red-50 p-2 rounded flex items-center gap-2">
            <FiAlertCircle size={20} />
            {errorMessage}
          </div>
        )}
        <ul>
          {clients.map((client) => (
            <li
              key={client.id}
              className="group p-2 bg-white odd:bg-sims-green-100 rounded flex justify-between items-center hover:bg-sims-green-200 active:shadow-inner"
            >
              <span>{client.firstName} {client.lastName}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveClient(client.id);
                }}
                disabled={isRemoveLoading}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-colors disabled:text-gray-200"
              >
                <IoMdCloseCircle size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 