import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProjectAreaById } from "../../api/api";
import PanelWindow from "../../components/panel-window";
import LineItemGroupContainer from "../../components/budget-columns/line-item-group";
import type { LineItemGroup } from "../../app/types/line-item-group";
import type { LineItem } from "../../app/types/line-item";
import type { GroupCategory } from "../../app/types/group-category";
import type { LineItemOption } from "../../app/types/line-item-option";

export default function ProjectAreaProposal() {
  const queryClient = useQueryClient();
  const { areaId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["area"],
    queryFn: async () => {
      console.log("FETCHING AREA");
      if (areaId == undefined || areaId == null) throw Error;
      const response = await getProjectAreaById(areaId);
      return response;
    },
  });

  const groupCategories = getGroupCategories();

  function getGroupCategories() {
    // ***** this should probably be tested later on!! ****
    const catArray: GroupCategory[] = [];
    if (data?.lineItemGroups) {
      for (const group of data?.lineItemGroups) {
        const alreadyInCatArray = catArray.some((cat) => {
          return cat.id === group.groupCategory.id;
        });
        if (!alreadyInCatArray) catArray.push(group.groupCategory);
      }
    }
    return catArray;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <PanelWindow>
      <h1 className="text-xl font-bold">{data?.name}</h1>
      {groupCategories.map((category) => {
        return (
          <div key={category.id}>
            <h2 className="text-md font-bold text-center bg-sims-green-50 rounded-sm">
              {category.name}
            </h2>
            {data?.lineItemGroups.map((group: LineItemGroup, index) => {
              if (group.groupCategory.id == category.id) {
                return (
                  <LineItemGroupContainer
                    key={`line-item-group-${index}`}
                    group={group}
                  />
                );
              }
            })}
          </div>
        );
      })}

      {/* <div>{totalInDollars}</div> */}
    </PanelWindow>
  );
}
