import { LineItem } from "./line-item";

export type LineItemGroup = {
  id: string;
  name: string;
  lineItems: LineItem[];
};
