import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRooms as fetchRoomsApi,
  getRoomDetails as getRoomDetailsApi,
  fetchMessages as fetchMessagesApi,
} from "@/api/messagingApi";

const initialState = {
  rooms: [],
  currentRoom: null,
  messages: [],
  loading: false,
  error: null,
};

export const fetchRooms = createAsyncThunk(
  "messaging/fetchRooms",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchRoomsApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب غرف المراسلة";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getRoomDetails = createAsyncThunk(
  "messaging/getRoomDetails",
  async (roomId, { rejectWithValue }) => {
    try {
      const apiResponse = await getRoomDetailsApi(roomId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل الغرفة";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messaging/fetchMessages",
  async (roomId, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchMessagesApi(roomId);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب رسائل الغرفة";
      return rejectWithValue(errorMessage);
    }
  }
);

const messagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    clearMessagingError: (state) => {
      state.error = null;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRoomDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentRoom = action.payload;
      })
      .addCase(getRoomDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessagingError, clearCurrentRoom } = messagingSlice.actions;

export default messagingSlice.reducer;



