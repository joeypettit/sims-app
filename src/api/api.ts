import testProjects from "./test-project.json";
import testProjectAreas from "./test-areas.json";
import { ProjectArea } from "../app/types/project-area";
import { Project } from "../app/types/project";
import axios from "axios";
import type { LineItemOption } from "../app/types/line-item-option";
import type { LineItem } from "../app/types/line-item";
import type { LineItemGroup } from "../app/types/line-item-group";

export async function getAllProjects(): Promise<Project[]> {
  const response = await axios.get<Project[]>("/api/projects");
  console.log("data", response.data);
  return response.data; // Return the actual data, which will be typed as `Project[]`
}

export async function getProjectById(id: string) {
  const response = await axios.get<Project>(`/api/projects/${id}`);
  console.log("data", response.data);
  return response.data;
}

export async function getProjectAreaById(areaId: string) {
  const response = await axios.get<ProjectArea>(`/api/projects/area/${areaId}`);
  console.log("data", response.data);
  return response.data;
}

export async function updateOptionSelection({
  optionToSelect,
  optionToUnselect,
  lineItem,
}: {
  optionToSelect: LineItemOption;
  optionToUnselect: LineItemOption;
  lineItem: LineItem;
}) {
  try {
    console.log("un", optionToUnselect, "select", optionToSelect);
    let unselectResponse = undefined;
    let selectResponse = undefined;

    if (optionToUnselect) {
      unselectResponse = await axios.put(
        `/api/line-items/${lineItem.id}/unselect-option/${optionToUnselect.id}`
      );
    }
    if (optionToSelect) {
      selectResponse = await axios.put(
        `/api/line-items/${lineItem.id}/select-option/${optionToSelect.id}`
      );
    }

    const newOptions: LineItemOption[] = lineItem.lineItemOptions.map(
      (option) => {
        if (unselectResponse && option.id === unselectResponse.data.id) {
          return unselectResponse.data;
        }
        if (selectResponse && option.id === selectResponse.data.id) {
          return selectResponse.data;
        }
        return option;
      }
    );

    return newOptions;
  } catch (error) {
    console.error("Error updating line item option selection:", error);
    throw new Error("Failed to update line item option selection");
  }
}

export const updateLineItemQuantity = async ({
  lineItemId,
  quantity,
}: {
  lineItemId: string;
  quantity: number;
}) => {
  const response = await axios.put(
    `/api/line-items/${lineItemId}/update-quantity`,
    {
      quantity,
    }
  );

  return response.data;
};
