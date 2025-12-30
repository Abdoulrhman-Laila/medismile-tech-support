import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAIDiagnoses as fetchAIDiagnosesApi,
  getAIDiagnosisDetails as getAIDiagnosisDetailsApi,
} from "@/api/aiApi";

const initialState = {
  diagnoses: [],
  currentDiagnosis: null,
  loading: false,
  error: null,
  filters: {
    student_id: null,
    case_id: null,
    status: null,
  },
};

export const fetchAIDiagnoses = createAsyncThunk(
  "ai/fetchAIDiagnoses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchAIDiagnosesApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تشخيصات AI";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAIDiagnosisDetails = createAsyncThunk(
  "ai/getAIDiagnosisDetails",
  async (diagnosisId, { rejectWithValue }) => {
    try {
      const apiResponse = await getAIDiagnosisDetailsApi(diagnosisId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل تشخيص AI";
      return rejectWithValue(errorMessage);
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setAIFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearAIError: (state) => {
      state.error = null;
    },
    clearCurrentDiagnosis: (state) => {
      state.currentDiagnosis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIDiagnoses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIDiagnoses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.diagnoses = action.payload;
      })
      .addCase(fetchAIDiagnoses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAIDiagnosisDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAIDiagnosisDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentDiagnosis = action.payload;
      })
      .addCase(getAIDiagnosisDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAIFilters, clearAIError, clearCurrentDiagnosis } = aiSlice.actions;

export default aiSlice.reducer;



