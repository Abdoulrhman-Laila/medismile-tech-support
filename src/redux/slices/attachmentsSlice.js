import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAttachments as fetchAttachmentsApi,
  getAttachmentDetails as getAttachmentDetailsApi,
} from "@/api/attachmentsApi";

const initialState = {
  attachments: [],
  currentAttachment: null,
  loading: false,
  error: null,
  filters: {
    case_session_id: null,
    attachment_type: null,
    mime_type: null,
  },
};

export const fetchAttachments = createAsyncThunk(
  "attachments/fetchAttachments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchAttachmentsApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب المرفقات";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAttachmentDetails = createAsyncThunk(
  "attachments/getAttachmentDetails",
  async (attachmentId, { rejectWithValue }) => {
    try {
      const apiResponse = await getAttachmentDetailsApi(attachmentId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل المرفق";
      return rejectWithValue(errorMessage);
    }
  }
);

const attachmentsSlice = createSlice({
  name: "attachments",
  initialState,
  reducers: {
    setAttachmentsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearAttachmentsError: (state) => {
      state.error = null;
    },
    clearCurrentAttachment: (state) => {
      state.currentAttachment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttachments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttachments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.attachments = action.payload;
      })
      .addCase(fetchAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAttachmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttachmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentAttachment = action.payload;
      })
      .addCase(getAttachmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAttachmentsFilters,
  clearAttachmentsError,
  clearCurrentAttachment,
} = attachmentsSlice.actions;

export default attachmentsSlice.reducer;



