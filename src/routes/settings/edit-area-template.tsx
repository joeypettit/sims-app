import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import { getAreaTemplate } from "../../api/api";
import ProjectAreaProposal from "../projects/project-area-proposal";
import PanelHeaderBar from "../../components/page-header-bar";

export default function EditAreaTemplate() {
  const queryClient = useQueryClient();
  const { templateId } = useParams();

  const areaTemplateQuery = useQuery({
    queryKey: ["area-template", templateId],
    queryFn: async () => {
      if (templateId) {
        const result = await getAreaTemplate(templateId);
        return result;
      }
    },
  });

  if (areaTemplateQuery.isLoading) {
    return (
      <>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner />
        </div>
      </>
    );
  }
  if (areaTemplateQuery.isError) {
    const error = areaTemplateQuery.error;
    return <p>Error: {error?.message}</p>;
  }
  return (
    <>
      <PanelHeaderBar title={`Template: ${areaTemplateQuery.data?.name}`} />
      <ProjectAreaProposal areaId={areaTemplateQuery.data?.projectAreaId} />
    </>
  );
}
