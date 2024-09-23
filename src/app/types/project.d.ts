import { Address } from "./address";
import { Client } from "./client";
import { ProjectArea } from "./project-area";

export type Project = {
  id: string;
  client: Client;
  location: Address;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  projectAreas: ProjectArea[];
};
