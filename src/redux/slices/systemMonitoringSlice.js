// src/redux/systemMonitoringSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  systemMonitoring: [
    { id: 1, type: "خطأ", message: "فشل الاتصال بقاعدة البيانات", date: "2025-09-21 14:22" },
    { id: 2, type: "تحذير", message: "استخدام عالي للذاكرة", date: "2025-09-21 12:15" },
    { id: 3, type: "معلومة", message: "تم تسجيل دخول مستخدم جديد", date: "2025-09-20 10:05" },
    { id: 4, type: "خطأ", message: "فشل في تحميل وحدة Dashboard", date: "2025-09-19 22:40" },
  ],
  search: "",
  filter: "الكل",
};

const systemMonitoringSlice = createSlice({
  name: "systemMonitoring",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    addLog: (state, action) => {
      state.systemMonitoring.unshift(action.payload);
    },
    deleteLog: (state, action) => {
      state.systemMonitoring = state.systemMonitoring.filter(
        (log) => log.id !== action.payload
      );
    },
    clearLogs: (state) => {
      state.systemMonitoring = [];
    },
  },
});

export const { setSearch, setFilter, addLog, deleteLog, clearLogs } =
  systemMonitoringSlice.actions;
export default systemMonitoringSlice.reducer;
