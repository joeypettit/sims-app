import { ProductOption } from "./product-option";

export type ProductLineItem = {
  title: string;
  quantity: number?;
  productOptions: ProductOption[];
};
