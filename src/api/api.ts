import { ProjectArea } from "../app/types/project-area";
import { Project } from "../app/types/project";
import axios from "axios";
import type { LineItemOption } from "../app/types/line-item-option";
import type { LineItem } from "../app/types/line-item";
import type { GroupCategory } from "../app/types/group-category";
import type { AreaTemplate } from "../app/types/area-template";
import type { LineItemUnit } from "../app/types/line-item-unit";

export async function getAllProjects(): Promise<Project[]> {
  const response = await axios.get<Project[]>("/api/projects");
  console.log("data", response.data);
  return response.data; // Return the actual data, which will be typed as `Project[]`
}

export async function getProjectById(id: string) {
  try {
    const response = await axios.get<Project>(`/api/projects/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching project with id ${id}: ${error}`);
  }
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
  console.log("in mutation", optionToSelect, optionToUnselect);
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
    console.log("in mutation", unselectResponse, selectResponse);

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
    const response = await axios.post<AreaTemplate>(
      `/api/templates/area/create`,
      {
        name: templateName,
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error Creating New Area Template wiht name ${templateName}: ${error}`
    );
  }
}

export async function getAreaTemplate(templateId: string) {
  try {
    const response = await axios.get<AreaTemplate>(
      `/api/templates/area/${templateId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error getting area template is ID ${templateId}: ${error}`
    );
  }
}

export async function createGroup({
  categoryId,
  groupName,
  projectAreaId,
}: {
  categoryId: string;
  groupName: string;
  projectAreaId: string;
}) {
  try {
    const response = await axios.post(`/api/groups`, {
      categoryId,
      groupName,
      projectAreaId,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `Error creating new group in category with ID ${categoryId}: ${error}`
    );
  }
}

export async function getUnits() {
  try {
    const response = await axios.get<LineItemUnit[]>("/api/units");
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching line item units: ${error}`);
  }
}

export async function createUnit({ unitName }: { unitName: string }) {
  try {
    const response = await axios.post(`/api/units`, {
      unitName,
    });
    console.log("create unit response", response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating new unit: ${error}`);
  }
}

export async function createBlankLineItem({ groupId }: { groupId: string }) {
  try {
    const response = await axios.post(`/api/line-items/create-blank`, {
      groupId,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating new line Item: ${error}`);
  }
}

export async function getLineItem(lineItemId: string): Promise<LineItem> {
  try {
    const response = await axios.get<LineItem>(`/api/line-items/${lineItemId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching line item with ID ${lineItemId}: ${error}`);
  }
}

export async function updateLineItem({
  name,
  lineItemId,
  groupId,
  quantity,
  unitId,
  marginDecimal,
  lineItemOptions,
}: {
  name?: string;
  lineItemId: string;
  groupId?: string;
  quantity?: number;
  unitId?: string;
  marginDecimal?: number;
  lineItemOptions?: LineItemOption[];
}) {
  try {
    const response = await axios.put(`/api/line-items/${lineItemId}`, {
      name,
      quantity,
      groupId,
      unitId,
      marginDecimal,
      lineItemOptions,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating line item with ID ${lineItemId}: ${error}`);
  }
}

export async function deleteLineItem({ lineItemId }: { lineItemId: string }) {
  try {
    const response = await axios.delete(`/api/line-items/${lineItemId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting line item with ID ${lineItemId}: ${error}`);
  }
}

export async function createBlankProject({ name }: { name: string }) {
  try {
    const response = await axios.post(`/api/projects/create-blank`, { name });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating new line Item: ${error}`);
  }
}

export async function updateProject({
  projectId,
  name,
  clientFirstName,
  clientLastName,
  clientId,
  salesPersonFirstName,
  salesPersonLastName,
  salesPersonId,
  description,
}: {
  projectId: string;
  name: string;
  clientFirstName: string;
  clientLastName: string;
  clientId: string;
  salesPersonFirstName: string;
  salesPersonLastName: string;
  salesPersonId: string;
  description: string;
}) {
  try {
    const response = await axios.put(`/api/projects/${projectId}`, {
      name,
      clientFirstName,
      clientLastName,
      clientId,
      salesPersonFirstName,
      salesPersonLastName,
      salesPersonId,
      description,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating project with ID ${projectId}: ${error}`);
  }
}
