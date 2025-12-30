import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCases as fetchCasesApi,
  getCaseDetails as getCaseDetailsApi,
} from "@/api/casesApi";

const initialState = {
  cases: [],
  currentCase: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    priority: null,
    is_public: null,
  },
};

export const fetchCases = createAsyncThunk(
  "cases/fetchCases",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchCasesApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب الحالات السريرية";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCaseDetails = createAsyncThunk(
  "cases/getCaseDetails",
  async (caseId, { rejectWithValue }) => {
    try {
      const apiResponse = await getCaseDetailsApi(caseId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل الحالة";
      return rejectWithValue(errorMessage);
    }
  }
);

const casesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    setCasesFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCasesError: (state) => {
      state.error = null;
    },
    clearCurrentCase: (state) => {
      state.currentCase = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cases = action.payload;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCaseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCaseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentCase = action.payload;
      })
      .addCase(getCaseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCasesFilters, clearCasesError, clearCurrentCase } =
  casesSlice.actions;

export default casesSlice.reducer;



