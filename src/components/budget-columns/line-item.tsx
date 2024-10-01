import { ProductOption } from "../../app/types/product-option";
import { useState, useEffect } from "react";
import type { LineItem } from "../../app/types/line-item";
import ProductOptionDisplay from "./product-option";
import QuantityInput from "../quantity-input";
import type { PriceRange } from "../../app/types/price-range";
import { useDispatch, useSelector } from "react-redux";
import { adjustTotalDollars } from "../../app/slices/project-area-slice";
import { isPriceRange } from "../../app/types/type-guards/price-range-guard";

export default function LineItemDisplay({ lineItem }: { lineItem: LineItem }) {
  const dispatch = useDispatch();
  const [lineItemQuanity, setLineItemQuanity] = useState(
    () => lineItem.quantity ?? 1
  );
  const [productOptions, setProductOptions] = useState(() =>
    // sort by product tier
    lineItem.productOptions.sort((a, b) => {
      if (a.productTier > b.productTier) return 1;
      if (a.productTier < b.productTier) return -1;
      return 0;
    })
  );

  useEffect(() => {
    const selectedOption = getCurrentlySelectedOption();
    if (selectedOption) {
      updateProjectAreaTotal({ newOption: selectedOption });
    }
  }, []);

  function onQuanityChange(value: number) {
    setLineItemQuanity(value);
  }

  function onOptionSelection(newOptionId: string) {
    const prevOption = getCurrentlySelectedOption();
    let newOption = productOptions.find((option) => option.id == newOptionId);

    const updatedOptions = productOptions.map((option) => {
      if (option.id == newOptionId) {
        option.isSelected = true;
        return option;
      }
      option.isSelected = false;
      return option;
    });
    setProductOptions(updatedOptions);

    if (newOption) {
      updateProjectAreaTotal({ newOption, prevOption });
    }
  }

  function updateProjectAreaTotal({
    newOption,
    prevOption,
  }: {
    newOption: ProductOption;
    prevOption?: ProductOption;
  }) {
    const prevOptionPrice = prevOption
      ? calculateTotalOptionPrice(prevOption)
      : 0;
    const newOptionPrice = calculateTotalOptionPrice(newOption);
    const totalAdjustment = calculateTotalAdjustment({
      prevOptionPrice,
      newOptionPrice,
    });
    console.log(totalAdjustment);
    dispatch(adjustTotalDollars(totalAdjustment));
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
    return productOptions.find((option) => option.isSelected);
  }

  function getOptionsPerUnitPrice(option: ProductOption): PriceRange | number {
    if (option.exactPriceInDollarsPerUnit != null) {
      return option.exactPriceInDollarsPerUnit;
    }

    if (option.priceRangePerUnit) {
      return {
        lowPriceInDollars: option.priceRangePerUnit.lowPriceInDollars,
        highPriceInDollars: option.priceRangePerUnit.highPriceInDollars,
      } as PriceRange;
    }
    return 0;
  }

  function calculateTotalOptionPrice(option: ProductOption) {
    const optionPrice = getOptionsPerUnitPrice(option);
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
      <div className="flex flex-col items-center pr-4">
        <h1>{lineItem.name}</h1>
        <QuantityInput value={lineItemQuanity} onChange={onQuanityChange} />
      </div>
      {productOptions.map((option, index) => {
        return (
          <ProductOptionDisplay
            key={`product-option-${index}`}
            props={{
              lineItemQuantity: lineItemQuanity,
              productOption: option,
              onSelection: onOptionSelection,
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
