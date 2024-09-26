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

  function getDisplayedPriceRange(option: ProductOption): PriceRange {
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

  function getDisplayedExactPrice(option: ProductOption) {
    return (
      option.exactPriceInDollarsPerUnit &&
      Math.ceil(lineItemQuanity * option.exactPriceInDollarsPerUnit)
    );
  }

  function getSelectedPrice(
    option: ProductOption | undefined
  ): PriceRange | number | null {
    const selectedOption = lineItem.productOptions.find(
      (option) => option.isSelected
    );
    if (option == null) return null;
    if (selectedOption?.exactPriceInDollarsPerUnit) {
      return getDisplayedExactPrice(option);
    }
    return getDisplayedPriceRange(option);
  }

  function getSelectedProductOption() {
    return lineItem.productOptions.find((option) => option.isSelected);
  }

  function renderSelectedPrice() {
    const selectedOption = getSelectedProductOption();
    const selectedPrice = getSelectedPrice(selectedOption);

    if (selectedPrice === null) {
      return <span>-</span>;
    } else if (typeof selectedPrice === "number") {
      <span>{selectedPrice}</span>;
    } else {
      return (
        <span>{`$${selectedPrice.lowPriceInDollars} - $${selectedPrice.highPriceInDollars}`}</span>
      );
    }
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
            const displayedExactPrice = getDisplayedExactPrice(option);
            const displayedPriceRange = getDisplayedPriceRange(option);
            console.log("exact", option);

            return (
              <ProductOptionDisplay
                option={{
                  displayedPriceRange: displayedPriceRange,
                  displayedExactPrice: displayedExactPrice,
                  ...option,
                }}
              />
            );
          })}
        </div>
        <div>{renderSelectedPrice()}</div>
      </div>
    </>
  );
}
