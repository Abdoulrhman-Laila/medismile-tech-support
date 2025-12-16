// src/redux/slices/universitiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios";

const initialState = {
  universities: [],
  loading: false,
  error: null,
};

// 🔹 إنشاء Thunks للعمليات غير المتزامنة
export const fetchUniversities = createAsyncThunk(
  "universities/fetchUniversities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUniversity = createAsyncThunk(
  "universities/createUniversity",
  async (universityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create/", universityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUniversityAsync = createAsyncThunk(
  "universities/updateUniversity",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/${id}/update/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUniversityAsync = createAsyncThunk(
  "universities/deleteUniversity",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/${id}/delete/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUniversityDetails = createAsyncThunk(
  "universities/getUniversityDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const universitiesSlice = createSlice({
  name: "universities",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 🔹 جلب قائمة الجامعات
    builder
      .addCase(fetchUniversities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.loading = false;
        // 🔹 استخراج البيانات من الاستجابة
        let data = action.payload;
        
        // إذا كانت البيانات داخل data أو results
        if (data?.data && Array.isArray(data.data)) {
          data = data.data;
        } else if (data?.results && Array.isArray(data.results)) {
          data = data.results;
        } else if (!Array.isArray(data)) {
          data = [];
        }
        
        // ⚠️ مهم: يجب أن تكون جميع IDs هي UUIDs وليس أرقام
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        // 🔹 الاحتفاظ بالبيانات كما هي من API - الواجهة ستتعامل مع القيم الفارغة
        state.universities = data
          .map((uni) => {
            // التحقق من أن uni.id هو UUID صحيح
            const uniId = uni.id;
            if (!uniId || !uuidRegex.test(uniId)) {
              console.warn("⚠️ تم تجاهل جامعة بدون UUID صحيح:", uni);
              return null;
            }
            
            return {
              ...uni,
              // استخدام UUID الحقيقي فقط
              id: uniId,
              // الحفاظ على القيم الأصلية من API (null, undefined, أو القيمة الفعلية)
              email: uni.email ?? uni.email_address ?? null,
              phone: uni.phone ?? uni.phone_number ?? uni.telephone ?? null,
              address: uni.address ?? uni.location ?? uni.full_address ?? null,
              created_at: uni.created_at ?? uni.createdAt ?? null,
              updated_at: uni.updated_at ?? uni.updatedAt ?? null,
            };
          })
          .filter(uni => uni !== null); // إزالة الجامعات بدون UUID
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 إنشاء جامعة جديدة
      .addCase(createUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUniversity.fulfilled, (state, action) => {
        state.loading = false;
        // لا نضيف مباشرة، سنعيد جلب جميع البيانات
        // البيانات المُضافة قد لا تحتوي على جميع الحقول
      })
      .addCase(createUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 تحديث جامعة
      .addCase(updateUniversityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUniversityAsync.fulfilled, (state, action) => {
        state.loading = false;
        // لا نحدث مباشرة، سنعيد جلب جميع البيانات
        // البيانات المُحدثة قد لا تحتوي على جميع الحقول
      })
      .addCase(updateUniversityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 حذف جامعة
      .addCase(deleteUniversityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUniversityAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.universities = state.universities.filter(
          (u) => u.id !== action.payload
        );
      })
      .addCase(deleteUniversityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 جلب تفاصيل جامعة
      .addCase(getUniversityDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUniversityDetails.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getUniversityDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = universitiesSlice.actions;
export default universitiesSlice.reducer;
