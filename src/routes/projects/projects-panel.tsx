import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PanelTableColumn } from "../../components/panel-table";
import PanelTable from "../../components/panel-table";
import { useNavigate } from "react-router-dom";
import { Project } from "../../app/types/project";
import { createBlankProject, getAllProjects } from "../../api/api";
import Button from "../../components/button";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import Modal from "../../components/modal";
import AddProjectModal from "../../components/add-project-modal";

export default function ProjectsPanel() {
  const navigate = useNavigate();
  // Access the client
  const queryClient = useQueryClient();
  const [panelIsLoading, setPanelIsLoading] = useState(false);
  const [addProjectModalIsOpen, setAddProjectModalIsOpen] = useState(false);

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
      <div>
        <Button variant="white" onClick={() => setAddProjectModalIsOpen(true)}>
          <FaPlus />
        </Button>
      </div>
      {query.data && (
        <PanelTable
          data={query.data}
          columns={columns}
          onRowClick={(row) => handleRowClick(row)}
        />
      )}
      <AddProjectModal
        isOpen={addProjectModalIsOpen}
        setIsOpen={setAddProjectModalIsOpen}
      />
    </>
  );
}
