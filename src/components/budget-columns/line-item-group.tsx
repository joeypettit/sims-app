import { ProductOption } from "../../app/types/product-option";
import { LineItemGroup } from "../../app/types/line-item-group";
import LineItemDisplay from "./line-item";
import CollapsibleDiv from "../collapsible-div";

export default function LineItemGroupDisplay({
  lineItemGroup,
}: {
  lineItemGroup: LineItemGroup;
}) {
  return (
    <div className="py-2">
      <CollapsibleDiv title={lineItemGroup.name}>
        {lineItemGroup.lineItems.map((lineItem, index) => {
          return (
            <LineItemDisplay key={`line-item-${index}`} lineItem={lineItem} />
          );
        })}
      </CollapsibleDiv>
      <hr />
    </div>
  );
}
