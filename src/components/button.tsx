import React from "react";

// Define types for button variants and sizes
type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "warning";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// Define the props type
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  // Set button color based on the variant prop
  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-sims-green-600 hover:bg-sims-green-700 active:bg-sims-green-800";
      case "secondary":
        return "bg-gray-400 hover:bg-gray-600 active:bg-gray-700";
      case "success":
        return "bg-green-600 hover:bg-green-700 active:bg-green-900";
      case "danger":
        return "bg-red-600 hover:bg-red-700 active:bg-red-900";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700";
      default:
        return "bg-sims-green-600 hover:bg-sims-green-700 active:bg-sims-green-900";
    }
  };

  // Set button size based on the size prop
  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "px-2 py-1 text-xs";
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "md":
        return "px-4 py-2 text-md";
      case "lg":
        return "px-5 py-2.5 text-lg";
      case "xl":
        return "px-6 py-3 text-xl";
      default:
        return "px-4 py-2 text-md";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-white rounded-md font-semibold transition-all duration-200 
                  disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 
                  ${getButtonClasses()} ${getSizeClasses()}`}
    >
      {children}
    </button>
  );
}
