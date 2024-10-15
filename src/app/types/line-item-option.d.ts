import type { ProductTier } from "./product-tier";

export type LineItemOption = {
  id: string;
  lowCostInDollarsPerUnit: number;
  highCostInDollarsPerUnit: number;
  exactCostInDollarsPerUnit?: number;
  priceAdjustmentPercentage: number;
  description: string?;
  productTier: ProductTier;
  isSelected: boolean;
};
