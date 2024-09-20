import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Treat } from "../types/treat.type";
import jsonData from "./test-data/loadboost-test-data.json";
// Define the TS type for the counter slice's state

// Define the initial value for the slice state
const initialState: Treat[] = [];

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    getTreats: (state) => {
      const jsonTreats: Treat[] = jsonData["dogTreats"];
      return jsonTreats;
    },
  },
});

// Export the generated action creators for use in components
export const { getTreats } = counterSlice.actions;

// Selector functions allows us to select a value from the Redux root state.
// Selectors can also be defined inline in the `useSelector` call
// in a component, or inside the `createSlice.selectors` field.
export const selectAllTreats = (state: RootState) => state.treats;

// Export the slice reducer for use in the store configuration
export default counterSlice.reducer;
