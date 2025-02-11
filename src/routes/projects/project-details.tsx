import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectById, removeUserFromProject, removeClientFromProject } from "../../api/api";
import Button from "../../components/button";
import AddProjectManagerModal from "../../components/add-project-manager-modal";
import AddProjectClientModal from "../../components/add-project-client-modal";
import PanelHeaderBar from "../../components/page-header-bar";
import AddProjectAreaModal from "../../components/add-project-area-modal";
import { useState } from "react";
import { Project } from "../../app/types/project";
import ProjectManagersList from "../../components/project-managers-list";
import ProjectClientsList from "../../components/project-clients-list";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [managerErrorMessage, setManagerErrorMessage] = useState<string | null>(null);
  const [clientErrorMessage, setClientErrorMessage] = useState<string | null>(null);

  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id || ""),
    enabled: !!id,
  });

  const removeUserMutation = useMutation({
    mutationFn: (userId: string) => {
      if (projectQuery.data?.users.length === 1) {
        throw new Error("Project must have at least one manager");
      }
      return removeUserFromProject(id || '', userId);
    },
    onSuccess: () => {
      projectQuery.refetch();
      setManagerErrorMessage(null);
    },
    onError: (error: Error) => {
      setManagerErrorMessage(error.message);
      // Clear error message after 3 seconds
      setTimeout(() => setManagerErrorMessage(null), 3000);
    }
  });

  const removeClientMutation = useMutation({
    mutationFn: (clientId: string) => removeClientFromProject(id || '', clientId),
    onSuccess: () => {
      projectQuery.refetch();
      setClientErrorMessage(null);
    },
    onError: (error: Error) => {
      setClientErrorMessage(error.message);
      setTimeout(() => setClientErrorMessage(null), 3000);
    }
  });

  function handleAddAreaClick() {
    setShowAddAreaModal(true);
  }

  function handleAddManagerClick() {
    setShowAddManagerModal(true);
  }

  function handleAddClientClick() {
    setShowAddClientModal(true);
  }

  if (projectQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (projectQuery.isError) {
    return <p>Error: {projectQuery.error.message}</p>;
  }

  return (
    <>
      <PanelHeaderBar title={`Project: ${projectQuery.data?.name}`} />
      <div className="flex flex-col items-center gap-6 mt-20">
        {/* Project Managers and Clients Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mx-4">
          {/* Clients Section */}
          <ProjectClientsList
            clients={projectQuery.data?.clients || []}
            onRemoveClient={(clientId) => removeClientMutation.mutate(clientId)}
            onAddClient={handleAddClientClick}
            errorMessage={clientErrorMessage}
            isRemoveLoading={removeClientMutation.isPending}
          />

          {/* Project Managers Section */}
          <ProjectManagersList
            users={projectQuery.data?.users || []}
            onRemoveUser={(userId) => removeUserMutation.mutate(userId)}
            onAddManager={handleAddManagerClick}
            errorMessage={managerErrorMessage}
            isRemoveLoading={removeUserMutation.isPending}
          />
        </div>

        {/* Project Areas Section */}
        <div className="border border-gray-300 p-4 rounded w-full max-w-4xl mx-4">
          <div className="flex flex-row justify-between">
            <h2 className="font-bold mb-4">Project Areas</h2>
            <Button
              size="xs"
              variant="white"
              onClick={handleAddAreaClick}
            >
              +
            </Button>
          </div>
          <div>
            <ul>
              {projectQuery.data?.areas.map((area) => {
                return (
                  <li
                    key={area.id}
                    className="p-2 cursor-pointer bg-white odd:bg-sims-green-100 hover:bg-sims-green-200 active:shadow-inner rounded"
                    onClick={() => navigate(`area/${area.id}`)}
                  >
                    {area.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <AddProjectAreaModal
        isOpen={showAddAreaModal}
        setIsOpen={setShowAddAreaModal}
        project={projectQuery.data}
      />
      <AddProjectManagerModal
        isOpen={showAddManagerModal}
        setIsOpen={setShowAddManagerModal}
        projectId={id || ''}
        currentUsers={projectQuery.data?.users || []}
      />
      <AddProjectClientModal
        isOpen={showAddClientModal}
        setIsOpen={setShowAddClientModal}
        projectId={id || ''}
        currentClients={projectQuery.data?.clients || []}
      />
    </>
  );
}
