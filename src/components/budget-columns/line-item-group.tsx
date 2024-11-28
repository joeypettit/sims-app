import { LineItemGroup } from "../../app/types/line-item-group";
import LineItemDisplay from "./line-item";
import CollapsibleDiv from "../collapsible-div";
import { formatNumberWithCommas } from "../../util/utils";
import Button from "../button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createBlankLineItem, setGroupIsOpen } from "../../api/api";
import { useEffect, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";

export type LineItemGroupDisplayProps = {
  group: LineItemGroup;
};

export default function LineItemGroupDisplay({
  group,
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
      const result = await createBlankLineItem({ groupId });
      return result;
    },
    onSuccess: (data) => {
      navigate(`/edit-line-item/${data.id}`);
    },
    onError: (error) => {
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

  useEffect(() => {
    setIsOpen(group.isOpen); // Sync state with updated prop
  }, [group.isOpen]);

  return (
    <Draggable index={group.indexInCategory} draggableId={`group-${group.id}`}>
      {(provided) => (
        <div className="py-2" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
        </div>)}
    </Draggable>
  );
}
