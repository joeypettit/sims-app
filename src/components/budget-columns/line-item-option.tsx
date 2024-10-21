import type { LineItemOption } from "../../app/types/line-item-option";
import type { PriceRange } from "../../app/types/price-range";
import IsCheckedIcon from "../is-checked-icon";
import type { LineItem } from "../../app/types/line-item";
import type { LineItemGroup } from "../../app/types/line-item-group";
import {
  calculateOptionsTotalSalePrice,
  formatNumberWithCommas,
} from "../../util/utils";

export type LineItemOptionDisplayProps = {
  lineItemOption: LineItemOption;
  lineItem: LineItem;
  onOptionSelection: ({
    optionToSelect,
  }: {
    optionToSelect: LineItemOption;
  }) => void;
};

export default function LineItemOptionDisplay({
  props,
}: {
  props: LineItemOptionDisplayProps;
}) {
  function getDisplayedPrice() {
    const salePrice = calculateOptionsTotalSalePrice({
      option: props.lineItemOption,
      lineItem: props.lineItem,
    });
    if (typeof salePrice == "number") {
      return `$${salePrice}`;
    }
    const lowPrice = formatNumberWithCommas(salePrice.lowPriceInDollars);
    const highPrice = formatNumberWithCommas(salePrice.highPriceInDollars);
    return `$${lowPrice} - $${highPrice}`;
  }

  return (
    <div
      onClick={() =>
        props.onOptionSelection({
          optionToSelect: props.lineItemOption,
        })
      }
      className={`cursor-pointer hover:shadow-inner relative text-center rounded-sm p-3 ${
        props.lineItemOption.isSelected ? "bg-sims-green-50 shadow-inner" : ""
      }`}
    >
      <div className="absolute right-1">
        <IsCheckedIcon
          isChecked={props.lineItemOption.isSelected}
          iconSize="1rem"
        />
      </div>
      <p
        className={`text-sm ${
          props.lineItemOption.isSelected ? "font-bold" : "font-normal"
        }`}
      >
        {getDisplayedPrice()}
      </p>
      <p className="text-stone-600 text-xs">
        {props.lineItemOption.description}
      </p>
    </div>
  );
}
