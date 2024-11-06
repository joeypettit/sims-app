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

  function onPriceAdjustmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    console.log("value", value);
    if (isNaN(Number(value))) return;
    if (Number(value) < 0) return;
    let valueAsDecimal = Number(value) / 100;
    console.log("valueasdecimal", valueAsDecimal);
    console.log("valueasdecimal", valueAsDecimal * 100);
    const newOption = structuredClone(option);
    newOption.priceAdjustmentDecimal = valueAsDecimal;
    onChange(newOption);
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
            <input
              type="number"
              id="priceAdjustmentDecimal"
              name="priceAdjustmentDecimal"
              value={14}
              onChange={onPriceAdjustmentChange}
              maxLength={1}
              required
              className="border border-gray-300 p-1 rounded w-full"
            />
            <span>%</span>
          </div>
        </div>
      </div>
      <div className="p-2 rounded bg-slate-50 my-2">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={option.description || ""}
          onChange={onDescriptionChange}
          required
          className="border border-gray-300 p-1 rounded w-full"
          rows={4}
          style={{ resize: "none" }}
        />
      </div>
    </div>
  );
}
