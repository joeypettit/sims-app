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
  priceAdjustmentMultiplier,
}: {
  marginDecimal: number;
  costPerUnit: number;
  priceAdjustmentMultiplier: number;
}) {
  if (
    typeof marginDecimal !== "number" ||
    typeof costPerUnit !== "number" ||
    typeof priceAdjustmentMultiplier !== "number"
  ) {
    throw new Error(
      "Invalid input: marginDecimal, priceAdjustmentMultiplier, and costPerUnit must be numbers."
    );
  }

  if (marginDecimal < 0 || marginDecimal >= 1) {
    throw new Error("Invalid margin: Margin decimal must be between 0 and 1.");
  }

  return (costPerUnit / (1 - marginDecimal)) * priceAdjustmentMultiplier;
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

      const lineItemTotal = getOptionsTotalSalePrice({
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

export function getOptionsTotalSalePrice({
  option,
  lineItem,
}: {
  option: LineItemOption;
  lineItem: LineItem;
}) {
  const quantity = lineItem.quantity ? lineItem.quantity : 0;
  const optionCost = getOptionsPerUnitCost(option);
  const marginDecimal = lineItem.marginDecimal ? lineItem.marginDecimal : 0;
  const priceAdjustmentMultiplier = option.priceAdjustmentMultiplier
    ? option.priceAdjustmentMultiplier
    : 0;

  // if optionCost is a number, that means that it is NOT a PriceRange and IS and exact price
  if (typeof optionCost === "number") {
    const salePricePerUnit = calculateSalesPricePerUnit({
      marginDecimal: marginDecimal,
      costPerUnit: optionCost,
      priceAdjustmentMultiplier,
    });
    return Math.ceil(salePricePerUnit * quantity);
  }
  const lowSalePricePerUnit = calculateSalesPricePerUnit({
    marginDecimal: marginDecimal,
    costPerUnit: optionCost.lowPriceInDollars,
    priceAdjustmentMultiplier,
  });
  const highSalePricePerUnit = calculateSalesPricePerUnit({
    marginDecimal: marginDecimal,
    costPerUnit: optionCost.highPriceInDollars,
    priceAdjustmentMultiplier,
  });

  return {
    lowPriceInDollars: Math.ceil(lowSalePricePerUnit * quantity),
    highPriceInDollars: Math.ceil(highSalePricePerUnit * quantity),
  } as PriceRange;
}

export function getOptionsPerUnitSalePrice({
  option,
  lineItem,
}: {
  option: LineItemOption;
  lineItem: LineItem;
}) {
  const optionCost = getOptionsPerUnitCost(option);
  const marginDecimal = lineItem.marginDecimal ? lineItem.marginDecimal : 0;
  const priceAdjustmentMultiplier = option.priceAdjustmentMultiplier
    ? option.priceAdjustmentMultiplier
    : 0;

  // if optionCost is a number, that means that it is NOT a PriceRange and IS and exact price
  if (typeof optionCost === "number") {
    const salePricePerUnit = calculateSalesPricePerUnit({
      marginDecimal: marginDecimal,
      costPerUnit: optionCost,
      priceAdjustmentMultiplier,
    });
    return Math.ceil(salePricePerUnit);
  }
  const lowSalePricePerUnit = calculateSalesPricePerUnit({
    marginDecimal: marginDecimal,
    costPerUnit: optionCost.lowPriceInDollars,
    priceAdjustmentMultiplier,
  });
  const highSalePricePerUnit = calculateSalesPricePerUnit({
    marginDecimal: marginDecimal,
    costPerUnit: optionCost.highPriceInDollars,
    priceAdjustmentMultiplier,
  });

  return {
    lowPriceInDollars: Math.ceil(lowSalePricePerUnit),
    highPriceInDollars: Math.ceil(highSalePricePerUnit),
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

export function formatNumberWithCommas(num: number | string): string {
  // Convert to string in case a number is passed
  const numStr = num.toString();

  // Use regex to add commas every three digits from the right
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function simulateNetworkLatency(delay = 2000) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

export function determineNewIndex({ previousItemIndex, followingItemIndex }: { previousItemIndex: number, followingItemIndex: number }) {
  console.log("determineNewIndex", previousItemIndex, followingItemIndex)
}
