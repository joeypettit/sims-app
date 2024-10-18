import { LineItemOption } from "../../app/types/line-item-option";
import { LineItemGroup } from "../../app/types/line-item-group";
import LineItemDisplay from "./line-item";
import CollapsibleDiv from "../collapsible-div";
import type { LineItem } from "../../app/types/line-item";
import { getCurrentlySelectedOption } from "../../util/utils";
import { calculateSalesPricePerUnit } from "../../util/utils";

export type LineItemGroupDisplayProps = {
  group: LineItemGroup;
};

export default function LineItemGroupDisplay(props: LineItemGroupDisplayProps) {
  return (
    <div className="py-2">
      <CollapsibleDiv title={props.group.name}>
        {props.group.lineItems.map((lineItem) => {
          return (
            <LineItemDisplay
              key={lineItem.id}
              lineItem={lineItem}
              group={props.group}
            />
          );
        })}
      </CollapsibleDiv>
      <hr />
    </div>
  );
}
