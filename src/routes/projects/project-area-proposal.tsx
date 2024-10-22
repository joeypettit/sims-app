import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProjectAreaById } from "../../api/api";
import PanelWindow from "../../components/panel-window";
import LineItemGroupContainer from "../../components/budget-columns/line-item-group";
import type { LineItemGroup } from "../../app/types/line-item-group";
import type { LineItem } from "../../app/types/line-item";
import type { GroupCategory } from "../../app/types/group-category";
import type { LineItemOption } from "../../app/types/line-item-option";
import { getGroupsTotalSalePrice } from "../../util/utils";
import type { PriceRange } from "../../app/types/price-range";
import { formatNumberWithCommas } from "../../util/utils";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import { simulateNetworkLatency } from "../../util/utils";

export default function ProjectAreaProposal() {
  const queryClient = useQueryClient();
  const { areaId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["area"],
    queryFn: async () => {
      if (!areaId) {
        throw new Error("Area ID is required");
      }
      const response = await getProjectAreaById(areaId);
      return response;
    },
    select: (data) => {
      const updatedGroups: LineItemGroup[] = data.lineItemGroups.map(
        (group) => {
          const salePrice = getGroupsTotalSalePrice(group);
          return { ...group, totalSalePrice: salePrice };
        }
      );
      const totalAreaPrice: PriceRange = updatedGroups.reduce(
        (acc: PriceRange, currentGroup: LineItemGroup) => {
          return {
            lowPriceInDollars:
              acc.lowPriceInDollars +
              currentGroup.totalSalePrice.lowPriceInDollars,
            highPriceInDollars:
              acc.highPriceInDollars +
              currentGroup.totalSalePrice.highPriceInDollars,
          };
        },
        { lowPriceInDollars: 0, highPriceInDollars: 0 } as PriceRange
      );

      return {
        ...data,
        lineItemGroups: updatedGroups,
        totalSalePrice: totalAreaPrice,
      };
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

  function getAreasTotalSalePrice() {
    if (data?.totalSalePrice) {
      if (
        data.totalSalePrice?.lowPriceInDollars <= 0 &&
        data.totalSalePrice?.highPriceInDollars <= 0
      )
        return "-";
      const lowPrice = formatNumberWithCommas(
        data.totalSalePrice?.lowPriceInDollars
      );
      const highPrice = formatNumberWithCommas(
        data.totalSalePrice?.highPriceInDollars
      );
      return `$${lowPrice} - $${highPrice}`;
    }
    return "-";
  }

  if (isLoading) {
    return (
      <PanelWindow>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner />
        </div>
      </PanelWindow>
    );
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
      <div>Project Total: {getAreasTotalSalePrice()}</div>
    </PanelWindow>
  );
}
