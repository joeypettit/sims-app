import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Project } from "../../app/types/project";
import { getProjectById } from "../../api/api";
import { useNavigate } from "react-router-dom";
import PanelHeaderBar from "../../components/page-header-bar";
import Button from "../../components/button";
import AddProjectAreaModal from "../../components/add-project-area-modal";
import { useState } from "react";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addAreaModalIsOpen, setAddAreaModalIsOpen] = useState(false);

  // Fetch the details for the specific item using the ID from the route params
  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (id == undefined || id == null) throw Error;
      const response = (await getProjectById(id)) as Project;
      return response;
    },
  });

  function handleAddAreaClick() {
    setAddAreaModalIsOpen(true);
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
      <div className="flex justify-center">
        <div className="border border-gray-300 p-1 my-20 rounded w-1/2">
          <div className="flex flex-row justify-between">
            <h2 className="font-bold my-4">Project Areas:</h2>
            <Button
              className="my-4"
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
                    className="p-1 cursor-pointer bg-white odd:bg-sims-green-100 hover:bg-sims-green-200 active:shadow-inner"
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
        isOpen={addAreaModalIsOpen}
        setIsOpen={setAddAreaModalIsOpen}
        project={projectQuery.data}
      />
    </>
  );
}
