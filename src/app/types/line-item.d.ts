import { Option } from "./option";

export type LineItem = {
  id: string;
  name: string;
  quantity: number?;
  unit: string;
  allowMultipleSelection: boolean;
  productOptions: ProductOption[];
};
