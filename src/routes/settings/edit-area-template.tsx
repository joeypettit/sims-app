import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import { getAreaTemplate } from "../../api/api";
import ProjectAreaProposal from "../projects/project-area-proposal";

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
  console.log("template", areaTemplateQuery.data);
  return (
    <>
      <h1>{areaTemplateQuery.data?.name}</h1>
      <ProjectAreaProposal
        areaIdFromProps={areaTemplateQuery.data?.projectAreaId}
      />
    </>
  );
}
