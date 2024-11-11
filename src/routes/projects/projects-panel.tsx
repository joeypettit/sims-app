import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PanelTableColumn } from "../../components/panel-table";
import PanelTable from "../../components/panel-table";
import { useNavigate } from "react-router-dom";
import { Project } from "../../app/types/project";
import { getAllProjects } from "../../api/api";

export default function ProjectsPanel() {
  const navigate = useNavigate();
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey: ["all-projects"],
    queryFn: async () => {
      const response = await getAllProjects();
      return response;
    },
  });

  const handleRowClick = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  const columns: PanelTableColumn<Project>[] = [
    {
      columnName: "Client",
      dataObjectKey: "name",
      orderIndex: 1,
      cellRenderer: (project) =>
        project.clients.map((client, index) => {
          const isLastElement = project.clients.length == index + 1;
          return (
            <span key={client.id}>{`${client.firstName} ${client.lastName}${
              isLastElement ? "" : ", "
            }`}</span>
          );
        }),
    },
    {
      columnName: "Project",
      dataObjectKey: "name",
      orderIndex: 2,
      // headerRenderer: () => "THE POST",
      // cellRenderer: (Project) => <span>{Project?.name}</span>,
    },
    {
      columnName: "Sales Team",
      dataObjectKey: "users",
      orderIndex: 3,
      // headerRenderer: () => "THE POST",
      cellRenderer: (project) =>
        project.users.map((user, index) => {
          const isLastElement = project.users.length == index + 1;
          return (
            <span key={user.id}>{`${user.firstName} ${user.lastName}${
              isLastElement ? "" : ", "
            }`}</span>
          );
        }),
    },
  ];

  return (
    <>
      {query.data && (
        <PanelTable
          data={query.data}
          columns={columns}
          onRowClick={(row) => handleRowClick(row)}
        />
      )}
    </>
  );
}
