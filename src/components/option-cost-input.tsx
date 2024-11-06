import { useState } from "react";
import { LineItemOption } from "../app/types/line-item-option";
import OptionTierBadge from "./option-tier-badge";

type OptionCostInputProps = {
  option: LineItemOption;
  onChange: (updatedOption: LineItemOption) => void;
};

export default function OptionCostInput({
  option,
  onChange,
}: OptionCostInputProps) {
  const [useExactCost, setUseExactCost] = useState(false);

  const handleToggle = (isExact: boolean) => {
    const newOption = structuredClone(option);
    newOption.highCostInDollarsPerUnit = undefined;
    newOption.lowCostInDollarsPerUnit = undefined;
    newOption.exactCostInDollarsPerUnit = undefined;
    console.log("new options", newOption);
    onChange(newOption);
    setUseExactCost(isExact);
  };

  function onLowCostChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const trimmedValue = trimLeadingZeros(value);
    if (Number(value) < 0) return;
    const newOption = structuredClone(option);
    newOption.lowCostInDollarsPerUnit = Number(trimmedValue);
    newOption.exactCostInDollarsPerUnit = undefined;
    onChange(newOption);
  }
  function onHighCostChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const trimmedValue = trimLeadingZeros(value);
    if (Number(value) < 0) return;
    const newOption = structuredClone(option);
    newOption.highCostInDollarsPerUnit = Number(trimmedValue);
    newOption.exactCostInDollarsPerUnit = undefined;
    onChange(newOption);
  }

  function onExactCostChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const trimmedValue = trimLeadingZeros(value);
    if (Number(value) < 0) return;
    const newOption = structuredClone(option);
    newOption.exactCostInDollarsPerUnit = Number(trimmedValue);
    newOption.highCostInDollarsPerUnit = undefined;
    newOption.lowCostInDollarsPerUnit = undefined;
    onChange(newOption);
  }

  function trimLeadingZeros(value: string) {
    value = value.toString();
    value = value.replace(/^0+(?=\d|\.|$)/, "");
    return value;
  }

  console.log("option", option);
  return (
    <div className="p-4">
      <div>Cost:</div>
      <div className="flex flex-row justify-around">
        <div className="flex justify-center items-center mb-4">
          <label className="mr-2">Range</label>
          <input
            type="checkbox"
            checked={!useExactCost}
            onChange={() => handleToggle(false)}
            className="cursor-pointer bg-sims-green-900"
          />
        </div>
        <div className="flex justify-center items-center mb-4">
          <label className="mr-2">Exact</label>
          <input
            type="checkbox"
            checked={useExactCost}
            onChange={() => handleToggle(true)}
            className="cursor-pointer sims-green-900"
          />
        </div>
      </div>

      {useExactCost ? (
        <div className="mb-4">
          <label htmlFor="exactCostInDollarsPerUnit" className="hidden mb-1">
            Exact Cost (Per Unit)
          </label>
          <div className="flex flex-row justify-center items-center">
            <span className="p-1">$</span>
            <input
              type="number"
              id="exactCostInDollarsPerUnit"
              name="exactCostInDollarsPerUnit"
              placeholder="Exact Cost (per unit)"
              value={option.exactCostInDollarsPerUnit}
              onChange={onExactCostChange}
              disabled={!useExactCost}
              className="border border-gray-300 p-1 rounded w-full"
            />
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <label className="mb-1 hidden">Cost Range (Per Unit):</label>
          <div className="flex space-x-2">
            <div className="flex flex-row justify-center items-center">
              <span className="p-1">$</span>
              <input
                type="number"
                name="lowCostInDollarsPerUnit"
                placeholder="Low Cost (per unit)"
                value={option.lowCostInDollarsPerUnit?.toString()}
                onChange={onLowCostChange}
                disabled={useExactCost}
                className="border border-gray-300 p-1 rounded w-full"
              />
              <span className="px-2"> - </span>
              <span className="p-1">$</span>
              <input
                type="number"
                name="highCostInDollarsPerUnit"
                placeholder="High Cost (per unit)"
                value={option.highCostInDollarsPerUnit?.toString()}
                onChange={onHighCostChange}
                disabled={useExactCost}
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
