import { Client } from "./client";
import { ProjectArea } from "./project-area";

export type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  clients: Client[];
  users: User[];
  areas: ProjectArea[];
};
