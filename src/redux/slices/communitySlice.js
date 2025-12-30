import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchContent as fetchContentApi,
  getContentDetails as getContentDetailsApi,
  getTrendingContent as getTrendingContentApi,
} from "@/api/communityApi";

const initialState = {
  content: [],
  currentContent: null,
  trendingContent: [],
  loading: false,
  error: null,
  filters: {
    type: null,
    category: null,
    university: null,
    featured: null,
    status: null,
  },
};

export const fetchContent = createAsyncThunk(
  "community/fetchContent",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchContentApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب المحتوى المجتمعي";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getContentDetails = createAsyncThunk(
  "community/getContentDetails",
  async (contentId, { rejectWithValue }) => {
    try {
      const apiResponse = await getContentDetailsApi(contentId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل المحتوى المجتمعي";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getTrendingContentThunk = createAsyncThunk(
  "community/getTrendingContent",
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await getTrendingContentApi();
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب المحتوى الرائج";
      return rejectWithValue(errorMessage);
    }
  }
);

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setCommunityFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCommunityError: (state) => {
      state.error = null;
    },
    clearCurrentContent: (state) => {
      state.currentContent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.content = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getContentDetails.fulfilled, (state, action) => {
        state.currentContent = action.payload;
      })
      .addCase(getTrendingContentThunk.fulfilled, (state, action) => {
        state.trendingContent = action.payload;
      });
  },
});

export const {
  setCommunityFilters,
  clearCommunityError,
  clearCurrentContent,
} = communitySlice.actions;

export default communitySlice.reducer;



