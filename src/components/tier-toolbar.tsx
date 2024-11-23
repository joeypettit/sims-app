import Button from "./button";
import OptionTierBadge from "./option-tier-badge";

type StickyTierToolbarProps = {
  handleSetIsOpen: (isOpen: boolean) => void;
}

export default function StickyTierToolbar({ handleSetIsOpen }: StickyTierToolbarProps) {
  return (
    <div className="bg-white p-4 sticky -top-4 z-50 border-b">
      <div className="grid grid-cols-5 gap-4 py-2 pl-4 ">
        <div>
          <Button variant="white" onClick={() => handleSetIsOpen(true)}>
            <span className="text-gray-500 text-sm">Open All</span>
          </Button>
          <Button variant="white" onClick={() => handleSetIsOpen(false)} >
            <span className="text-gray-500 text-sm">Close All</span>
          </Button>
        </div>
        <div className="flex justify-center">
          <OptionTierBadge tier={{ id: "", name: "Premier", tierLevel: 1 }} />
        </div>
        <div className="flex justify-center">
          <OptionTierBadge tier={{ id: "", name: "Designer", tierLevel: 2 }} />
        </div>
        <div className="flex justify-center">
          <OptionTierBadge tier={{ id: "", name: "Luxury", tierLevel: 3 }} />
        </div>
        <div className="flex justify-end font-bold items-center">
          Estimated Cost
        </div>
      </div>
    </div>
  );
}
