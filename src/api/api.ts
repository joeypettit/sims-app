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

export async function updateLineItemOptionSelection({
  optionToSelect,
  optionToUnselect,
  lineItem,
  group,
}: {
  optionToSelect: LineItemOption;
  optionToUnselect: LineItemOption;
  lineItem: LineItem;
  group: LineItemGroup;
}) {
  try {
    const unselectResponse = await axios.put(
      `/api/line-items/${lineItem.id}/unselect-option/${optionToUnselect.id}`
    );

    const selectResponse = await axios.put(
      `/api/line-items/${lineItem.id}/select-option/${optionToSelect.id}`
    );

    lineItem.lineItemOptions = lineItem.lineItemOptions.map((option) => {
      if (option.id === unselectResponse.data.id) {
        return unselectResponse.data;
      }
      if (option.id === selectResponse.data.id) {
        return selectResponse.data;
      }
      return option;
    });

    // Return the updated lineItem with its new options
    return lineItem;
  } catch (error) {
    console.error("Error updating line item option selection:", error);
    throw new Error("Failed to update line item option selection");
  }
}

// export async function getProjectAreaById(id: string) {
//   return new Promise<ProjectArea>((resolve) => {
//     setTimeout(() => {
//       // const area = (testProjectAreas as { [key: string]: ProjectArea })[id];
//       const area = null;
//       resolve(area);
//     }, 2000); // Simulate a 2-second API delay
//   });
// }
