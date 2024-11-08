import type { OptionTier } from "./option-tier";
import type { LineItem } from "./line-item";

export type LineItemOption = {
  id: string;
  lowCostInDollarsPerUnit?: number | null;
  highCostInDollarsPerUnit?: number | null;
  exactCostInDollarsPerUnit?: number | null;
  priceAdjustmentDecimal: number;
  description: string?;
  optionTier: OptionTier;
  isSelected: boolean;
};
