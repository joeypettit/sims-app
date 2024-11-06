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
    if (isNaN(Number(value))) return;
    if (Number(value) < 0) return;
    const valueAsDecimal = Number(value) / 100;
    const newOption = structuredClone(option);
    newOption.priceAdjustmentDecimal = valueAsDecimal;
    onChange(newOption);
  }

  return (
    <div>
      <div>
        <OptionTierBadge tier={option.optionTier}></OptionTierBadge>
      </div>{" "}
      <div>
        <OptionCostInput option={option} onChange={onChange} />
        <label htmlFor="marginDecimal" className="block mb-1">
          Price Adjustment
        </label>
        <div className="flex flex-row justify-center items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*\.?[0-9]*"
            id="priceAdjustmentDecimal"
            name="priceAdjustmentDecimal"
            value={option.priceAdjustmentDecimal * 100}
            onChange={onPriceAdjustmentChange}
            required
            className="border border-gray-300 p-1 rounded w-full"
          />
          <span>%</span>
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
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
    </div>
  );
}
