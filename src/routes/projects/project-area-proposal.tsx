import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProjectAreaById } from "../../api/project-api";
import { ProjectArea } from "../../app/types/project-area";
import PanelWindow from "../../components/panel-window";
import LineItemGroupContainer from "../../components/budget-columns/line-item-group";
import { LineItemGroup } from "../../app/types/line-item-group";
import { useSelector } from "react-redux";
import { getTotalString } from "../../app/slices/project-area-slice";

export default function ProjectAreaProposal() {
  const { areaId } = useParams();

  const totalInDollars = useSelector(getTotalString);

  // Fetch the details for the specific item using the ID from the route params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["area", areaId],
    queryFn: async () => {
      if (areaId == undefined || areaId == null) throw Error;
      const response = (await getProjectAreaById(areaId)) as ProjectArea;
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
      <h2>{data?.name}</h2>
      <div>
        {data?.lineItemGroups.map((group: LineItemGroup, index) => {
          return (
            <LineItemGroupContainer
              key={`line-item-group-${index}`}
              lineItemGroup={group}
            />
          );
        })}
      </div>
      <div>{totalInDollars}</div>
    </PanelWindow>
  );
}
