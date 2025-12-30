import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBackups,
  createBackup,
  restoreBackup as restoreBackupApi,
} from "@/api/backupApi";

const initialState = {
  backups: [],
  loading: false,
  error: null,
  operationLoading: false,
  operationError: null,
};

/* ──────────── Thunks ──────────── */

// جلب كل النسخ الاحتياطية
export const fetchBackupsThunk = createAsyncThunk(
  "backups/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchBackups();
      // DRF يرجع Array مباشرة
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "فشل في جلب النسخ الاحتياطية"
      );
    }
  }
);

// إنشاء نسخة احتياطية جديدة
export const createBackupThunk = createAsyncThunk(
  "backups/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createBackup(data);
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "فشل في إنشاء نسخة احتياطية"
      );
    }
  }
);

// استعادة نسخة احتياطية
export const restoreBackupThunk = createAsyncThunk(
  "backups/restore",
  async ({ backupId, restoreType }, { rejectWithValue }) => {
    try {
      const res = await restoreBackupApi(backupId, { restore_type: restoreType });
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "فشل في استعادة النسخة الاحتياطية"
      );
    }
  }
);

/* ──────────── Slice ──────────── */

const backupSlice = createSlice({
  name: "backups",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOperationError: (state) => {
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBackupsThunk
      .addCase(fetchBackupsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBackupsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // API response is an array directly
        state.backups = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBackupsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createBackupThunk
      .addCase(createBackupThunk.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createBackupThunk.fulfilled, (state, action) => {
        state.operationLoading = false;
        if (action.payload) {
          state.backups = [action.payload, ...state.backups];
        }
      })
      .addCase(createBackupThunk.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      // restoreBackupThunk
      .addCase(restoreBackupThunk.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(restoreBackupThunk.fulfilled, (state) => {
        state.operationLoading = false;
      })
      .addCase(restoreBackupThunk.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      });
  },
});

export const { clearError, clearOperationError } = backupSlice.actions;
export default backupSlice.reducer;
