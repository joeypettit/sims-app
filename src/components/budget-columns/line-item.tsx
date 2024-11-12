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

export type LineItemDisplayProps = {
  lineItem: LineItem;
  group: LineItemGroup;
};

export default function LineItemDisplay(props: LineItemDisplayProps) {
  const queryClient = useQueryClient();
  const quantity = props.lineItem.quantity ? props.lineItem.quantity : 0;

  function onQuantityChange(value: number) {
    updateLineItemQuantityMutation.mutate({
      lineItemId: props.lineItem.id,
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
            if (group.id !== props.lineItem.lineItemGroup.id) return group; // Not the target group, keep it the same
            return {
              ...group,
              lineItems: group.lineItems.map((lineItem: LineItem) => {
                if (lineItem.id !== props.lineItem.id) return lineItem;
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
    const selectedOption = getCurrentlySelectedOption(props.lineItem);
    if (selectedOption) {
      const lineTotal = getOptionsTotalSalePrice({
        option: selectedOption,
        lineItem: props.lineItem,
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
            if (group.id !== props.lineItem.lineItemGroup.id) return group; // Not the target group, keep it the same
            return {
              ...group,
              lineItems: group.lineItems.map((lineItem: LineItem) => {
                if (lineItem.id !== props.lineItem.id) return lineItem;
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
    optionToSelect: LineItemOption;
  }) {
    updateOptionSelectionMutation.mutate({
      optionToSelect: optionToSelect,
      optionToUnselect: getCurrentlySelectedOption(props.lineItem),
      lineItem: props.lineItem,
    });
  }

  return (
    <div className="grid grid-cols-5 gap-4 py-2">
      <div className="flex flex-col text-center items-center pr-4">
        <h1>{props.lineItem.name}</h1>
        <QuantityInput value={quantity} onChange={onQuantityChange} />
        <h6 className="text-gray-500">{props.lineItem?.unit?.name}</h6>
      </div>
      {props.lineItem.lineItemOptions.map((option, index) => {
        return (
          <LineItemOptionDisplay
            key={`product-option-${index}`}
            props={{
              lineItemOption: option,
              lineItem: props.lineItem,
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
