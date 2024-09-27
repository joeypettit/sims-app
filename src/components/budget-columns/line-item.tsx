import { ProductOption } from "../../app/types/product-option";
import { useState } from "react";
import { LineItem } from "../../app/types/line-item";
import ProductOptionDisplay from "./product-option";
import QuantityInput from "../quantity-input";
import { PriceRange } from "../../app/types/product-option";

export default function LineItemDisplay({ lineItem }: { lineItem: LineItem }) {
  const [lineItemQuanity, setLineItemQuanity] = useState(1);

  function onQuanityChange(value: number) {
    setLineItemQuanity(value);
  }

  function getPriceDisplayString(option: ProductOption) {
    if (
      option.exactPriceInDollarsPerUnit ||
      option.exactPriceInDollarsPerUnit == 0
    ) {
      return `$${option.exactPriceInDollarsPerUnit * lineItemQuanity}`;
    }

    if (
      option.priceRangePerUnit?.lowPriceInDollars != null &&
      option.priceRangePerUnit.highPriceInDollars
    ) {
      if (
        option.priceRangePerUnit?.lowPriceInDollars * lineItemQuanity == 0 &&
        option.priceRangePerUnit?.highPriceInDollars * lineItemQuanity == 0
      ) {
        return `-`;
      } else if (
        option.priceRangePerUnit?.lowPriceInDollars * lineItemQuanity ||
        option.priceRangePerUnit?.highPriceInDollars * lineItemQuanity
      ) {
        return `$${
          option.priceRangePerUnit.lowPriceInDollars * lineItemQuanity
        } - $${option.priceRangePerUnit.highPriceInDollars * lineItemQuanity}`;
      }
    }
    return "-";
  }

  function getTotalledPriceRange(option: ProductOption): PriceRange {
    if (
      option.priceRangePerUnit?.lowPriceInDollars &&
      option.priceRangePerUnit.highPriceInDollars
    ) {
      return {
        lowPriceInDollars: Math.ceil(
          lineItemQuanity * option.priceRangePerUnit?.lowPriceInDollars
        ),
        highPriceInDollars: Math.ceil(
          lineItemQuanity * option.priceRangePerUnit?.highPriceInDollars
        ),
      };
    }
    return {
      lowPriceInDollars: null,
      highPriceInDollars: null,
    };
  }

  function getTotalledExactPrice(option: ProductOption) {
    if (option.exactPriceInDollarsPerUnit) {
      return Math.ceil(lineItemQuanity * option.exactPriceInDollarsPerUnit);
    }
    return null;
  }

  function getSelectedProductOption() {
    return lineItem.productOptions.find((option) => option.isSelected);
  }

  function getSelectedOptionsPrice(): PriceRange | number | null {
    const selectedOption = getSelectedProductOption();
    if (selectedOption == undefined) return null;
    if (selectedOption.exactPriceInDollarsPerUnit)
      return getTotalledExactPrice(selectedOption);
    return getTotalledPriceRange(selectedOption);
  }

  function getLineItemTotal() {
    const selectedOption = getSelectedProductOption();
    if (selectedOption) {
      const selectedOptionPrice = getSelectedOptionsPrice();

      if (selectedOptionPrice === null) {
        return 0;
      } else if (typeof selectedOptionPrice === "number") {
        return selectedOptionPrice;
      } else {
        const selectedPriceRange: PriceRange = {
          lowPriceInDollars: selectedOptionPrice.lowPriceInDollars,
          highPriceInDollars: selectedOptionPrice.highPriceInDollars,
        };
        return selectedPriceRange;
      }
    }
  }

  function renderLineTotal() {
    const lineTotal = getLineItemTotal();
    if (lineTotal === null) return "-";
    if (typeof lineTotal === "number") return `$${lineTotal}`;
    if (lineTotal?.highPriceInDollars == 0) return "-";
    return `$${lineTotal?.lowPriceInDollars} - $${lineTotal?.highPriceInDollars}`;
  }

  return (
    <>
      <div className="flex flex-row py-2">
        <div className="flex-none w-24 pr-4">
          <h1>{lineItem.name}</h1>
          <QuantityInput value={lineItemQuanity} onChange={onQuanityChange} />
        </div>
        <div className="flex-auto grid grid-cols-3 gap-4">
          {lineItem.productOptions.map((option) => {
            const priceDisplayString = getPriceDisplayString(option);
            return (
              <ProductOptionDisplay
                props={{ priceDisplayString: priceDisplayString, ...option }}
              />
            );
          })}
        </div>
        <div>{renderLineTotal()}</div>
      </div>
    </>
  );
}
