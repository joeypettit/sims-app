import { LineItemOption } from "../../app/types/line-item-option";
import { useState, useEffect } from "react";
import type { LineItem } from "../../app/types/line-item";
import LineItemOptionDisplay from "./product-option";
import QuantityInput from "../quantity-input";
import type { PriceRange } from "../../app/types/price-range";
import { useDispatch, useSelector } from "react-redux";
import { adjustTotalDollars } from "../../app/slices/project-area-slice";
import { isPriceRange } from "../../app/types/type-guards/price-range-guard";

export default function LineItemDisplay({
  lineItem,
  onLineItemOptionSelection,
}: {
  lineItem: LineItem;
  onLineItemOptionSelection: (selectedOptionId: string) => void;
}) {
  const [lineItemQuanity, setLineItemQuanity] = useState(
    () => lineItem.quantity ?? 1
  );
  const [lineItemOptions, setLineItemOptions] = useState(() =>
    // sort by product tier
    lineItem.lineItemOptions.sort((a, b) => {
      if (a.productTier > b.productTier) return 1;
      if (a.productTier < b.productTier) return -1;
      return 0;
    })
  );

  function onQuanityChange(value: number) {
    setLineItemQuanity(value);
  }

  function updateProjectAreaTotal({
    newOption,
    prevOption,
  }: {
    newOption: LineItemOption;
    prevOption?: LineItemOption;
  }) {
    const prevOptionPrice = prevOption
      ? calculateTotalOptionPrice(prevOption)
      : 0;
    const newOptionPrice = calculateTotalOptionPrice(newOption);
    const totalAdjustment = calculateTotalAdjustment({
      prevOptionPrice,
      newOptionPrice,
    });
  }

  function calculateTotalAdjustment({
    newOptionPrice,
    prevOptionPrice,
  }: {
    newOptionPrice: PriceRange | number;
    prevOptionPrice?: PriceRange | number;
  }): PriceRange {
    if (isPriceRange(newOptionPrice) && isPriceRange(prevOptionPrice)) {
      return {
        lowPriceInDollars:
          newOptionPrice.lowPriceInDollars - prevOptionPrice.lowPriceInDollars,
        highPriceInDollars:
          newOptionPrice.highPriceInDollars -
          prevOptionPrice.highPriceInDollars,
      };
    }

    if (isPriceRange(newOptionPrice) && !isPriceRange(prevOptionPrice)) {
      const prevPrice = prevOptionPrice ?? 0; // Use 0 if prevOptionPrice is null
      return {
        lowPriceInDollars: newOptionPrice.lowPriceInDollars - prevPrice,
        highPriceInDollars: newOptionPrice.highPriceInDollars - prevPrice,
      };
    }

    if (isPriceRange(prevOptionPrice) && !isPriceRange(newOptionPrice)) {
      const newPrice = newOptionPrice ?? 0; // Use 0 if newOptionPrice is null
      return {
        lowPriceInDollars: prevOptionPrice.lowPriceInDollars - newPrice,
        highPriceInDollars: prevOptionPrice.highPriceInDollars - newPrice,
      };
    }
    return { lowPriceInDollars: 0, highPriceInDollars: 0 };
  }

  function getCurrentlySelectedOption() {
    return lineItemOptions.find((option) => option.isSelected);
  }

  function getOptionsPerUnitCost(option: LineItemOption): PriceRange | number {
    if (option.exactCostInDollarsPerUnit != null) {
      return option.exactCostInDollarsPerUnit;
    }

    if (option.lowCostInDollarsPerUnit && option.highCostInDollarsPerUnit) {
      return {
        lowPriceInDollars: option.lowCostInDollarsPerUnit,
        highPriceInDollars: option.highCostInDollarsPerUnit,
      } as PriceRange;
    }
    return 0;
  }

  function calculateTotalOptionPrice(option: LineItemOption) {
    const optionPrice = getOptionsPerUnitCost(option);
    if (typeof optionPrice === "number") {
      return Math.ceil(optionPrice * lineItemQuanity);
    }
    return {
      lowPriceInDollars: Math.ceil(
        optionPrice.lowPriceInDollars * lineItemQuanity
      ),
      highPriceInDollars: Math.ceil(
        optionPrice.highPriceInDollars * lineItemQuanity
      ),
    } as PriceRange;
  }

  function renderCurrentLineTotal() {
    const selectedOption = getCurrentlySelectedOption();
    if (selectedOption) {
      const lineTotal = calculateTotalOptionPrice(selectedOption);
      if (lineTotal == 0) return "-";
      else if (typeof lineTotal === "number") return `$${lineTotal}`;
      else if (lineTotal?.highPriceInDollars <= 0) return "-";
      return `$${lineTotal?.lowPriceInDollars} - $${lineTotal?.highPriceInDollars}`;
    }
    return "-";
  }

  return (
    <div className="grid grid-cols-5 gap-4 py-2">
      <div className="flex flex-col text-center items-center pr-4">
        <h1>{lineItem.name}</h1>
        <QuantityInput value={lineItemQuanity} onChange={onQuanityChange} />
        <h6 className="text-gray-500">{lineItem.unit.name}</h6>
      </div>
      {lineItemOptions.map((option, index) => {
        return (
          <LineItemOptionDisplay
            key={`product-option-${index}`}
            props={{
              lineItemQuantity: lineItemQuanity,
              lineItemOption: option,
              onSelection: onLineItemOptionSelection,
            }}
          />
        );
      })}
      <div className="text-sm text-center font-bold pr-4 col-end-6">
        {renderCurrentLineTotal()}
      </div>
    </div>
  );
}
