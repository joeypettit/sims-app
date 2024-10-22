import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Project } from "../../app/types/project";
import { getProjectById } from "../../api/api";
import { ProjectArea } from "../../app/types/project-area";
import { useNavigate } from "react-router-dom";
import PanelWindow from "../../components/panel-window";
import Button from "../../components/button";

export default function SettingsPanel() {
  const navigate = useNavigate();

  // Fetch the details for the specific item using the ID from the route params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      return { blah: "blahblah" };
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
      <h1>Settings</h1>
      <div>
        <div className="flex flex-row bg-sims-green-100">
          <h2>Templates</h2>
          <Button
            size="xs"
            variant="primary"
            onClick={() => navigate("/settings/add-template")}
          >
            +
          </Button>
        </div>
      </div>
    </PanelWindow>
  );
}
