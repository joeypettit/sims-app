import { LineItemOption } from "../../app/types/line-item-option";
import { LineItemGroup } from "../../app/types/line-item-group";
import LineItemDisplay from "./line-item";
import CollapsibleDiv from "../collapsible-div";
import type { LineItem } from "../../app/types/line-item";

export type LineItemGroupDisplayProps = {
  group: LineItemGroup;
  onOptionSelection: ({
    optionToSelect,
    optionToUnselect,
    group,
    lineItem,
  }: {
    optionToSelect: LineItemOption;
    optionToUnselect: LineItemOption;
    lineItem: LineItem;
    group: LineItemGroup;
  }) => void;
};

export default function LineItemGroupDisplay(props: LineItemGroupDisplayProps) {
  console.log("lineitemgrouprerender", props.group.name);

  return (
    <div className="py-2">
      <CollapsibleDiv title={props.group.name}>
        {props.group.lineItems.map((lineItem, index) => {
          return (
            <LineItemDisplay
              key={`line-item-${index}`}
              lineItem={lineItem}
              group={props.group}
              onOptionSelection={props.onOptionSelection}
            />
          );
        })}
      </CollapsibleDiv>
      <hr />
    </div>
  );
}
