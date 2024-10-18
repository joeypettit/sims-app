import type { LineItem } from "../app/types/line-item";
import type { LineItemOption } from "../app/types/line-item-option";

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
