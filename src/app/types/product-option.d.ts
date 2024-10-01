import type { ProductTier } from "./product-tier";
import type { PriceRange } from "./price-range";

export type ProductOption = {
  id: string;
  priceRangePerUnit: PriceRange?;
  exactPriceInDollarsPerUnit: number?;
  description: string?;
  productTier: number;
  isSelected: boolean;
};
