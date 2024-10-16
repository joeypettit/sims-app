import { LineItemOption } from "../../app/types/line-item-option";
import { useState } from "react";
import type { LineItem } from "../../app/types/line-item";
import LineItemOptionDisplay from "./line-item-option";
import QuantityInput from "../quantity-input";
import type { PriceRange } from "../../app/types/price-range";
import type { LineItemGroup } from "../../app/types/line-item-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOptionSelection } from "../../api/api";
import type { ProjectArea } from "../../app/types/project-area";

export type LineItemDisplayProps = {
  lineItem: LineItem;
  group: LineItemGroup;
};

export default function LineItemDisplay(props: LineItemDisplayProps) {
  const queryClient = useQueryClient();
  const [lineItemQuanity, setLineItemQuanity] = useState(
    () => props.lineItem.quantity ?? 1
  );
  const optionsSortedByTier = props.lineItem.lineItemOptions.sort((a, b) => {
    console.log("a,", a);
    if (a.optionTier.tierLevel > b.optionTier.tierLevel) return 1;
    if (a.optionTier.tierLevel < b.optionTier.tierLevel) return -1;
    return 0;
  });

  function onQuanityChange(value: number) {
    setLineItemQuanity(value);
  }

  // function updateProjectAreaTotal({
  //   newOption,
  //   prevOption,
  // }: {
  //   newOption: LineItemOption;
  //   prevOption?: LineItemOption;
  // }) {
  //   const prevOptionPrice = prevOption
  //     ? calculateTotalOptionPrice(prevOption)
  //     : 0;
  //   const newOptionPrice = calculateTotalOptionPrice(newOption);
  //   const totalAdjustment = calculateTotalAdjustment({
  //     prevOptionPrice,
  //     newOptionPrice,
  //   });
  // }

  // function calculateTotalAdjustment({
  //   newOptionPrice,
  //   prevOptionPrice,
  // }: {
  //   newOptionPrice: PriceRange | number;
  //   prevOptionPrice?: PriceRange | number;
  // }): PriceRange {
  //   if (isPriceRange(newOptionPrice) && isPriceRange(prevOptionPrice)) {
  //     return {
  //       lowPriceInDollars:
  //         newOptionPrice.lowPriceInDollars - prevOptionPrice.lowPriceInDollars,
  //       highPriceInDollars:
  //         newOptionPrice.highPriceInDollars -
  //         prevOptionPrice.highPriceInDollars,
  //     };
  //   }

  //   if (isPriceRange(newOptionPrice) && !isPriceRange(prevOptionPrice)) {
  //     const prevPrice = prevOptionPrice ?? 0; // Use 0 if prevOptionPrice is null
  //     return {
  //       lowPriceInDollars: newOptionPrice.lowPriceInDollars - prevPrice,
  //       highPriceInDollars: newOptionPrice.highPriceInDollars - prevPrice,
  //     };
  //   }

  //   if (isPriceRange(prevOptionPrice) && !isPriceRange(newOptionPrice)) {
  //     const newPrice = newOptionPrice ?? 0; // Use 0 if newOptionPrice is null
  //     return {
  //       lowPriceInDollars: prevOptionPrice.lowPriceInDollars - newPrice,
  //       highPriceInDollars: prevOptionPrice.highPriceInDollars - newPrice,
  //     };
  //   }
  //   return { lowPriceInDollars: 0, highPriceInDollars: 0 };
  // }

  function getCurrentlySelectedOption() {
    return props.lineItem.lineItemOptions.find((option) => option.isSelected);
  }

  function getOptionsPerUnitCost(option: LineItemOption): PriceRange | number {
    if (option.exactCostInDollarsPerUnit != null) {
      return option.exactCostInDollarsPerUnit;
    }

    if (option.lowCostInDollarsPerUnit && option.highCostInDollarsPerUnit) {
      return {
        lowPriceInDollars: option.lowCostInDollarsPerUnit,
        highPriceInDollars: option.highCostInDollarsPerUnit,
      } as PriceRange;
    }
    return 0;
  }

  function calculateTotalOptionPrice(option: LineItemOption) {
    const optionPrice = getOptionsPerUnitCost(option);
    if (typeof optionPrice === "number") {
      return Math.ceil(optionPrice * lineItemQuanity);
    }
    return {
      lowPriceInDollars: Math.ceil(
        optionPrice.lowPriceInDollars * lineItemQuanity
      ),
      highPriceInDollars: Math.ceil(
        optionPrice.highPriceInDollars * lineItemQuanity
      ),
    } as PriceRange;
  }

  function renderCurrentLineTotal() {
    const selectedOption = getCurrentlySelectedOption();
    if (selectedOption) {
      const lineTotal = calculateTotalOptionPrice(selectedOption);
      if (lineTotal == 0) return "-";
      else if (typeof lineTotal === "number") return `$${lineTotal}`;
      else if (lineTotal?.highPriceInDollars <= 0) return "-";
      return `$${lineTotal?.lowPriceInDollars} - $${lineTotal?.highPriceInDollars}`;
    }
    return "-";
  }

  ////

  const updateOptionSelectionMutation = useMutation({
    mutationFn: updateOptionSelection,
    onMutate: async (variables) => {
      const { optionToSelect } = variables;

      await queryClient.cancelQueries({ queryKey: ["area"] });

      const previousProjectArea = queryClient.getQueryData(["area"]);

      queryClient.setQueryData(["area"], (oldData: ProjectArea | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          lineItemGroups: oldData.lineItemGroups.map((group) => {
            if (group.id !== props.lineItem.lineItemGroup.id) return group; // Not the target group, keep it the same
            return {
              ...group,
              lineItems: group.lineItems.map((lineItem: LineItem) => {
                if (lineItem.id !== props.lineItem.id) return lineItem;
                return {
                  ...lineItem,
                  lineItemOptions: lineItem.lineItemOptions.map((option) =>
                    option.id === optionToSelect.id
                      ? { ...option, isSelected: true }
                      : { ...option, isSelected: false }
                  ),
                };
              }),
            };
          }),
        };
      });
      return { previousProjectArea };
    },
    onError: (error, variables, context) => {
      console.log("There was an ERROR:", error);
      if (context?.previousProjectArea) {
        queryClient.setQueryData(["area"], context.previousProjectArea);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["area"] });
    },
  });

  async function onOptionSelection({
    optionToSelect,
  }: {
    optionToSelect: LineItemOption;
  }) {
    updateOptionSelectionMutation.mutate({
      optionToSelect: optionToSelect,
      optionToUnselect: getCurrentlySelectedOption(),
      lineItem: props.lineItem,
    });
  }

  ////

  return (
    <div className="grid grid-cols-5 gap-4 py-2">
      <div className="flex flex-col text-center items-center pr-4">
        <h1>{props.lineItem.name}</h1>
        <QuantityInput value={lineItemQuanity} onChange={onQuanityChange} />
        <h6 className="text-gray-500">{props.lineItem.unit.name}</h6>
      </div>
      {optionsSortedByTier.map((option, index) => {
        return (
          <LineItemOptionDisplay
            key={`product-option-${index}`}
            props={{
              lineItemQuantity: lineItemQuanity,
              lineItemOption: option,
              onOptionSelection: onOptionSelection,
            }}
          />
        );
      })}
      <div className="text-sm text-center font-bold pr-4 col-end-6">
        {renderCurrentLineTotal()}
      </div>
    </div>
  );
}
