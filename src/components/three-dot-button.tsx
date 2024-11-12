import { HiDotsVertical } from "react-icons/hi";

type ThreeDotButtonProps = {
  onClick: () => void;
};

export default function ThreeDotButton({ onClick }: ThreeDotButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center space-y-1 p-1 rounded  hover:bg-gray-100"
      aria-label="More options"
    >
      <HiDotsVertical />
    </button>
  );
}
