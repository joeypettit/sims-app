import { LineItemGroup } from "../../app/types/line-item-group";
import LineItemDisplay from "./line-item";
import CollapsibleDiv from "../collapsible-div";
import { formatNumberWithCommas } from "../../util/utils";
import Button from "../button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createBlankLineItem, setGroupIsOpen } from "../../api/api";
import { useState } from "react";

export type LineItemGroupDisplayProps = {
  group: LineItemGroup;
  setPanelIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LineItemGroupDisplay({
  group,
  setPanelIsLoading,
}: LineItemGroupDisplayProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => group.isOpen)

  function getGroupsTotalSalePrice() {
    if (group.totalSalePrice) {
      if (
        group.totalSalePrice?.lowPriceInDollars <= 0 &&
        group.totalSalePrice?.highPriceInDollars <= 0
      ) {
        return "-";
      }
      const lowPrice = formatNumberWithCommas(
        group.totalSalePrice?.lowPriceInDollars
      );
      const highPrice = formatNumberWithCommas(
        group.totalSalePrice?.highPriceInDollars
      );
      return `$${lowPrice} - $${highPrice}`;
    }
    return "-";
  }

  const createLineItemMutation = useMutation({
    mutationFn: async ({ groupId }: { groupId: string }) => {
      setPanelIsLoading(true);
      const result = await createBlankLineItem({ groupId });
      return result;
    },
    onSuccess: (data) => {
      setPanelIsLoading(false);
      navigate(`/edit-line-item/${data.id}`);
    },
    onError: (error) => {
      setPanelIsLoading(false);
      console.error("Error creating line item:", error);
      throw Error(`Error creating line item: ${error}`);
    },
  });
  const setIsOpenMutation = useMutation({
    mutationFn: async ({ groupId, isOpen }: { groupId: string, isOpen: boolean }) => {
      const result = await setGroupIsOpen({ groupId, isOpen });
      return result;
    },
    onSuccess: (data) => {
      setIsOpen(data.isOpen)
    },
    onError: (error) => {
      console.error("Error setting isOpen", error);
      throw Error(`Error setting isOpen: ${error}`);
    },
  });


  function handleCreateLineItem() {
    createLineItemMutation.mutate({ groupId: group.id });
  }
  function handleToggleOpenGroup() {
    setIsOpenMutation.mutate({ groupId: group.id, isOpen: !isOpen });
  }

  return (
    <div className="py-2">
      <CollapsibleDiv title={group.name} price={getGroupsTotalSalePrice()} isOpen={isOpen} setIsOpen={handleToggleOpenGroup}>
        {group.lineItems.map((lineItem) => {
          return (
            <LineItemDisplay
              key={lineItem.id}
              lineItem={lineItem}
              group={group}
            />
          );
        })}
        <div className="grid grid-cols-5 gap-4 py-2 pl-4">
          <div>
            <Button size={"xs"} variant="white" onClick={handleCreateLineItem}>
              + Add Line
            </Button>
          </div>
          <div></div>
        </div>
      </CollapsibleDiv>
      <hr />
    </div>
  );
}
