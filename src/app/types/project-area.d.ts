import { LineItemGroup } from "./line-item-group";
import { BudgetProposal } from "./budget-proposal";

export type ProjectArea = {
  name: string; // eg. Master Bathroom, Outdoor Kitchen
  lineItemGroups: LineItemGroup[];
};
