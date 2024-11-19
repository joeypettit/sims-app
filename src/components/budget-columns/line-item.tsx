import { LineItemOption } from "../../app/types/line-item-option";
import type { LineItem } from "../../app/types/line-item";
import LineItemOptionDisplay from "./line-item-option";
import QuantityInput from "../quantity-input";
import type { LineItemGroup } from "../../app/types/line-item-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOptionSelection, updateLineItemQuantity } from "../../api/api";
import type { ProjectArea } from "../../app/types/project-area";
import { getCurrentlySelectedOption } from "../../util/utils";
import { getOptionsTotalSalePrice } from "../../util/utils";
import { formatNumberWithCommas } from "../../util/utils";
import LineItemActionsButton from "../line-item-actions-button";

export type LineItemDisplayProps = {
  lineItem: LineItem;
  group: LineItemGroup;
};

export default function LineItemDisplay({
  lineItem,
  group,
}: LineItemDisplayProps) {
  const queryClient = useQueryClient();
  const quantity = lineItem.quantity ? lineItem.quantity : 0;

  function onQuantityChange(value: number) {
    updateLineItemQuantityMutation.mutate({
      lineItemId: lineItem.id,
      quantity: value,
    });
  }

  const updateLineItemQuantityMutation = useMutation({
    mutationFn: updateLineItemQuantity,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["area"] });

      const previousProjectArea = queryClient.getQueryData(["area"]);

      queryClient.setQueryData(["area"], (oldData: ProjectArea | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          lineItemGroups: oldData.lineItemGroups.map((group) => {
            if (group.id !== lineItem.lineItemGroup.id) return group; // Not the target group, keep it the same
            return {
              ...group,
              lineItems: group.lineItems.map((lineItem: LineItem) => {
                if (lineItem.id !== lineItem.id) return lineItem;
                return {
                  ...lineItem,
                  quantity: variables.quantity,
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
      queryClient.invalidateQueries({
        queryKey: ["area-template"],
      });
    },
  });

  function getCurrentLineTotal() {
    const selectedOption = getCurrentlySelectedOption(lineItem);
    if (selectedOption) {
      const lineTotal = getOptionsTotalSalePrice({
        option: selectedOption,
        lineItem: lineItem,
      });
      if (lineTotal == 0) return "-";
      else if (typeof lineTotal === "number")
        return `$${formatNumberWithCommas(lineTotal)}`;
      else if (lineTotal?.highPriceInDollars <= 0) return "-";
      const lowPrice = formatNumberWithCommas(lineTotal.lowPriceInDollars);
      const highPrice = formatNumberWithCommas(lineTotal.highPriceInDollars);
      return `$${lowPrice} - $${highPrice}`;
    }
    return "-";
  }

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
            if (group.id !== lineItem.lineItemGroup.id) return group; // Not the target group, keep it the same
            return {
              ...group,
              lineItems: group.lineItems.map((lineItem: LineItem) => {
                if (lineItem.id !== lineItem.id) return lineItem;
                return {
                  ...lineItem,
                  lineItemOptions: lineItem.lineItemOptions.map((option) =>
                    option.id === optionToSelect?.id
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
    optionToSelect: LineItemOption | undefined;
  }) {
    const optionToUnselect = getCurrentlySelectedOption(lineItem);
    if (optionToSelect?.id == optionToUnselect?.id) {
      optionToSelect = undefined;
    }

    updateOptionSelectionMutation.mutate({
      optionToSelect: optionToSelect,
      optionToUnselect: optionToUnselect,
      lineItem: lineItem,
    });
  }

  return (
    <div className="grid grid-cols-5 gap-4 py-2 pl-4 ">
      <div className="flex flex-col text-center items-center pr-4 ">
        <div className="flex flex-row justify-between w-full">
          <h1>{lineItem.name}</h1>
          <LineItemActionsButton lineItem={lineItem} />
        </div>
        <QuantityInput value={quantity} onChange={onQuantityChange} />
        <h6 className="text-gray-500">{lineItem?.unit?.name}</h6>
      </div>
      {lineItem.lineItemOptions.map((option, index) => {
        return (
          <LineItemOptionDisplay
            key={`product-option-${index}`}
            props={{
              lineItemOption: option,
              lineItem: lineItem,
              onOptionSelection: onOptionSelection,
            }}
          />
        );
      })}
      <div className="flex justify-end items-center text-sm font-bold pr-4 col-end-6">
        {getCurrentLineTotal()}
      </div>
    </div>
  );
}
