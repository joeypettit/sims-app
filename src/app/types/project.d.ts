import { Address } from "./address";
import { Client } from "./client";
import { ProjectStatus } from "./project-status";
import { ProjectProposal } from "./project-area";
import { ProjectArea } from "./project-area";

export type Project = {
  id: string;
  client: Client;
  name: string;
  startDate: string;
  endDate: string;
  projectAreas: ProjectArea[];
};
