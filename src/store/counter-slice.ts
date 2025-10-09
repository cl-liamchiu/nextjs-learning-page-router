import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CounterState = { value: number };
const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => { state.value += 1; },
    addBy: (state, action: PayloadAction<number>) => { state.value += action.payload; },
    reset: (state) => { state.value = 0; },
  },
});

export const { increment, addBy, reset } = counterSlice.actions;
export default counterSlice.reducer;
