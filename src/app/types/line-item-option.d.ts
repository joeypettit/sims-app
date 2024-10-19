import type { OptionTier } from "./option-tier";
import type { LineItem } from "./line-item";

export type LineItemOption = {
  id: string;
  lowCostInDollarsPerUnit: number;
  highCostInDollarsPerUnit: number;
  exactCostInDollarsPerUnit?: number;
  priceAdjustmentPercentage: number;
  description: string?;
  tier: OptionTier;
  isSelected: boolean;
  lineItem: LineItem;
};
