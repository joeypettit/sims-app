import { Client } from "./client";
import { ProjectArea } from "./project-area";

export type Project = {
  id: string;
  client: Client;
  name: string;
  startDate: string;
  endDate: string;
  projectAreas: ProjectArea[];
};
