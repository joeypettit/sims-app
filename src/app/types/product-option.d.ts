import { ProductTier } from "./product-tier";

export type ProductOption = {
  priceRange: PriceRange?;
  exactPriceInDollars: string?;
  description: string?;
  productTier: ProductTier;
};

type PriceRange = {
  lowPriceInDollars: number;
  highPriceInDollars: number;
};
