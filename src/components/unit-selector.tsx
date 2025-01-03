import { useQuery } from "@tanstack/react-query";
import { getUnits } from "../api/api";
import { LineItemUnit } from "../app/types/line-item-unit";
import AddButton from "./add-button";
import { useState } from "react";
import AddUnitModal from "./add-unit-modal";

type UnitSelectorProps = {
  value: string;
  onChange: (selectedUnit: LineItemUnit) => void;
};

export default function UnitSelector({ value, onChange }: UnitSelectorProps) {
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);

  const {
    data: units,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["units"],
    queryFn: getUnits,
  });

  function handleUnitSelection(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedUnitId = e.target.value;
    const selectedUnit = units?.find((unit) => unit.id == selectedUnitId);
    if (selectedUnit) {
      onChange(selectedUnit);
    }
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading options...</p>
      ) : isError ? (
        <p className="text-rose-700">Error: {error.message}</p>
      ) : (
        <div className="flex flex-row">
          <select
            id={"unit"}
            name={"unit"}
            value={value}
            onChange={handleUnitSelection}
            className="border border-gray-300 p-1 rounded w-full"
            required
          >
            <option value="">Select a Unit</option>
            {units?.map((unit: LineItemUnit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
          <div className="flex items-center">
            <AddButton
              onClick={() => {
                setIsAddUnitModalOpen(true);
              }}
            />
          </div>
        </div>
      )}
      <AddUnitModal
        isOpen={isAddUnitModalOpen}
        setIsOpen={setIsAddUnitModalOpen}
      />
    </div>
  );
}
