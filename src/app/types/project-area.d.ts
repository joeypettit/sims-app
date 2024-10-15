import { LineItem } from "./line-item";
import { BudgetProposal } from "./budget-proposal";

export type ProjectArea = {
  id: string;
  name: string;
  projectId: string;
  lineItemGroups: LineItemGroup[];
};
