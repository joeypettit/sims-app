import { ProductOption } from "../../app/types/product-option";
import { PriceRange } from "../../app/types/product-option";
import IsCheckedIcon from "../is-checked-icon";

export type ProductOptionDisplayProps = {
  displayedPriceString: string;
  productOption: ProductOption;
  onSelection: (selectedOptionId: string) => void;
};

export default function ProductOptionDisplay({
  props,
}: {
  props: ProductOptionDisplayProps;
}) {
  return (
    <div
      onClick={() => props.onSelection(props.productOption.id)}
      className={`relative text-center border-b rounded-sm p-3 ${
        props.productOption.isSelected ? "bg-sims-green-50" : ""
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
        {props.displayedPriceString}
      </p>
      <p className="text-stone-600 text-xs">
        {props.productOption.description}
      </p>
    </div>
  );
}
