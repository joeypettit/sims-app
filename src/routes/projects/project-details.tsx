import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Project } from "../../app/types/project";
import { getProjectById } from "../../api/api";
import { ProjectArea } from "../../app/types/project-area";
import { useNavigate } from "react-router-dom";
import PanelHeaderBar from "../../components/page-header-bar";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the details for the specific item using the ID from the route params
  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (id == undefined || id == null) throw Error;
      const response = (await getProjectById(id)) as Project;
      return response;
    },
  });

  if (projectQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (projectQuery.isError) {
    return <p>Error: {projectQuery.error.message}</p>;
  }

  return (
    <>
      <PanelHeaderBar title={`Project: ${projectQuery.data?.name}`} />
      <div>
        {projectQuery.data?.areas.map((area: ProjectArea) => (
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
        ))}
      </div>
    </>
  );
}
