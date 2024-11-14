import { useState, useEffect } from "react";
import type { LineItemOption } from "../../app/types/line-item-option";
import { useParams } from "react-router-dom";
import type { LineItemUnit } from "../../app/types/line-item-unit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UnitSelector from "../../components/unit-selector";
import QuantityInput from "../../components/quantity-input";
import type { LineItem } from "../../app/types/line-item";
import SimsSpinner from "../../components/sims-spinner/sims-spinner";
import { getLineItem } from "../../api/api";
import OptionForm from "./option-form";
import { updateLineItem } from "../../api/api";
import Button from "../../components/button";
import { NumericFormat } from "react-number-format";

import PanelHeaderBar from "../../components/page-header-bar";
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
  const { lineItemId } = useParams();
  const [formData, setFormData] = useState<LineItem | undefined>(undefined);

  const lineItemQuery = useQuery({
    queryKey: ["line-item", lineItemId],
    queryFn: async () => {
      console.log("REFETCHING");
      if (!lineItemId) {
        throw Error("Line Item Id is required.");
      }
      const result = await getLineItem(lineItemId);
      console.log("result is", result);
      return result;
    },
    staleTime: Infinity,
    refetchOnMount: "always",
  });

  const updateLineItemMutation = useMutation({
    mutationFn: updateLineItem,
    onError: (error) => {
      console.log("error updating line item", error);
    },
    onSuccess: () => {
      window.history.back();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["line-item", lineItemId] });
      queryClient.invalidateQueries({ queryKey: ["area-template"] });
    },
  });

  // Handle input changes
  function onNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (formData) {
      setFormData({ ...formData, name: value });
    }
  }

  function onQuantityChange(newValue: number) {
    if (formData) {
      setFormData({ ...formData, quantity: newValue });
    }
  }

  function onUnitSelection(selectedUnit: LineItemUnit) {
    if (formData) {
      setFormData({ ...formData, unit: { ...selectedUnit } });
    }
  }

  function onOptionChange(updatedOption: LineItemOption) {
    const updatedFormData = structuredClone(formData);
    const index = updatedFormData?.lineItemOptions.findIndex((o) => {
      return o.id === updatedOption.id;
    });
    if (index == -1 || index == undefined || !updatedFormData) {
      throw Error("Cannot identify option to update");
    }
    updatedFormData.lineItemOptions[index] = updatedOption;
    setFormData(updatedFormData);
  }

  function onMarginInputChange(value: number | undefined) {
    if (formData) {
      const updatedFormData = structuredClone(formData);
      let valueAsDecimal = value ? value / 100 : undefined;
      updatedFormData.marginDecimal = valueAsDecimal;
      setFormData(updatedFormData);
    }
  }

  function getMarginPercentage() {
    const marginDecimal = formData?.marginDecimal;
    return marginDecimal ? marginDecimal * 100 : undefined;
  }

  function validateForm() {
    if (!formData) {
      throw Error("Form Data is undefined");
    }
    const validatedFormData = structuredClone(formData);
    validatedFormData?.lineItemOptions.forEach((option: LineItemOption) => {
      if (option.priceAdjustmentMultiplier == undefined) {
        option.priceAdjustmentMultiplier = 1;
      }
    });
    if (validatedFormData?.marginDecimal == undefined) {
      validatedFormData.marginDecimal = 0;
    }
    return validatedFormData;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validatedForm = validateForm();
    if (lineItemId) {
      updateLineItemMutation.mutate({
        lineItemId: lineItemId,
        groupId: validatedForm?.lineItemGroupId,
        marginDecimal: validatedForm?.marginDecimal,
        name: validatedForm?.name,
        quantity: validatedForm?.quantity,
        unitId: validatedForm?.unit?.id,
        lineItemOptions: validatedForm?.lineItemOptions,
      });
    }
  }

  function handleCancel() {
    setFormData(undefined);
    window.history.back();
  }
  useEffect(() => {
    console.log("use effect", lineItemQuery.data, formData);
    // prepopulate local state for form
    if (lineItemQuery.data != undefined && formData == undefined) {
      console.log("setting data", lineItemQuery.data, formData);
      setFormData(lineItemQuery.data);
    }
  }, [lineItemQuery.data, formData]);

  if (!formData) {
    return (
      <>
        <div className="flex justify-center items-center w-full h-full">
          <SimsSpinner centered />
        </div>
      </>
    );
  }
  return (
    <>
      <PanelHeaderBar
        title={`Editing Line Item: ${lineItemQuery.data?.name}`}
      />
      <form onSubmit={handleSubmit} className="p-2">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 rounded bg-slate-50">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                autoComplete="off"
                id="name"
                name="name"
                value={formData.name}
                onChange={onNameInputChange}
                required
                className="border border-gray-300 p-1 rounded w-full"
              />
            </div>
            <div className="p-2 rounded bg-slate-50">
              <label htmlFor="marginDecimal">Margin</label>
              <NumericFormat
                className="border border-gray-300 p-1 rounded w-full"
                autoComplete="off"
                id="priceAdjustmentMultiplier"
                name="priceAdjustmentMultiplier"
                suffix="%"
                value={getMarginPercentage()}
                allowNegative={false}
                decimalScale={2}
                placeholder="Percent Margin"
                onValueChange={(values) => {
                  onMarginInputChange(values.floatValue);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 rounded bg-slate-50">
              <label htmlFor="quantity" className="block mb-1">
                Quantity
              </label>
              <QuantityInput
                value={formData.quantity || 0}
                onChange={onQuantityChange}
              />
            </div>
            <div className="p-2 rounded bg-slate-50">
              <label htmlFor={"unit"} className="block mb-1">
                Unit
              </label>
              <UnitSelector
                value={formData?.unit?.id || ""}
                onChange={onUnitSelection}
              />
            </div>
          </div>
        </div>
        <div className="py-6">
          <h1 className="font-bold">Options:</h1>
          {formData.lineItemOptions
            .sort((a: LineItemOption, b: LineItemOption) => {
              if (a.optionTier.tierLevel > b.optionTier.tierLevel) return 1;
              if (a.optionTier.tierLevel < b.optionTier.tierLevel) return -1;
              return 0;
            })
            .map((option) => {
              return (
                <div key={option.id}>
                  <hr />
                  <OptionForm
                    key={option.id}
                    option={option}
                    lineItem={formData}
                    onChange={onOptionChange}
                  />
                </div>
              );
            })}
          <hr />
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <Button variant="secondary" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
