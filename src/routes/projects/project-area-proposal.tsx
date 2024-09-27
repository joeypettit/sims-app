import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProjectAreaById } from "../../api/project-api";
import { ProjectArea } from "../../app/types/project-area";
import PanelWindow from "../../components/panel-window";
import LineItemGroupContainer from "../../components/budget-columns/line-item-group";
import { LineItemGroup } from "../../app/types/line-item-group";
import { LineItem } from "../../app/types/line-item";
import { ProductOption } from "../../app/types/product-option";
import { PriceRange } from "../../app/types/product-option";
import { useState } from "react";

export default function ProjectAreaProposal() {
  const { areaId } = useParams();
  const [projAreaTotal, setProjAreaTotal] = useState<PriceRange>({
    lowPriceInDollars: 0,
    highPriceInDollars: 0,
  });

  // Fetch the details for the specific item using the ID from the route params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["area", areaId],
    queryFn: async () => {
      if (areaId == undefined || areaId == null) throw Error;
      const response = (await getProjectAreaById(areaId)) as ProjectArea;
      return response;
    },
  });

  function updateProjectAreaTotal() {}

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
        {data?.lineItemGroups.map((group: LineItemGroup) => {
          return <LineItemGroupContainer lineItemGroup={group} />;
        })}
      </div>
    </PanelWindow>
  );
}
