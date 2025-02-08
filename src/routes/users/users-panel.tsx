import { useQuery } from "@tanstack/react-query";
import type { PanelTableColumn } from "../../components/panel-table";
import PanelTable from "../../components/panel-table";
import { getUsers } from "../../api/api";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  userAccount?: {
    email: string;
    isAdmin: boolean;
  };
};

export default function UsersPanel() {
  // Queries
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

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
      {isLoading ? (
        <div className="flex justify-center py-4">Loading users...</div>
      ) : !users ? (
        <div className="text-center py-4 text-gray-500">Error loading users</div>
      ) : users.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No users found</div>
      ) : (
        <PanelTable
          data={users}
          columns={columns}
        />
      )}
    </div>
  );
} 