import { useState } from "react";

export default function QuantityInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (newValue: number) => void;
}) {
  const [inputValue, setInputValue] = useState(value.toFixed(2));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setInputValue(newValue);
      onChange(parseFloat(newValue) || 0); // Propagate the value to the parent
    }
  };

  const increment = () => {
    const newValue = Math.floor(Number(inputValue)) + 1;
    setInputValue(newValue.toFixed(2));
    onChange(newValue); // Update parent state with incremented value
  };

  const decrement = () => {
    const newValue = Math.floor(Number(inputValue)) - 1;
    setInputValue(newValue.toFixed(2));
    onChange(newValue); // Update parent state with decremented value
  };

  return (
    <div className="flex items-center w-18 bg-gray-100 rounded-md shadow-sm overflow-hidden">
      <button
        className="flex-shrink-0 text-sims-green-900 hover:text-sims-green-600 hover:shadow-inner focus:outline-none px-1 flex justify-center items-center"
        onClick={decrement}
      >
        &ndash;
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full text-center bg-transparent focus:outline-none border-none text-sm"
      />
      <button
        className="flex-shrink-0 text-sims-green-900 hover:text-sims-green-600 hover:shadow-inner focus:outline-none px-1 flex justify-center items-center"
        onClick={increment}
      >
        +
      </button>
    </div>
  );
}
