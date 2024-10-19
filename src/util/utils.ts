import type { LineItem } from "../app/types/line-item";
import type { LineItemOption } from "../app/types/line-item-option";
import type { LineItemGroup } from "../app/types/line-item-group";
import type { PriceRange } from "../app/types/price-range";

export function calculateMarginDecimal({
  salePricePerUnit,
  costPerUnit,
}: {
  salePricePerUnit: number;
  costPerUnit: number;
}) {
  if (salePricePerUnit === 0) {
    throw new Error("Sale price cannot be zero.");
  }
  const margin = (salePricePerUnit - costPerUnit) / salePricePerUnit;
  return margin; // This will return the margin as a decimal (e.g., 0.33 for 33% margin)
}

export function calculateSalesPricePerUnit({
  marginDecimal,
  costPerUnit,
}: {
  marginDecimal: number;
  costPerUnit: number;
}) {
  if (typeof marginDecimal !== "number" || typeof costPerUnit !== "number") {
    throw new Error(
      "Invalid input: marginDecimal and costPerUnit must be numbers."
    );
  }

  if (marginDecimal < 0 || marginDecimal >= 1) {
    throw new Error("Invalid margin: Margin decimal must be between 0 and 1.");
  }

  return costPerUnit / (1 - marginDecimal);
}

export function getCurrentlySelectedOption(
  lineItem: LineItem
): LineItemOption | undefined {
  return lineItem.lineItemOptions.find((option) => option.isSelected);
}

export function getGroupsTotalSalePrice(group: LineItemGroup) {
  const totalPriceRange = group.lineItems.reduce<PriceRange>(
    (acc, currentItem) => {
      const selectedOption = getCurrentlySelectedOption(currentItem);
      if (!selectedOption) return acc;

      const lineItemTotal = calculateOptionsTotalSalePrice({
        option: selectedOption,
        lineItem: currentItem,
      });

      if (typeof lineItemTotal == "number") {
        return {
          lowPriceInDollars: acc.lowPriceInDollars + lineItemTotal,
          highPriceInDollars: acc.highPriceInDollars + lineItemTotal,
        };
      }

      return {
        lowPriceInDollars:
          lineItemTotal.lowPriceInDollars + acc.lowPriceInDollars,
        highPriceInDollars:
          lineItemTotal.highPriceInDollars + acc.highPriceInDollars,
      };
    },
    { lowPriceInDollars: 0, highPriceInDollars: 0 } as PriceRange
  );
  return totalPriceRange;
}

export function calculateOptionsTotalSalePrice({
  option,
  lineItem,
}: {
  option: LineItemOption;
  lineItem: LineItem;
}) {
  const quantity = lineItem.quantity ? lineItem.quantity : 0;
  const optionCost = getOptionsPerUnitCost(option);

  if (typeof optionCost === "number") {
    const salePricePerUnit = calculateSalesPricePerUnit({
      marginDecimal: lineItem.marginDecimal,
      costPerUnit: optionCost,
    });
    return Math.ceil(salePricePerUnit * quantity);
  }

  const lowSalePricePerUnit = calculateSalesPricePerUnit({
    marginDecimal: lineItem.marginDecimal,
    costPerUnit: optionCost.lowPriceInDollars,
  });
  const highSalePricePerUnit = calculateSalesPricePerUnit({
    marginDecimal: lineItem.marginDecimal,
    costPerUnit: optionCost.highPriceInDollars,
  });
  return {
    lowPriceInDollars: Math.ceil(lowSalePricePerUnit * quantity),
    highPriceInDollars: Math.ceil(highSalePricePerUnit * quantity),
  } as PriceRange;
}

export function getOptionsPerUnitCost(
  option: LineItemOption
): PriceRange | number {
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
