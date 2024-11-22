import { ReactNode } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

export default function CollapsibleDiv({
  title,
  price,
  isOpen,
  setIsOpen,
  children,
}: {
  title: string;
  price: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}) {

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleCollapse}
      >
        <div>
          <h2 className="text-md font-bold">{title}</h2>
        </div>
        <div className="flex flex-row">
          {!isOpen && <h2 className="text-sm font-bold">{price}</h2>}
          <button className="focus:outline-none">
            {isOpen ? (
              <span>
                <MdKeyboardArrowUp />
              </span>
            ) : (
              <span>
                <MdKeyboardArrowDown />
              </span>
            )}
          </button>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
          }`}
      >
        {isOpen && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
