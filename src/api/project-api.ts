import testProjects from "./test-project.json";
import testProjectAreas from "./test-areas.json";
import { ProjectArea } from "../app/types/project-area";
import { Project } from "../app/types/project";

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
  return new Promise((resolve) => {
    setTimeout(() => {
      const area = (testProjectAreas as { [key: string]: ProjectArea })[id];
      resolve(area);
    }, 2000); // Simulate a 2-second API delay
  });
}
