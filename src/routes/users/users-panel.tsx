import { useQuery } from "@tanstack/react-query";
import type { PanelTableColumn } from "../../components/panel-table";
import PanelTable from "../../components/panel-table";
import { getUsers } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { User } from "../../app/types/user";
import { useState } from "react";
import Button from "../../components/button";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import AddUserModal from "../../components/add-user-modal";

export default function UsersPanel() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("1");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const limit = "10";
  
  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: async () => {
      const response = await getUsers({ page: currentPage, limit });
      return response;
    }
  });

  const handleRowClick = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage.toString());
  };

  const columns: PanelTableColumn<User>[] = [
    {
      columnName: "Name",
      orderIndex: 1,
      cellRenderer: (user) => `${user.firstName} ${user.lastName}`
    },
    {
      columnName: "Email",
      orderIndex: 2,
      cellRenderer: (user) => user.userAccount?.email
    },
    {
      columnName: "Role",
      orderIndex: 3,
      cellRenderer: (user) => user.userAccount?.isAdmin ? "Admin" : "User"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button variant="white" onClick={() => setIsAddUserModalOpen(true)}>
          <FaPlus />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">Loading users...</div>
      ) : !data ? (
        <div className="text-center py-4 text-gray-500">Error loading users</div>
      ) : data.users.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No users found</div>
      ) : (
        <>
          <PanelTable
            data={data.users}
            columns={columns}
            onRowClick={handleRowClick}
          />
          {data.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="white"
                onClick={() => handlePageChange(Number(currentPage) - 1)}
                disabled={currentPage === "1"}
                className="disabled:bg-white disabled:border-gray-200"
              >
                <FaChevronLeft className="disabled:text-gray-300" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {data.pagination.pages}
              </span>
              <Button
                variant="white"
                onClick={() => handlePageChange(Number(currentPage) + 1)}
                disabled={currentPage === data.pagination.pages.toString()}
                className="disabled:bg-white disabled:border-gray-200"
              >
                <FaChevronRight className="disabled:text-gray-300" />
              </Button>
            </div>
          )}
        </>
      )}

      <AddUserModal
        isOpen={isAddUserModalOpen}
        setIsOpen={setIsAddUserModalOpen}
      />
    </div>
  );
} 