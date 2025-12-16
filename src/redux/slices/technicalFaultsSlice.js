// src/redux/slices/technicalFaultsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem("technicalFaults");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load faults from localStorage", error);
      return [];
    }
  }
  return [];
};

const saveToLocalStorage = (faults) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("technicalFaults", JSON.stringify(faults));
  }
};

const initialState = {
  faults:
    typeof window !== "undefined" && localStorage.getItem("technicalFaults")
      ? JSON.parse(localStorage.getItem("technicalFaults"))
      : [
          {
            id: 1,
            description: "انقطاع الاتصال بالخادم الرئيسي",
            date: "2025-09-20",
            priority: "عالية",
            status: "قيد المعالجة",
            assignedTo: "م. خالد",
          },
          {
            id: 2,
            description: "مشكلة تسجيل الدخول للمستخدمين",
            date: "2025-09-22",
            priority: "متوسطة",
            status: "منجز",
            assignedTo: "م. علي",
          },
        ],
};

const technicalFaultsSlice = createSlice({
  name: "technicalFaults",
  initialState,
  reducers: {
    addFault: (state, action) => {
      state.faults.push(action.payload);
      saveToLocalStorage(state.faults);
    },
    updateStatus: (state, action) => {
      const { id, newStatus } = action.payload;
      const fault = state.faults.find((f) => f.id === id);
      if (fault) fault.status = newStatus;
      saveToLocalStorage(state.faults);
    },
    deleteFault: (state, action) => {
      state.faults = state.faults.filter((f) => f.id !== action.payload);
      saveToLocalStorage(state.faults);
    },
    clearFaults: (state) => {
      state.faults = [];
      saveToLocalStorage(state.faults);
    },
  },
});

export const { addFault, updateStatus, deleteFault, clearFaults } =
  technicalFaultsSlice.actions;
export default technicalFaultsSlice.reducer;
