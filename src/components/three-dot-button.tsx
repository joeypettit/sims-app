type ThreeDotButtonProps = {
  onClick: () => void;
  size?: number; // Optional size prop to adjust the dot size
};

export default function ThreeDotButton({
  onClick,
  size = 4,
}: ThreeDotButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-row items-center justify-center space-x-1 p-2 rounded  hover:bg-gray-100"
      aria-label="More options"
    >
      <span
        className={`bg-gray-800 rounded-full`}
        style={{ width: size, height: size }}
      ></span>
      <span
        className={`bg-gray-800 rounded-full`}
        style={{ width: size, height: size }}
      ></span>
      <span
        className={`bg-gray-800 rounded-full`}
        style={{ width: size, height: size }}
      ></span>
    </button>
  );
}
