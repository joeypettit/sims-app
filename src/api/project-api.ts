import testProjects from "./test-project.json";
import testProjectAreas from "./test-areas.json";
import { ProjectArea } from "../app/types/project-area";
import { Project } from "../app/types/project";
import type { ProductOption } from "../app/types/product-option";

export async function getAllProjects() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(testProjects);
    }, 2000); // Simulate a 2-second API delay
  });
}

export async function getProjectById(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = testProjects.find((p) => p.id == id) as Project;
      resolve(project);
    }, 2000); // Simulate a 2-second API delay
  });
}

export async function getProjectAreaById(id: string) {
  return new Promise<ProjectArea>((resolve) => {
    setTimeout(() => {
      const area = (testProjectAreas as { [key: string]: ProjectArea })[id];
      resolve(area);
    }, 2000); // Simulate a 2-second API delay
  });
}

export async function updateProductOption({
  updatedOption,
  areaId,
  groupId,
  lineId,
}: {
  updatedOption: ProductOption;
  areaId: string;
  groupId: string;
  lineId: string;
}): Promise<ProductOption> {
  return new Promise<ProductOption>((resolve, reject) => {
    setTimeout(() => {
      // Cast testProjectAreas to the expected structure
      const projectAreas = testProjectAreas as { [key: string]: ProjectArea };

      // Access the project area by areaId
      const projectArea = projectAreas[areaId];
      if (!projectArea) {
        return reject(new Error("Project area not found"));
      }

      // Find the group by groupId
      const lineItemGroup = projectArea.lineItemGroups.find(
        (group) => group.id === groupId
      );
      if (!lineItemGroup) {
        return reject(new Error("Line item group not found"));
      }

      // Find the line item by lineId
      const lineItem = lineItemGroup.lineItems.find(
        (item) => item.id === lineId
      );
      if (!lineItem) {
        return reject(new Error("Line item not found"));
      }

      // Find and update the product option
      const optionIndex = lineItem.productOptions.findIndex(
        (option: ProductOption) => option.id === updatedOption.id
      );
      if (optionIndex === -1) {
        return reject(new Error("Product option not found"));
      }

      // Update the product option in place
      lineItem.productOptions[optionIndex] = updatedOption;

      // Return the updated option
      resolve(updatedOption);
    }, 2000); // Simulate a 2-second API delay
  });
}
