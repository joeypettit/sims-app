import React, { useState, ReactNode } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

export default function CollapsibleDiv({
  title,
  price,
  children,
}: {
  title: string;
  price: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        {isOpen && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
