import OptionTierBadge from "./option-tier-badge";

export default function StickyTierToolbar() {
  return (
    <div className="bg-white p-4 sticky -top-4 z-50 border-b">
      <div className="grid grid-cols-5 gap-4 py-2 pl-4 ">
        <div></div>
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
