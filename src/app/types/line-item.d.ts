import { ProductOption } from "./line-item-option";
import { LineItemGroup } from "./line-item-group";

export type LineItem = {
  id: string;
  name: string;
  quantity: number?;
  unit: string;
  lineItemGroup: LineItemGroup;
  lineItemOptions: LineItemOption[];
};
