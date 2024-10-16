import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Project } from "../../app/types/project";
import { getProjectById } from "../../api/api";
import { ProjectArea } from "../../app/types/project-area";
import { useNavigate } from "react-router-dom";
import PanelWindow from "../../components/panel-window";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the details for the specific item using the ID from the route params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (id == undefined || id == null) throw Error;
      const response = (await getProjectById(id)) as Project;
      return response;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <PanelWindow>
      <h1>{data?.name}</h1>
      <p>
        {data?.areas.map((area: ProjectArea) => (
          <div
            className="cursor-pointer"
            key={area.id}
            onClick={() => navigate(`area/${area.id}`)}
          >
            {area.name}
          </div>
        ))}
      </p>
    </PanelWindow>
  );
}
