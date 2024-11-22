import { LineItem } from "./line-item";
import { GroupCategory } from "./group-category";
import { PriceRange } from "./price-range";

export type LineItemGroup = {
  id: string;
  name: string;
  lineItems: LineItem[];
  groupCategory: GroupCategory;
  totalSalePrice: PriceRange;
  isOpen: boolean;
};
