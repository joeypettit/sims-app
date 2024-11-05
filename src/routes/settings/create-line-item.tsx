import { useState } from "react";
import type { LineItemOption } from "../../app/types/line-item-option";
import PanelWindow from "../../components/panel-window";
import { useLocation, useNavigation } from "react-router-dom";
import type { LineItemUnit } from "../../app/types/line-item-unit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnits } from "../../api/api";
import UnitSelector from "../../components/unit-selector";
import { createLineItem } from "../../api/api";
import type { LineItemGroup } from "../../app/types/line-item-group";
import QuantityInput from "../../components/quantity-input";

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
  lineItemOptions: OptionFormData[];
};

export type OptionFormData = {
  description: string;
  highCostInDollarsPerUnit: number;
  lowCostInDollarsPerUnit: number;
  exactCostInDollarsPerUnit: number;
  priceAdjustmentDecimal: number;
  tier: { name: string; tierLevel: number };
};

export default function CreateLineItem() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const group: LineItemGroup = location.state.group;
  const navigate = useNavigation();
  const [formData, setFormData] = useState<LineItemFormData>(() => {
    return {
      name: "",
      quantity: 0,
      unitId: "",
      marginDecimal: 0.1,
      lineItemOptions: [
        {
          description: "",
          highCostInDollarsPerUnit: 0,
          lowCostInDollarsPerUnit: 0,
          exactCostInDollarsPerUnit: 0,
          priceAdjustmentDecimal: 0,
          tier: { name: "Premium", tierLevel: 0 },
        },
        {
          description: "",
          highCostInDollarsPerUnit: 0,
          lowCostInDollarsPerUnit: 0,
          exactCostInDollarsPerUnit: 0,
          priceAdjustmentDecimal: 0,
          tier: { name: "Designer", tierLevel: 1 },
        },
        {
          description: "",
          highCostInDollarsPerUnit: 0,
          lowCostInDollarsPerUnit: 0,
          exactCostInDollarsPerUnit: 0,
          priceAdjustmentDecimal: 0,
          tier: { name: "Luxury", tierLevel: 2 },
        },
      ],
    };
  });

  // Handle input changes
  function handleLineItemChangeEvent(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name == "marginDecimal" || name == "quantity") {
      setFormData({ ...formData, [name]: parseFloat(value) });
      return;
    }
    setFormData({ ...formData, [name]: value });
  }

  function onQuantityChange(newValue: number) {
    setFormData({ ...formData, quantity: newValue });
  }

  function handleUnitSelection(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedUnitId = e.target.value;
    setFormData({ ...formData, unitId: selectedUnitId });
  }

  const createLineItemMutation = useMutation({
    mutationFn: createLineItem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["area-template"] });
      //   window.history.back();
    },
    onError: (error) => {
      console.error("Error creating line item:", error);
    },
  });

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
    createLineItemMutation.mutate({
      groupId: group.id,
      marginDecimal: formData.marginDecimal,
      name: formData.name,
      quantity: formData.quantity,
      unitId: formData.unitId,
    });
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
                onChange={handleLineItemChangeEvent}
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
                onChange={handleLineItemChangeEvent}
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
                value={formData.quantity}
                onChange={onQuantityChange}
              />
            </div>
            <div>
              <label htmlFor={"unit"} className="block mb-1">
                Unit
              </label>
              <UnitSelector
                value={formData.unitId}
                onChange={handleUnitSelection}
              />
            </div>
          </div>
        </div>
        {/* {formData.lineItemOptions.map((option, index) => {
          return (

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
