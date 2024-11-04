import { useState } from "react";
import type { LineItemOption } from "../../app/types/line-item-option";
import PanelWindow from "../../components/panel-window";
import { useLocation } from "react-router-dom";
import type { LineItemUnit } from "../../app/types/line-item-unit";
import { useQuery } from "@tanstack/react-query";
import { getUnits } from "../../api/api";
import UnitSelector from "../../components/unit-selector";

const unitOptions = [
  { id: "1", name: "Piece" },
  { id: "2", name: "Square Foot" },
];

const optionTierOptions = [
  { id: "1", name: "Premium" },
  { id: "2", name: "Designer" },
  { id: "3", name: "Luxury" },
];

type LineItemFormData = {
  name: string;
  quantity: number;
  unitId: string;
  marginDecimal: number;
  //   lineItemOptions: OptionFormData[];
};

// export type OptionFormData = {
//   description: string;
//   highCostInDollarsPerUnit: number;
//   lowCostInDollarsPerUnit: number;
//   exactCostInDollarsPerUnit: number;
//   priceAdjustmentDecimal: number;
//   tier: { name: string; tierLevel: number };
// };

export default function CreateLineItem() {
  const location = useLocation().state;
  const group = location.state;
  const [formData, setFormData] = useState<LineItemFormData>({
    name: "",
    quantity: 0,
    unitId: "",
    marginDecimal: 0.1,
    // lineItemOptions: [
    //   {
    //     description: "",
    //     highCostInDollarsPerUnit: 0,
    //     lowCostInDollarsPerUnit: 0,
    //     exactCostInDollarsPerUnit: 0,
    //     priceAdjustmentDecimal: 0,
    //     tier: { name: "Premium", tierLevel: 0 },
    //   },
    //   {
    //     description: "",
    //     highCostInDollarsPerUnit: 0,
    //     lowCostInDollarsPerUnit: 0,
    //     exactCostInDollarsPerUnit: 0,
    //     priceAdjustmentDecimal: 0,
    //     tier: { name: "Designer", tierLevel: 1 },
    //   },
    //   {
    //     description: "",
    //     highCostInDollarsPerUnit: 0,
    //     lowCostInDollarsPerUnit: 0,
    //     exactCostInDollarsPerUnit: 0,
    //     priceAdjustmentDecimal: 0,
    //     tier: { name: "Luxury", tierLevel: 2 },
    //   },
    // ],
  });

  // Handle input changes
  function handleLineItemChangeEvent(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleUnitSelection(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedUnitId = e.target.value;
    setFormData({ ...formData, unitId: e.target.value });
  }

  //   function handleOptionChangeEvent(
  //     e: React.ChangeEvent<HTMLInputElement>,
  //     optionIndex: number
  //   ) {
  //     const { name, value } = e.target;
  //     console.log("formData before update:", formData);

  //     // Create a deep copy to ensure immutability
  //     const updatedData = {
  //       ...formData,
  //       lineItemOptions: [...formData.lineItemOptions],
  //     };

  //     // Update the specific field in the specific option
  //     updatedData.lineItemOptions[optionIndex] = {
  //       ...updatedData.lineItemOptions[optionIndex],
  //       [name]: value,
  //     };

  //     console.log("updatedData after update:", updatedData);

  //     setFormData(updatedData);
  //   }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Line Item Data:", formData);
  }

  return (
    <PanelWindow>
      <h1 className="text-lg">Create New Line Item</h1>
      <form onSubmit={handleSubmit} className="p-2">
        <div className="flex flex-row">
          <div className="flex flex-col justify-around">
            <div className="p-2">
              <label htmlFor="name" className="block mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleLineItemChangeEvent}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
            <div className="p-2">
              <label htmlFor="marginDecimal" className="block f mb-1">
                Margin (Decimal)
              </label>
              <input
                type="number"
                id="marginDecimal"
                name="marginDecimal"
                value={formData.marginDecimal}
                onChange={handleLineItemChangeEvent}
                step="0.01"
                max={"0.99"}
                min={"0"}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
          </div>
          <div className="flex flex-col justify-around">
            <div className="p-2">
              <label htmlFor="quantity" className="block mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleLineItemChangeEvent}
                step="0.01"
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
            <div className="p-2">
              <UnitSelector
                name="unit"
                value={formData.unitId}
                onChange={handleUnitSelection}
              />
              {/* <label htmlFor="unitId" className="block mb-1">
                Unit
              </label>
              <select
                id="unitId"
                name="unitId"
                value={formData.unit.id}
                onChange={handleUnitSelection}
                required
                className="border border-gray-300 p-1 rounded w-full"
              >
                {unitOptions.map((unit) => {
                  return <option value={unit.id}>{unit.name}</option>;
                })}
              </select> */}
            </div>
          </div>
        </div>
        {/* {formData.lineItemOptions.map((option, index) => {
          return (
            <div>
              <h1>{option.tier.name}</h1>
              <label htmlFor="marginDecimal" className="block f mb-1">
                Price Adjustement
              </label>
              <input
                type="number"
                id="priceAdjustmentDecimal"
                name="priceAdjustmentDecimal"
                value={formData.lineItemOptions[index].priceAdjustmentDecimal}
                onChange={(e) => handleOptionChangeEvent(e, index)}
                step="0.01"
                max={"0.99"}
                min={"0"}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
          );
        })} */}
        <div>
          <button
            type="submit"
            className="bg-sims-green-600 text-white px-4 py-2 rounded hover:bg-sims-green-700"
          >
            Submit
          </button>
        </div>
      </form>
    </PanelWindow>
  );
}
