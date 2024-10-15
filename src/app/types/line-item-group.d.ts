import { LineItem } from "./line-item";
import { GroupCategory } from "./group-category";

export type LineItemGroup = {
  id: string;
  name: string;
  lineItems: LineItem[];
  groupCategory: GroupCategory;
};
