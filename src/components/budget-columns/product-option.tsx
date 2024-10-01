import type { ProductOption } from "../../app/types/product-option";
import type { PriceRange } from "../../app/types/price-range";
import IsCheckedIcon from "../is-checked-icon";

export type ProductOptionDisplayProps = {
  lineItemQuantity: number;
  productOption: ProductOption;
  onSelection: (selectedOptionId: string) => void;
};

export default function ProductOptionDisplay({
  props,
}: {
  props: ProductOptionDisplayProps;
}) {
  function getDisplayedPrice(option: ProductOption) {
    if (option.exactPriceInDollarsPerUnit != null) {
      return `$${Math.ceil(
        option.exactPriceInDollarsPerUnit * props.lineItemQuantity
      )}`;
    }

    if (option.priceRangePerUnit) {
      const lowPrice =
        option.priceRangePerUnit.lowPriceInDollars * props.lineItemQuantity;
      const highPrice =
        option.priceRangePerUnit.highPriceInDollars * props.lineItemQuantity;

      if (lowPrice === highPrice) {
        return `$${Math.ceil(lowPrice)}`;
      }

      return `$${Math.ceil(lowPrice)} - $${Math.ceil(highPrice)}`;
    }

    // Default case if no price information is available
    return "-";
  }

  return (
    <div
      onClick={() => props.onSelection(props.productOption.id)}
      className={`cursor-pointer hover:shadow-inner relative text-center rounded-sm p-3 ${
        props.productOption.isSelected ? "bg-sims-green-50 shadow-inner" : ""
      }`}
    >
      <div className="absolute right-1">
        <IsCheckedIcon
          isChecked={props.productOption.isSelected}
          iconSize="1rem"
        />
      </div>
      <p
        className={`text-sm ${
          props.productOption.isSelected ? "font-bold" : "font-normal"
        }`}
      >
        {getDisplayedPrice(props.productOption)}
      </p>
      <p className="text-stone-600 text-xs">
        {props.productOption.description}
      </p>
    </div>
  );
}
