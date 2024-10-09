import type { ProductTier } from "./product-tier";
import type { PriceRange } from "./price-range";

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
