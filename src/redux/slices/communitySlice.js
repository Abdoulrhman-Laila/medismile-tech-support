import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPosts as fetchPostsApi,
  getPostDetails as getPostDetailsApi,
  fetchPendingPosts as fetchPendingPostsApi,
  fetchApprovalLogs as fetchApprovalLogsApi,
  // Legacy support
  fetchContent as fetchContentApi,
  getContentDetails as getContentDetailsApi,
} from "@/api/communityApi";

const initialState = {
  posts: [], // Posts list
  content: [], // Legacy alias
  currentPost: null, // Current post details
  currentContent: null, // Legacy alias
  pendingPosts: [], // Pending posts (for supervisors)
  approvalLogs: [], // Approval logs (for tech_support and university_admin)
  loading: false,
  error: null,
  filters: {
    status: null, // pending, approved, rejected
    author_id: null,
    content_type: null, // text, video, etc.
    category: null, // educational, medical, etc.
    university: null,
    featured: null,
  },
};

// 🔹 جلب قائمة Posts
// GET /api/community/posts/
export const fetchPosts = createAsyncThunk(
  "community/fetchPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchPostsApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب قائمة الـ Posts";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 جلب تفاصيل Post
// GET /api/community/posts/{id}/
export const getPostDetails = createAsyncThunk(
  "community/getPostDetails",
  async (postId, { rejectWithValue }) => {
    try {
      const apiResponse = await getPostDetailsApi(postId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل الـ Post";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 جلب Posts المعلقة (للـ Supervisors)
// GET /api/community/posts/pending/
export const fetchPendingPostsThunk = createAsyncThunk(
  "community/fetchPendingPosts",
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchPendingPostsApi();
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب Posts المعلقة";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 جلب سجلات الموافقة (للـ tech_support و university_admin)
// GET /api/community/approval-logs/
export const fetchApprovalLogsThunk = createAsyncThunk(
  "community/fetchApprovalLogs",
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchApprovalLogsApi();
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب سجلات الموافقة";
      return rejectWithValue(errorMessage);
    }
  }
);

// ──────────── Legacy Support ────────────
// للحفاظ على التوافق مع الكود الحالي

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
      // ──────────── Posts Endpoints ────────────
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload;
        state.content = action.payload; // Legacy support
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPostDetails.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.currentContent = action.payload; // Legacy support
      })
      // ──────────── Pending Posts ────────────
      .addCase(fetchPendingPostsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.pendingPosts = action.payload;
      })
      .addCase(fetchPendingPostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ──────────── Approval Logs (tech_support) ────────────
      .addCase(fetchApprovalLogsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalLogsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.approvalLogs = action.payload;
      })
      .addCase(fetchApprovalLogsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ──────────── Legacy Support ────────────
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.content = action.payload;
        state.posts = action.payload; // Sync with new state
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getContentDetails.fulfilled, (state, action) => {
        state.currentContent = action.payload;
        state.currentPost = action.payload; // Sync with new state
      });
  },
});

export const {
  setCommunityFilters,
  clearCommunityError,
  clearCurrentContent,
} = communitySlice.actions;

export default communitySlice.reducer;



