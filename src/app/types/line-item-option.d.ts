import type { OptionTier } from "./option-tier";
import type { LineItem } from "./line-item";

export type LineItemOption = {
  id: string;
  lowCostInDollarsPerUnit?: number;
  highCostInDollarsPerUnit?: number;
  exactCostInDollarsPerUnit?: number;
  priceAdjustmentDecimal: number;
  description: string?;
  optionTier: OptionTier;
  isSelected: boolean;
};
