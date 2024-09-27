import { ProductOption } from "../../app/types/product-option";
import { useState } from "react";
import { LineItem } from "../../app/types/line-item";
import ProductOptionDisplay from "./product-option";
import QuantityInput from "../quantity-input";
import { PriceRange } from "../../app/types/product-option";

export default function LineItemDisplay({ lineItem }: { lineItem: LineItem }) {
  const [lineItemQuanity, setLineItemQuanity] = useState(1);
  const [productOptions, setProductOptions] = useState(() =>
    // sort by product tier
    lineItem.productOptions.sort((a, b) => {
      if (a.productTier > b.productTier) return 1;
      if (a.productTier < b.productTier) return -1;
      return 0;
    })
  );

  function onQuanityChange(value: number) {
    setLineItemQuanity(value);
  }

  function onOptionSelection(optionId: string) {
    const updatedOptions = productOptions.map((option) => {
      if (option.id == optionId) {
        option.isSelected = true;
        return option;
      }
      option.isSelected = false;
      return option;
    });
    setProductOptions(updatedOptions);
  }

  function getOptionsDisplayedPrice(option: ProductOption) {
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

  function getTotalledExactPrice(option: ProductOption) {
    if (option.exactPriceInDollarsPerUnit) {
      return Math.ceil(lineItemQuanity * option.exactPriceInDollarsPerUnit);
    }
    return null;
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

  function renderLineTotal() {
    const lineTotal = getLineItemTotal();
    if (lineTotal === null) return "-";
    if (typeof lineTotal === "number") return `$${lineTotal}`;
    if (lineTotal?.highPriceInDollars == 0) return "-";
    return `$${lineTotal?.lowPriceInDollars} - $${lineTotal?.highPriceInDollars}`;
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="text-center pr-4">
        <h1>{lineItem.name}</h1>
        <QuantityInput value={lineItemQuanity} onChange={onQuanityChange} />
      </div>
      {productOptions.map((option) => {
        const displayedPriceString = getOptionsDisplayedPrice(option);
        return (
          <ProductOptionDisplay
            props={{
              displayedPriceString: displayedPriceString,
              productOption: option,
              onSelection: onOptionSelection,
            }}
          />
        );
      })}
      <div className="text-sm text-center font-bold pr-4 col-end-6">
        {renderLineTotal()}
      </div>
    </div>
  );
}
