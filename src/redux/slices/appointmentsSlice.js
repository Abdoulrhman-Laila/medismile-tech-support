import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAppointments as fetchAppointmentsApi,
  getAppointmentDetails as getAppointmentDetailsApi,
} from "@/api/appointmentsApi";

const initialState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    case_id: null,
  },
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchAppointmentsApi(params);
      const data = apiResponse?.data ?? apiResponse ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب المواعيد";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAppointmentDetails = createAsyncThunk(
  "appointments/getAppointmentDetails",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const apiResponse = await getAppointmentDetailsApi(appointmentId);
      const data = apiResponse?.data ?? apiResponse ?? null;
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في جلب تفاصيل الموعد";
      return rejectWithValue(errorMessage);
    }
  }
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointmentsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearAppointmentsError: (state) => {
      state.error = null;
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAppointmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentAppointment = action.payload;
      })
      .addCase(getAppointmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAppointmentsFilters,
  clearAppointmentsError,
  clearCurrentAppointment,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;



