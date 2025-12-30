import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchReports as fetchReportsApi,
  getReportDetails as getReportDetailsApi,
  createReport as createReportApi,
  updateReportStatus as updateReportStatusApi,
  fetchStudentReports as fetchStudentReportsApi,
  fetchUniversityReports as fetchUniversityReportsApi,
} from "@/api/reportsApi";

const initialState = {
  reports: [],
  currentReport: null,
  studentReports: [],
  universityReports: [],
  loading: false,
  error: null,
  operationLoading: false,
  operationError: null,
  filters: {
    student_id: null,
    university_id: null,
    report_type: null,
    is_active: true,
  },
};

/* ──────────── Thunks ──────────── */

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchReportsApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب التقارير";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getReportDetails = createAsyncThunk(
  "reports/getReportDetails",
  async (reportId, { rejectWithValue }) => {
    try {
      const apiResponse = await getReportDetailsApi(reportId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل التقرير";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createReport = createAsyncThunk(
  "reports/createReport",
  async (payload, { rejectWithValue }) => {
    try {
      const apiResponse = await createReportApi(payload);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في إنشاء التقرير";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateReportStatus = createAsyncThunk(
  "reports/updateReportStatus",
  async ({ reportId, isActive }, { rejectWithValue }) => {
    try {
      const apiResponse = await updateReportStatusApi(reportId, isActive);
      const updated = apiResponse?.data ?? apiResponse ?? null;
      return updated;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في تحديث حالة التقرير";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStudentReports = createAsyncThunk(
  "reports/fetchStudentReports",
  async (studentId, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchStudentReportsApi(studentId);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تقارير الطالب";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUniversityReports = createAsyncThunk(
  "reports/fetchUniversityReports",
  async (universityId, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchUniversityReportsApi(universityId);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تقارير الجامعة";
      return rejectWithValue(errorMessage);
    }
  }
);

/* ──────────── Slice ──────────── */

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReportsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearReportsError: (state) => {
      state.error = null;
      state.operationError = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 Fetch Reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔸 Get Report Details
      .addCase(getReportDetails.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(getReportDetails.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        state.currentReport = action.payload;
      })
      .addCase(getReportDetails.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Create Report
      .addCase(createReport.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        if (action.payload) {
          state.reports = [action.payload, ...(state.reports || [])];
        }
      })
      .addCase(createReport.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Update Report Status
      .addCase(updateReportStatus.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const updated = action.payload;
        if (!updated) return;
        const id = updated.id;
        if (!id) return;
        state.reports = (state.reports || []).map((r) =>
          r.id === id ? { ...r, ...updated } : r
        );
        if (state.currentReport && state.currentReport.id === id) {
          state.currentReport = { ...state.currentReport, ...updated };
        }
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Student Reports
      .addCase(fetchStudentReports.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(fetchStudentReports.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        state.studentReports = action.payload;
      })
      .addCase(fetchStudentReports.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 University Reports
      .addCase(fetchUniversityReports.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(fetchUniversityReports.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        state.universityReports = action.payload;
      })
      .addCase(fetchUniversityReports.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      });
  },
});

export const { setReportsFilters, clearReportsError, clearCurrentReport } =
  reportsSlice.actions;

export default reportsSlice.reducer;



