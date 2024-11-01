import testProjects from "./test-project.json";
import testProjectAreas from "./test-areas.json";
import { ProjectArea } from "../app/types/project-area";
import { Project } from "../app/types/project";
import axios from "axios";
import type { LineItemOption } from "../app/types/line-item-option";
import type { LineItem } from "../app/types/line-item";
import type { LineItemGroup } from "../app/types/line-item-group";
import type { GroupCategory } from "../app/types/group-category";
import type { Template } from "../app/types/template";

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
  return response.data;
}

export async function updateOptionSelection({
  optionToSelect,
  optionToUnselect,
  lineItem,
}: {
  optionToSelect: LineItemOption | undefined;
  optionToUnselect: LineItemOption | undefined;
  lineItem: LineItem;
}) {
  try {
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

export const getAllGroupCategories = async () => {
  try {
    const response = await axios.get<GroupCategory[]>(
      `/api/groups/all-categories`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting all group categories:", error);
    throw new Error("Error getting all group categories");
  }
};

export async function createAreaTemplate(templateName: string) {
  try {
    const response = await axios.post<Template>(`/api/templates/area/create`, {
      name: templateName,
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Creating New Area Template:", error);
    throw new Error("Error Creating New Area Template");
  }
}
