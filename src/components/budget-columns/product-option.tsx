import { ProductOption } from "../../app/types/product-option";
import { PriceRange } from "../../app/types/product-option";
import IsCheckedIcon from "../is-checked-icon";

export type ProductOptionDisplayProps = {
  id: string;
  displayedPriceRange: PriceRange;
  displayedExactPrice: number | null;
  description: string | null;
  productTier: number | null;
  isSelected: boolean;
};

export default function ProductOptionDisplay({
  option,
}: {
  option: ProductOptionDisplayProps;
}) {
  function renderPriceDisplay() {
    if (
      option.displayedExactPrice == null &&
      option.displayedPriceRange.lowPriceInDollars == null
    ) {
      return "-";
    } else if (option.displayedExactPrice && option.displayedExactPrice == 0) {
      return `${option.displayedExactPrice}`;
    }
    if (
      option.displayedPriceRange.lowPriceInDollars == null ||
      option.displayedPriceRange.lowPriceInDollars == null
    ) {
      return "-";
    } else if (
      option.displayedPriceRange.lowPriceInDollars > 0 &&
      option.displayedPriceRange.highPriceInDollars! != 0
    ) {
      return `$${option.displayedPriceRange.lowPriceInDollars} - $${option.displayedPriceRange.highPriceInDollars}`;
    }
    return "-";
  }

  return (
    <div
      className={`relative text-center border-b rounded-sm p-3 ${
        option.isSelected ? "bg-sims-green-50" : ""
      }`}
    >
      <div className="absolute right-1">
        <IsCheckedIcon isChecked={option.isSelected} iconSize="1rem" />
      </div>
      <p
        className={`text-sm ${option.isSelected ? "font-bold" : "font-normal"}`}
      >
        {renderPriceDisplay()}
      </p>
      <p className="text-stone-600 text-xs">{option.description}</p>
    </div>
  );
}
