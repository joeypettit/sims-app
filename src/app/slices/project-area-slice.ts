import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PriceRange } from "../types/price-range";

type ProjectAreaState = {
  totalInDollars: PriceRange;
};

const initialState: ProjectAreaState = {
  totalInDollars: { lowPriceInDollars: 0, highPriceInDollars: 0 },
};

export const projectAreaSlice = createSlice({
  name: "project-area",
  initialState,
  reducers: {
    adjustTotalDollars: (state, action: PayloadAction<PriceRange>) => {
      const newTotal: PriceRange = {
        lowPriceInDollars:
          state.totalInDollars.lowPriceInDollars +
          action.payload.lowPriceInDollars,
        highPriceInDollars:
          state.totalInDollars.highPriceInDollars +
          action.payload.highPriceInDollars,
      };
      state.totalInDollars = newTotal; // Update totalInDollars with the payload
    },
  },
});

export const getTotalString = (state: RootState) => {
  const { lowPriceInDollars, highPriceInDollars } =
    state.projectArea.totalInDollars;

  if (lowPriceInDollars == null || highPriceInDollars == null) return `-`;
  else if (lowPriceInDollars === highPriceInDollars)
    return `$${lowPriceInDollars}`;
  else return `$${lowPriceInDollars} - $${highPriceInDollars}`;
};

export const { adjustTotalDollars } = projectAreaSlice.actions;

export const selectProjectArea = (state: RootState) => state.projectArea;

export const selectTotalInDollars = (state: RootState) =>
  state.projectArea.totalInDollars;

export default projectAreaSlice.reducer;
