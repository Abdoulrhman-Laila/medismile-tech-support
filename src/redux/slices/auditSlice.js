import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAuditLogs as fetchAuditLogsApi,
  getAuditStatistics as getAuditStatisticsApi,
} from "@/api/auditApi";

const initialState = {
  logs: [],
  statistics: null,
  loading: false,
  error: null,
  filters: {
    user_id: null,
    action: null,
    content_type: null,
    start_date: null,
    end_date: null,
    search: null,
  },
};

export const fetchAuditLogs = createAsyncThunk(
  "audit/fetchAuditLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchAuditLogsApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب سجلات التدقيق";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAuditStatisticsThunk = createAsyncThunk(
  "audit/getAuditStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await getAuditStatisticsApi();
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب إحصائيات التدقيق";
      return rejectWithValue(errorMessage);
    }
  }
);

const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    setAuditFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearAuditError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.logs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAuditStatisticsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuditStatisticsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.statistics = action.payload;
      })
      .addCase(getAuditStatisticsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuditFilters, clearAuditError } = auditSlice.actions;

export default auditSlice.reducer;



