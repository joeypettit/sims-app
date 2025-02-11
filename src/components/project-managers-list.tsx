import { User } from "../app/types/user";
import Button from "./button";
import { IoMdCloseCircle } from "react-icons/io";
import { FiAlertCircle } from "react-icons/fi";

type ProjectManagersListProps = {
  users: User[];
  onRemoveUser: (userId: string) => void;
  onAddManager: () => void;
  errorMessage: string | null;
  isRemoveLoading: boolean;
};

export default function ProjectManagersList({
  users,
  onRemoveUser,
  onAddManager,
  errorMessage,
  isRemoveLoading
}: ProjectManagersListProps) {
  return (
    <div className="border border-gray-300 p-4 rounded">
      <div className="flex flex-row justify-between">
        <h2 className="font-bold mb-4">Project Managers</h2>
        <Button
          size="xs"
          variant="white"
          onClick={onAddManager}
        >
          +
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
          {users.map((user) => (
            <li
              key={user.id}
              className="group p-2 bg-white odd:bg-sims-green-100 rounded flex justify-between items-center hover:bg-sims-green-200 active:shadow-inner"
            >
              <span>{user.firstName} {user.lastName}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveUser(user.id);
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