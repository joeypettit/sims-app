import { NumericFormat } from "react-number-format";
import type { LineItemOption } from "../../app/types/line-item-option";
import OptionCostInput from "../../components/option-cost-input";
import OptionTierBadge from "../../components/option-tier-badge";

type OptionFormProps = {
  option: LineItemOption;
  onChange: (updatedOption: LineItemOption) => void;
};

export default function OptionForm({ option, onChange }: OptionFormProps) {
  function onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target;
    const newOption = structuredClone(option);
    newOption.description = value;
    onChange(newOption);
  }

  function onPriceAdjustmentChange(value: number | undefined) {
    if (!value) return;
    let valueAsDecimal = value / 100;
    const newOption = structuredClone(option);
    newOption.priceAdjustmentDecimal = valueAsDecimal;
    onChange(newOption);
  }

  function getPriceAdjustmentPercentage() {
    console.log(option.priceAdjustmentDecimal * 100);
    return option.priceAdjustmentDecimal * 100;
  }

  return (
    <div className="px-2">
      <div className="py-2">
        <OptionTierBadge tier={option.optionTier}></OptionTierBadge>
      </div>
      <div className="grid grid-cols-2">
        <div className="p-2 rounded bg-slate-50 mr-2">
          <OptionCostInput option={option} onChange={onChange} />
        </div>
        <div className="p-2 rounded bg-slate-50">
          <label htmlFor="marginDecimal">Price Adjustment</label>
          <div className="flex flex-row justify-center items-center">
            <NumericFormat
              className="border border-gray-300 p-1 rounded w-full"
              autoComplete="off"
              id="exactCostInDollarsPerUnit"
              name="exactCostInDollarsPerUnit"
              value={getPriceAdjustmentPercentage()}
              suffix="%"
              allowNegative={false}
              decimalScale={2}
              placeholder="Exact Cost"
              onValueChange={(values) => {
                onPriceAdjustmentChange(values.floatValue);
              }}
            />
          </div>
        </div>
      </div>
      <div className="p-2 rounded bg-slate-50 my-2">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          autoComplete="off"
          value={option.description || ""}
          onChange={onDescriptionChange}
          className="border border-gray-300 p-1 rounded w-full"
          rows={4}
          style={{ resize: "none" }}
        />
      </div>
    </div>
  );
}
