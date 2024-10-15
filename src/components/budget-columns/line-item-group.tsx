import { LineItemOption } from "../../app/types/line-item-option";
import { LineItemGroup } from "../../app/types/line-item-group";
import LineItemDisplay from "./line-item";
import CollapsibleDiv from "../collapsible-div";

export default function LineItemGroupDisplay({
  lineItemGroup,
  onLineItemOptionSelection,
}: {
  lineItemGroup: LineItemGroup;
  onLineItemOptionSelection: (selectedOptionId: string) => void;
}) {
  console.log("lineitemgroup is,", lineItemGroup);
  return (
    <div className="py-2">
      <CollapsibleDiv title={lineItemGroup.name}>
        {lineItemGroup.lineItems.map((lineItem, index) => {
          return (
            <LineItemDisplay
              key={`line-item-${index}`}
              lineItem={lineItem}
              onLineItemOptionSelection={onLineItemOptionSelection}
            />
          );
        })}
      </CollapsibleDiv>
      <hr />
    </div>
  );
}
