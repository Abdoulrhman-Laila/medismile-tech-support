import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTickets as fetchTicketsApi,
  getTicketDetails as getTicketDetailsApi,
  updateTicket as updateTicketApi,
  fetchTicketResponses as fetchTicketResponsesApi,
  addTicketResponse as addTicketResponseApi,
} from "@/api/supportApi";

const initialState = {
  tickets: [],
  currentTicket: null,
  responses: [],
  loading: false,
  error: null,
  operationLoading: false,
  operationError: null,
  filters: {
    status: null,
    priority: null,
    category: null,
  },
};

/* ──────────── Thunks ──────────── */

export const fetchTickets = createAsyncThunk(
  "support/fetchTickets",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchTicketsApi(params);
      console.log("📥 استجابة API الكاملة:", JSON.stringify(apiResponse, null, 2));
      
      // 🔹 معالجة البنية المتداخلة: results.data أو data مباشرة
      let tickets = [];
      
      // الحالة 1: البنية المتداخلة {count, next, previous, results: {status, message, data: [...]}}
      if (apiResponse?.results?.data && Array.isArray(apiResponse.results.data)) {
        tickets = apiResponse.results.data;
        console.log("✅ تم استخراج التذاكر من results.data:", tickets.length);
      }
      // الحالة 2: البنية المباشرة {status, message, data: [...]}
      else if (apiResponse?.data && Array.isArray(apiResponse.data)) {
        tickets = apiResponse.data;
        console.log("✅ تم استخراج التذاكر من data:", tickets.length);
      }
      // الحالة 3: مصفوفة مباشرة
      else if (Array.isArray(apiResponse)) {
        tickets = apiResponse;
        console.log("✅ التذاكر هي مصفوفة مباشرة:", tickets.length);
      }
      // الحالة 4: results مباشرة كمصفوفة
      else if (apiResponse?.results && Array.isArray(apiResponse.results)) {
        tickets = apiResponse.results;
        console.log("✅ تم استخراج التذاكر من results:", tickets.length);
      }
      
      console.log("📋 التذاكر المستخرجة:", tickets);
      return tickets;
    } catch (err) {
      console.error("❌ خطأ في جلب التذاكر:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تذاكر الدعم الفني";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getTicketDetails = createAsyncThunk(
  "support/getTicketDetails",
  async (ticketId, { rejectWithValue }) => {
    try {
      const apiResponse = await getTicketDetailsApi(ticketId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل تذكرة الدعم";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTicket = createAsyncThunk(
  "support/updateTicket",
  async ({ ticketId, data }, { rejectWithValue }) => {
    try {
      const apiResponse = await updateTicketApi(ticketId, data);
      const updated = apiResponse?.data ?? apiResponse ?? null;
      return updated;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في تحديث تذكرة الدعم";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTicketResponses = createAsyncThunk(
  "support/fetchTicketResponses",
  async (ticketId, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchTicketResponsesApi(ticketId);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب ردود تذكرة الدعم";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addTicketResponse = createAsyncThunk(
  "support/addTicketResponse",
  async ({ ticketId, data }, { rejectWithValue }) => {
    try {
      const apiResponse = await addTicketResponseApi(ticketId, data);
      const created = apiResponse?.data ?? apiResponse ?? null;
      return created;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في إضافة رد على تذكرة الدعم";
      return rejectWithValue(errorMessage);
    }
  }
);

/* ──────────── Slice ──────────── */

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
      state.operationError = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.responses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔸 Get Ticket Details
      .addCase(getTicketDetails.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(getTicketDetails.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        state.currentTicket = action.payload;
      })
      .addCase(getTicketDetails.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Update Ticket
      .addCase(updateTicket.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const updated = action.payload;
        if (!updated) return;
        const id = updated.id || updated.ticket_id;
        if (!id) return;
        state.tickets = (state.tickets || []).map((t) =>
          (t.id || t.ticket_id) === id ? { ...t, ...updated } : t
        );
        if (state.currentTicket && (state.currentTicket.id || state.currentTicket.ticket_id) === id) {
          state.currentTicket = { ...state.currentTicket, ...updated };
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Fetch Ticket Responses
      .addCase(fetchTicketResponses.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(fetchTicketResponses.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        state.responses = action.payload;
      })
      .addCase(fetchTicketResponses.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Add Ticket Response
      .addCase(addTicketResponse.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(addTicketResponse.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        if (action.payload) {
          state.responses = [...(state.responses || []), action.payload];
        }
      })
      .addCase(addTicketResponse.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      });
  },
});

export const { setFilters, clearError, clearCurrentTicket } = supportSlice.actions;

export default supportSlice.reducer;



