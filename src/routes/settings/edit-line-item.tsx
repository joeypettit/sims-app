import { useState, useEffect } from "react";
import type { LineItemOption } from "../../app/types/line-item-option";
import PanelWindow from "../../components/panel-window";
import { useLocation, useNavigation, useParams } from "react-router-dom";
import type { LineItemUnit } from "../../app/types/line-item-unit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnits } from "../../api/api";
import UnitSelector from "../../components/unit-selector";
import { createBlankLineItem } from "../../api/api";
import type { LineItemGroup } from "../../app/types/line-item-group";
import QuantityInput from "../../components/quantity-input";
import type { LineItem } from "../../app/types/line-item";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import { getLineItem } from "../../api/api";

// type LineItemFormData = {
//   name: string;
//   quantity: number;
//   unitId: string;
//   marginDecimal: number;
//   lineItemOptions: OptionFormData[];
// };

// export type OptionFormData = {
//   description: string;
//   highCostInDollarsPerUnit: number;
//   lowCostInDollarsPerUnit: number;
//   exactCostInDollarsPerUnit: number;
//   priceAdjustmentDecimal: number;
//   tier: { name: string; tierLevel: number };
// };

export default function EditLineItem() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { lineItemId } = useParams();
  const [formData, setFormData] = useState<LineItem | undefined>(undefined);

  const lineItemQuery = useQuery({
    queryKey: ["line-item", lineItemId],
    queryFn: async () => {
      if (!lineItemId) {
        throw Error("Line Item Id is required.");
      }
      const result = await getLineItem(lineItemId);
      return result;
    },
    staleTime: Infinity,
    refetchOnMount: "always",
  });

  // Handle input changes
  function onNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (formData) {
      setFormData({ ...formData, name: value });
    }
  }

  function onMarginInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (formData) {
      setFormData({ ...formData, marginDecimal: Number(value) });
    }
  }

  function onQuantityChange(newValue: number) {
    if (formData) {
      setFormData({ ...formData, quantity: newValue });
    }
  }

  function handleUnitSelection(selectedUnit: LineItemUnit) {
    if (formData) {
      setFormData({ ...formData, unit: { ...selectedUnit } });
    }
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
  }

  useEffect(() => {
    // prepopulate local state for form
    if (lineItemQuery.data && !formData) {
      setFormData(lineItemQuery.data);
    }
  }, [lineItemQuery.data, formData]);

  if (!formData) {
    return (
      <PanelWindow>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner centered />
        </div>
      </PanelWindow>
    );
  }

  return (
    <PanelWindow>
      <h1 className="text-lg">Create New Line Item</h1>
      <form onSubmit={handleSubmit} className="p-2">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                value={formData.name}
                onChange={onNameInputChange}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="marginDecimal" className="block f mb-1">
                Margin (Decimal)
              </label>
              <input
                type="number"
                id="marginDecimal"
                name="marginDecimal"
                autoComplete="off"
                value={formData.marginDecimal}
                onChange={onMarginInputChange}
                step="0.01"
                max={"0.99"}
                min={"0"}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block mb-1">
                Quantity
              </label>
              <QuantityInput
                value={formData.quantity || 0}
                onChange={onQuantityChange}
              />
            </div>
            <div>
              <label htmlFor={"unit"} className="block mb-1">
                Unit
              </label>
              <UnitSelector
                value={formData?.unit?.id || ""}
                onChange={handleUnitSelection}
              />
            </div>
          </div>
        </div>
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