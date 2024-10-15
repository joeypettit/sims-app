import testProjects from "./test-project.json";
import testProjectAreas from "./test-areas.json";
import { ProjectArea } from "../app/types/project-area";
import { Project } from "../app/types/project";
import axios from "axios";

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

// export async function getProjectAreaById(id: string) {
//   return new Promise<ProjectArea>((resolve) => {
//     setTimeout(() => {
//       // const area = (testProjectAreas as { [key: string]: ProjectArea })[id];
//       const area = null;
//       resolve(area);
//     }, 2000); // Simulate a 2-second API delay
//   });
// }
