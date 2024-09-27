import { ProductOption } from "../../app/types/product-option";
import { PriceRange } from "../../app/types/product-option";
import IsCheckedIcon from "../is-checked-icon";

export type ProductOptionDisplayProps = {
  id: string;
  priceDisplayString: string;
  description: string | null;
  productTier: number | null;
  isSelected: boolean;
};

export default function ProductOptionDisplay({
  props,
}: {
  props: ProductOptionDisplayProps;
}) {
  // function renderPriceDisplay() {
  //   if (
  //     option.displayedExactPrice == null &&
  //     option.displayedPriceRange.lowPriceInDollars == null
  //   ) {
  //     return "-";
  //   } else if (option.displayedExactPrice && option.displayedExactPrice == 0) {
  //     return `${option.displayedExactPrice}`;
  //   }
  //   if (
  //     option.displayedPriceRange.lowPriceInDollars == null ||
  //     option.displayedPriceRange.lowPriceInDollars == null
  //   ) {
  //     return "-";
  //   } else if (
  //     option.displayedPriceRange.lowPriceInDollars > 0 &&
  //     option.displayedPriceRange.highPriceInDollars! != 0
  //   ) {
  //     return `$${option.displayedPriceRange.lowPriceInDollars} - $${option.displayedPriceRange.highPriceInDollars}`;
  //   }
  //   return "-";
  // }

  return (
    <div
      className={`relative text-center border-b rounded-sm p-3 ${
        props.isSelected ? "bg-sims-green-50" : ""
      }`}
    >
      <div className="absolute right-1">
        <IsCheckedIcon isChecked={props.isSelected} iconSize="1rem" />
      </div>
      <p
        className={`text-sm ${props.isSelected ? "font-bold" : "font-normal"}`}
      >
        {props.priceDisplayString}
      </p>
      <p className="text-stone-600 text-xs">{props.description}</p>
    </div>
  );
}
