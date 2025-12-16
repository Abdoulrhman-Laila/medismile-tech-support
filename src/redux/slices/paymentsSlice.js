'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [
    { id: 1, university: "جامعة دمشق", email: "info@damascus.edu", amount: 1200, status: "مدفوع", date: "2025-09-20" },
    { id: 2, university: "جامعة القاهرة", email: "contact@cairo.edu", amount: 900, status: "قيد المراجعة", date: "2025-09-18" },
    { id: 3, university: "جامعة بيروت", email: "info@beirut.edu", amount: 700, status: "مرفوض", date: "2025-09-15" },
  ],
  methods: [
    { id: 1, name: "بطاقة مصرفية", type: "بطاقة", active: true },
    { id: 2, name: "تحويل بنكي", type: "تحويل", active: true },
    { id: 3, name: "PayPal", type: "بيبال", active: false },
  ],
  subscriptions: [
    { id: 1, university: "جامعة دمشق", active: true },
    { id: 2, university: "جامعة القاهرة", active: false },
  ],
  search: "",
  filterStatus: "الكل",
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      state.payments.push({ ...action.payload, id: Date.now() });
    },
    editPayment: (state, action) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.payments[index] = action.payload;
    },
    deletePayment: (state, action) => {
      state.payments = state.payments.filter(p => p.id !== action.payload);
    },
    addMethod: (state, action) => {
      state.methods.push({ ...action.payload, id: Date.now() });
    },
    editMethod: (state, action) => {
      const index = state.methods.findIndex(m => m.id === action.payload.id);
      if (index !== -1) state.methods[index] = action.payload;
    },
    deleteMethod: (state, action) => {
      state.methods = state.methods.filter(m => m.id !== action.payload);
    },
    toggleSubscription: (state, action) => {
      const sub = state.subscriptions.find(s => s.id === action.payload);
      if (sub) sub.active = !sub.active;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  addPayment,
  editPayment,
  deletePayment,
  addMethod,
  editMethod,
  deleteMethod,
  toggleSubscription,
  setSearch,
  setFilterStatus,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
