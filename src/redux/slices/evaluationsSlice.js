import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEvaluations as fetchEvaluationsApi,
  getEvaluationDetails as getEvaluationDetailsApi,
  getStudentStatistics as getStudentStatisticsApi,
} from "@/api/evaluationsApi";

const initialState = {
  evaluations: [],
  currentEvaluation: null,
  studentStatistics: null,
  loading: false,
  error: null,
  filters: {
    student_id: null,
    target_type: null,
    status: null,
  },
};

export const fetchEvaluations = createAsyncThunk(
  "evaluations/fetchEvaluations",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchEvaluationsApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب التقييمات";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEvaluationDetails = createAsyncThunk(
  "evaluations/getEvaluationDetails",
  async (evaluationId, { rejectWithValue }) => {
    try {
      const apiResponse = await getEvaluationDetailsApi(evaluationId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل التقييم";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getStudentStatisticsThunk = createAsyncThunk(
  "evaluations/getStudentStatistics",
  async (studentId, { rejectWithValue }) => {
    try {
      const apiResponse = await getStudentStatisticsApi(studentId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب إحصائيات الطالب";
      return rejectWithValue(errorMessage);
    }
  }
);

const evaluationsSlice = createSlice({
  name: "evaluations",
  initialState,
  reducers: {
    setEvaluationsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearEvaluationsError: (state) => {
      state.error = null;
    },
    clearCurrentEvaluation: (state) => {
      state.currentEvaluation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.evaluations = action.payload;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEvaluationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvaluationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentEvaluation = action.payload;
      })
      .addCase(getEvaluationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStudentStatisticsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentStatisticsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.studentStatistics = action.payload;
      })
      .addCase(getStudentStatisticsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setEvaluationsFilters,
  clearEvaluationsError,
  clearCurrentEvaluation,
} = evaluationsSlice.actions;

export default evaluationsSlice.reducer;



