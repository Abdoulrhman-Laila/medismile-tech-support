import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logs: [
    { id: 1, type: "معلومة", message: "تسجيل دخول ناجح للمستخدم admin", date: "2025-09-25 10:30" },
    { id: 2, type: "تحذير", message: "محاولة فاشلة لتسجيل الدخول", date: "2025-09-24 15:12" },
    { id: 3, type: "خطأ", message: "فشل في إنشاء نسخة احتياطية", date: "2025-09-23 18:45" },
  ],
  search: "",
  filterType: "الكل",
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    addLog: (state, action) => {
      state.logs.unshift(action.payload);
    },
    deleteLog: (state, action) => {
      state.logs = state.logs.filter((log) => log.id !== action.payload);
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
});

export const { addLog, deleteLog, clearLogs, setSearch, setFilterType } = logsSlice.actions;
export default logsSlice.reducer;
