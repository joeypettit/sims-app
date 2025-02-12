import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectById, removeUserFromProject, removeClientFromProject, getProjectCostRange } from "../../api/api";
import Button from "../../components/button";
import AddProjectManagerModal from "../../components/add-project-manager-modal";
import AddProjectClientModal from "../../components/add-project-client-modal";
import PanelHeaderBar from "../../components/page-header-bar";
import AddProjectAreaModal from "../../components/add-project-area-modal";
import DeleteProjectAreaModal from "../../components/delete-project-area-modal";
import { useState } from "react";
import { Project } from "../../app/types/project";
import ProjectManagersList from "../../components/project-managers-list";
import ProjectClientsList from "../../components/project-clients-list";
import { FaPlus } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { formatNumberWithCommas } from "../../util/utils";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showDeleteAreaModal, setShowDeleteAreaModal] = useState(false);
  const [selectedAreaToDelete, setSelectedAreaToDelete] = useState<{ id: string; name: string | null } | null>(null);
  const [managerErrorMessage, setManagerErrorMessage] = useState<string | null>(null);
  const [clientErrorMessage, setClientErrorMessage] = useState<string | null>(null);

  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id || ""),
    enabled: !!id,
  });

  const projectCostQuery = useQuery({
    queryKey: ["project-cost", id],
    queryFn: () => getProjectCostRange(id || ""),
    enabled: !!id,
  });

  const queryClient = useQueryClient();

  const removeUserMutation = useMutation({
    mutationFn: (userId: string) => {
      if (projectQuery.data?.users.length === 1) {
        throw new Error("Project must have at least one manager");
      }
      return removeUserFromProject(id || '', userId);
    },
    onSuccess: () => {
      projectQuery.refetch();
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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

  function handleDeleteAreaClick(areaId: string, areaName: string | null, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedAreaToDelete({ id: areaId, name: areaName });
    setShowDeleteAreaModal(true);
  }

  function handleDeleteModalClose() {
    setShowDeleteAreaModal(false);
    setSelectedAreaToDelete(null);
  }

  function getProjectTotalCost() {
    if (!projectCostQuery.data) return "-";
    
    if (projectCostQuery.data.lowPriceInDollars <= 0 && projectCostQuery.data.highPriceInDollars <= 0) {
      return "-";
    }

    const lowPrice = formatNumberWithCommas(projectCostQuery.data.lowPriceInDollars);
    const highPrice = formatNumberWithCommas(projectCostQuery.data.highPriceInDollars);
    return `$${lowPrice} - $${highPrice}`;
  }

  if (projectQuery.isLoading || projectCostQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (projectQuery.isError) {
    return <p>Error: {projectQuery.error.message}</p>;
  }

  if (projectCostQuery.isError) {
    console.error("Error loading project cost:", projectCostQuery.error);
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
        <div className="border border-gray-300 p-4 rounded shadow w-full max-w-4xl mx-4">
          <div className="flex flex-row mb-4 justify-between items-center">
            <h2 className="font-bold">Project Areas</h2>
            <Button
              size="xs"
              variant="white"
              onClick={handleAddAreaClick}
              className="py-1"
            >
              <FaPlus />
            </Button>
          </div>
          <div>
            <ul>
              {projectQuery.data?.areas.map((area) => {
                return (
                  <li
                    key={area.id}
                    className="group p-2 cursor-pointer bg-white odd:bg-sims-green-100 hover:bg-sims-green-200 active:shadow-inner rounded flex justify-between items-center"
                    onClick={() => navigate(`area/${area.id}`)}
                  >
                    <span>{area.name}</span>
                    <button
                      onClick={(e) => handleDeleteAreaClick(area.id, area.name, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <IoMdCloseCircle size={20} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Project Total Cost */}
        <div className="p-8 border border-gray-300 font-bold rounded shadow">
          Project Total: {getProjectTotalCost()}
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
      {selectedAreaToDelete && (
        <DeleteProjectAreaModal
          isOpen={showDeleteAreaModal}
          setIsOpen={handleDeleteModalClose}
          areaId={selectedAreaToDelete.id}
          projectId={id || ''}
          areaName={selectedAreaToDelete.name || ''}
        />
      )}
    </>
  );
}
