import { LineItemGroup } from "../../app/types/line-item-group";
import LineItemDisplay from "./line-item";
import CollapsibleDiv from "../collapsible-div";
import { formatNumberWithCommas, sortArrayByIndexProperty } from "../../util/utils";
import Button from "../button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlankLineItem, setGroupIsOpen } from "../../api/api";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { LineItem } from "../../app/types/line-item";

export type LineItemGroupDisplayProps = {
  group: LineItemGroup;
  index: number;
};

export default function LineItemGroupDisplay({
  group,
  index
}: LineItemGroupDisplayProps) {
  const queryClient = useQueryClient();

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
    onMutate: ({ isOpen }) => {
      setIsOpen(isOpen)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["area"] })
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

  function onLineItemDragEnd(result: DropResult<string>) {
    {
      if (!result.destination) {
        return;
      }
      if (result.destination.index === result.source.index) {
        return;
      }
      const groupId = result.destination.droppableId;
      const lineItemId = result.draggableId;
      const newIndex = result.destination.index;
      console.log("onlineitemdragend", groupId, lineItemId, newIndex)
    }
  }

  function LineItemList({ lineItems }: { lineItems: LineItem[] | undefined }) {
    if (!lineItems) return;
    const orderedGroups = sortArrayByIndexProperty({ arr: lineItems, indexProperty: "indexInGroup" })
    return orderedGroups.map(
      (lineItem: LineItem, index) => {
        return (
          <LineItemDisplay
            key={group.id}
            lineItem={lineItem}
            index={index}
          />
        );
      }
    )
  }

  useEffect(() => {
    setIsOpen(group.isOpen); // Sync state with updated prop
  }, [group.isOpen]);

  return (
    <Draggable index={index} draggableId={group.id}>
      {(provided) => (
        <div className="py-2" ref={provided.innerRef} {...provided.draggableProps} >
          <CollapsibleDiv title={group.name} price={getGroupsTotalSalePrice()} isOpen={isOpen} setIsOpen={handleToggleOpenGroup} provided={provided}>
            <DragDropContext onDragEnd={onLineItemDragEnd}>
              <Droppable
                droppableId={group.id}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <LineItemList lineItems={group.lineItems} />
                    {provided.placeholder}
                  </div>
                )
                }
              </Droppable>
            </DragDropContext>
            <div className="grid grid-cols-5 gap-4 py-2 pl-4">
              <div>
                <Button size={"xs"} variant="white" onClick={handleCreateLineItem}>
                  + Add Line
                </Button>
              </div>
              <div></div>
            </div>
          </CollapsibleDiv>
        </div>)}
    </Draggable>
  );
}
