// src/redux/slices/techUpdatesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  techUpdates: [
    {
      id: 1,
      title: "تحديث قاعدة البيانات",
      type: "أمني",
      status: "مكتمل",
      date: "2025-10-05",
    },
    {
      id: 2,
      title: "تحسين أداء النظام",
      type: "تحسين أداء",
      status: "قيد التنفيذ",
      date: "2025-10-06",
    },
  ],
};

const techUpdatesSlice = createSlice({
  name: "techUpdates",
  initialState,
  reducers: {
    addUpdate: (state, action) => {
      state.techUpdates.push(action.payload);
    },
    updateUpdate: (state, action) => {
      const index = state.techUpdates.findIndex(
        (u) => u.id === action.payload.id
      );
      if (index !== -1) state.techUpdates[index] = action.payload;
    },
    deleteUpdate: (state, action) => {
      state.techUpdates = state.techUpdates.filter(
        (u) => u.id !== action.payload
      );
    },
    clearUpdates: (state) => {
      state.techUpdates = [];
    },
  },
});

export const { addUpdate, updateUpdate, deleteUpdate, clearUpdates } =
  techUpdatesSlice.actions;
export default techUpdatesSlice.reducer;
