import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProjectAreaById } from "../../api/project-api";
import type { ProjectArea } from "../../app/types/project-area";
import PanelWindow from "../../components/panel-window";
import LineItemGroupContainer from "../../components/budget-columns/line-item-group";
import { LineItemGroup } from "../../app/types/line-item-group";
import { useState } from "react";
import { ProductOption } from "../../app/types/product-option";
import { updateProductOption } from "../../api/project-api";

export default function ProjectAreaProposal() {
  const queryClient = useQueryClient();
  const { areaId } = useParams();

  // Fetch the details for the specific item using the ID from the route params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["area", areaId],
    queryFn: async () => {
      if (areaId == undefined || areaId == null) throw Error;
      const response = await getProjectAreaById(areaId);
      return response;
    },
  });

  const updateProductOptionMutation = useMutation({
    mutationFn: updateProductOption,
    // When mutate is called:
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["area", variables.updatedOption.id],
      });

      // Snapshot the previous value
      const previousOption = queryClient.getQueryData([
        "area",
        variables.updatedOption.id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["area", variables.updatedOption.id],
        variables.updatedOption
      );

      // Return a context with the previous and new todo
      return {
        updatedOption: variables.updatedOption,
        previousOption: previousOption,
      };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["area", context?.updatedOption.id],
        context?.previousOption
      );
    },
    // Always refetch after error or success:
    onSettled: (updatedOption) => {
      queryClient.invalidateQueries({
        queryKey: ["area", updatedOption],
      });
    },
  });

  function onProductOptionSelection(
    selectedOption: ProductOption,
    areaId: string,
    groupId: string,
    lineId: string
  ) {
    updateProductOptionMutation.mutate({
      updatedOption: selectedOption,
      areaId: areaId,
      groupId: groupId,
      lineId: lineId,
    });
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <PanelWindow>
      <h2>{data?.name}</h2>
      <div>
        {data?.lineItemGroups.map((group: LineItemGroup, index) => {
          return (
            <LineItemGroupContainer
              key={`line-item-group-${index}`}
              lineItemGroup={group}
              onProductOptionSelection={onProductOptionSelection}
            />
          );
        })}
      </div>
      {/* <div>{totalInDollars}</div> */}
    </PanelWindow>
  );
}
