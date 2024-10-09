import { Client } from "./client";
import { ProjectArea } from "./project-area";

export type Project = {
  id: string;
  name: string;
  description: string;
  clients: Client[];
  users: User[];
  projectAreas: ProjectArea[];
};
