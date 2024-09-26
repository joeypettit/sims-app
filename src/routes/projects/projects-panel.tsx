import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PanelTableColumn } from "../../components/panel-table";
import PanelWindow from "../../components/panel-window";
import PanelTable from "../../components/panel-table";
import { useNavigate } from "react-router-dom";
import { Project } from "../../app/types/project";
import { getAllProjects } from "../../api/project-api";

export default function ProjectsPanel() {
  const navigate = useNavigate();
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await getAllProjects();
      return (await response) as Project[];
    },
  });

  const handleRowClick = (project: Project) => {
    // Navigate to the details page programmatically
    navigate(`/project/${project.id}`);
    console.log("ProjectS");
  };

  const columns: PanelTableColumn<Project>[] = [
    {
      columnName: "Client",
      dataObjectKey: "name",
      orderIndex: 1,
      headerRenderer: () => "Client",
      cellRenderer: (Project) => (
        <span>{`${Project?.client?.firstName} ${Project?.client?.lastName}`}</span>
      ),
    },
    {
      columnName: "Project",
      dataObjectKey: "name",
      orderIndex: 2,
      // headerRenderer: () => "THE POST",
      // cellRenderer: (Project) => <span>{Project?.name}</span>,
    },
    {
      columnName: "Start Date",
      dataObjectKey: "startDate",
      orderIndex: 3,
      // headerRenderer: () => "THE POST",
      // cellRenderer: (Project) => <span>{Project?.name}</span>,
    },
  ];

  return (
    <PanelWindow>
      {query.data && (
        <PanelTable
          data={query.data}
          columns={columns}
          onRowClick={(row) => handleRowClick(row)}
        />
      )}
    </PanelWindow>
  );
}
