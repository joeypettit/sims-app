import type { LineItemOption } from "../../app/types/line-item-option";
import type { PriceRange } from "../../app/types/price-range";
import IsCheckedIcon from "../is-checked-icon";
import type { LineItem } from "../../app/types/line-item";
import type { LineItemGroup } from "../../app/types/line-item-group";
import { calculateSalesPricePerUnit } from "../../util/utils";

export type LineItemOptionDisplayProps = {
  lineItemQuantity: number;
  lineItemOption: LineItemOption;
  lineItemMarginDecimal: number;
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
    if (
      props.lineItemOption.exactCostInDollarsPerUnit != null &&
      props.lineItemOption.exactCostInDollarsPerUnit != undefined
    ) {
      const salePricePerUnit = calculateSalesPricePerUnit({
        marginDecimal: props.lineItemMarginDecimal,
        costPerUnit: props.lineItemOption.exactCostInDollarsPerUnit,
      });
      return `$${Math.ceil(salePricePerUnit * props.lineItemQuantity)}`;
    }

    if (
      props.lineItemOption.lowCostInDollarsPerUnit &&
      props.lineItemOption.highCostInDollarsPerUnit
    ) {
      const lowSalePricePerUnit = calculateSalesPricePerUnit({
        marginDecimal: props.lineItemMarginDecimal,
        costPerUnit: props.lineItemOption.lowCostInDollarsPerUnit,
      });
      const highSalePricePerUnit = calculateSalesPricePerUnit({
        marginDecimal: props.lineItemMarginDecimal,
        costPerUnit: props.lineItemOption.highCostInDollarsPerUnit,
      });

      if (lowSalePricePerUnit === highSalePricePerUnit) {
        return `$${Math.ceil(lowSalePricePerUnit)}`;
      }

      return `$${Math.ceil(lowSalePricePerUnit) * props.lineItemQuantity} - $${
        Math.ceil(highSalePricePerUnit) * props.lineItemQuantity
      }`;
    }

    // Default case if no price information is available
    return "-";
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
