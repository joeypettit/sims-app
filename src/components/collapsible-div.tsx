import { DraggableProvided } from "@hello-pangea/dnd";
import { MdDragHandle } from "react-icons/md";

import { ReactNode } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

export default function CollapsibleDiv({
  title,
  price,
  isOpen,
  setIsOpen,
  provided,
  children,
}: {
  title: string;
  price: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  provided: DraggableProvided
  children: ReactNode;
}) {

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="py-2 border-2 border-gray-200 border-l-0 border-t-0 border-r-0 rounded">
      <div
        className="flex justify-start items-center cursor-pointer"
      >
        <div {...provided.dragHandleProps} className="p-1 hover:bg-sims-green-50 rounded-e"><MdDragHandle /></div>
        <div onClick={toggleCollapse} className="w-full flex justify-between">
          <div className="ps-1">
            <h2 className="text-md font-bold">{title}</h2>
          </div>
          <div className="flex flex-row pe-2">
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
      </div>
      <div
        className={`transition-all duration-300 ease-in-out  ${isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
          }`}
      >
        {isOpen && <div className="">{children}</div>}
      </div>
    </div>
  );
}
