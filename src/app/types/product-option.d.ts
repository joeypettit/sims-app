import { ProductTier } from "./product-tier";

export type ProductOption = {
  id: string;
  priceRangePerUnit: PriceRange?;
  exactPriceInDollarsPerUnit: number?;
  description: string?;
  productTier: number;
  isSelected: boolean;
};

export type PriceRange = {
  lowPriceInDollars: number?;
  highPriceInDollars: number?;
};
