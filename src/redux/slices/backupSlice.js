// redux/slices/backupSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  backups: [
    { id: 1, date: "2025-09-20 14:00", size: "1.2 GB", status: "ناجحة" },
    { id: 2, date: "2025-09-18 10:30", size: "980 MB", status: "ناجحة" },
    { id: 3, date: "2025-09-15 22:15", size: "1.1 GB", status: "فشلت" },
  ],
  autoBackup: "يومي",
};

const backupSlice = createSlice({
  name: "backups",
  initialState,
  reducers: {
    addBackup: (state, action) => {
      state.backups.unshift(action.payload);
    },
    updateBackupStatus: (state, action) => {
      const { id, status } = action.payload;
      const backup = state.backups.find((b) => b.id === id);
      if (backup) backup.status = status;
    },
    deleteBackup: (state, action) => {
      state.backups = state.backups.filter((b) => b.id !== action.payload);
    },
    setAutoBackup: (state, action) => {
      state.autoBackup = action.payload;
    },
  },
});

export const {
  addBackup,
  updateBackupStatus,
  deleteBackup,
  setAutoBackup,
} = backupSlice.actions;

export default backupSlice.reducer;
