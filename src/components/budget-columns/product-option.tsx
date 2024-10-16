import type { LineItemOption } from "../../app/types/line-item-option";
import type { PriceRange } from "../../app/types/price-range";
import IsCheckedIcon from "../is-checked-icon";
import type { LineItem } from "../../app/types/line-item";
import type { LineItemGroup } from "../../app/types/line-item-group";

export type LineItemOptionDisplayProps = {
  lineItemQuantity: number;
  lineItemOption: LineItemOption;
  lineItem: LineItem;
  group: LineItemGroup;
  onOptionSelection: ({
    optionToSelect,
    optionToUnselect,
    group,
    lineItem,
  }: {
    optionToSelect: LineItemOption;
    optionToUnselect: LineItemOption;
    group: LineItemGroup;
    lineItem: LineItem;
  }) => void;
};

export default function LineItemOptionDisplay({
  props,
}: {
  props: LineItemOptionDisplayProps;
}) {
  function getDisplayedPrice(option: LineItemOption) {
    if (option.exactCostInDollarsPerUnit != null) {
      return `$${Math.ceil(
        option.exactCostInDollarsPerUnit * props.lineItemQuantity
      )}`;
    }

    if (option.lowCostInDollarsPerUnit && option.highCostInDollarsPerUnit) {
      const lowPrice = option.lowCostInDollarsPerUnit * props.lineItemQuantity;
      const highPrice =
        option.highCostInDollarsPerUnit * props.lineItemQuantity;

      if (lowPrice === highPrice) {
        return `$${Math.ceil(lowPrice)}`;
      }

      return `$${Math.ceil(lowPrice)} - $${Math.ceil(highPrice)}`;
    }

    // Default case if no price information is available
    return "-";
  }

  function getCurrentlySelectedOption() {
    return props.lineItem.lineItemOptions.find((option) => option.isSelected);
  }

  return (
    <div
      onClick={() =>
        props.onOptionSelection({
          optionToSelect: props.lineItemOption,
          optionToUnselect: getCurrentlySelectedOption(),
          group: props.group,
          lineItem: props.lineItem,
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
        {getDisplayedPrice(props.lineItemOption)}
      </p>
      <p className="text-stone-600 text-xs">
        {props.lineItemOption.description}
      </p>
    </div>
  );
}
