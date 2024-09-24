import { ProductTier } from "./product-tier";

export type ProductOption = {
  id: string;
  priceRange: PriceRange?;
  exactPriceInDollars: string?;
  description: string?;
  productTier: number;
  isSelected: boolean;
};

type PriceRange = {
  lowPriceInDollars: number;
  highPriceInDollars: number;
};
