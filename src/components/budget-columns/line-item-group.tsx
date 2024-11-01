import { LineItemGroup } from "../../app/types/line-item-group";
import LineItemDisplay from "./line-item";
import CollapsibleDiv from "../collapsible-div";
import { formatNumberWithCommas } from "../../util/utils";

export type LineItemGroupDisplayProps = {
  group: LineItemGroup;
};

export default function LineItemGroupDisplay(props: LineItemGroupDisplayProps) {
  function getGroupsTotalSalePrice() {
    if (props.group.totalSalePrice) {
      if (
        props.group.totalSalePrice?.lowPriceInDollars <= 0 &&
        props.group.totalSalePrice?.highPriceInDollars <= 0
      ) {
        return "-";
      }
      const lowPrice = formatNumberWithCommas(
        props.group.totalSalePrice?.lowPriceInDollars
      );
      const highPrice = formatNumberWithCommas(
        props.group.totalSalePrice?.highPriceInDollars
      );
      return `$${lowPrice} - $${highPrice}`;
    }
    return "-";
  }

  return (
    <div className="py-2">
      <CollapsibleDiv
        title={props.group.name}
        price={getGroupsTotalSalePrice()}
      >
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
