// src/redux/slices/universitiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountsAxios from "@/api/accountsAxios";

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
      // GET /api/universities/
      const response = await accountsAxios.get("universities/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message
      );
    }
  }
);

export const createUniversity = createAsyncThunk(
  "universities/createUniversity",
  async (universityData, { rejectWithValue }) => {
    try {
      console.log("📤 إرسال بيانات الجامعة إلى API:", JSON.stringify(universityData, null, 2));
      // POST /api/universities/create/
      const response = await accountsAxios.post(
        "universities/create/",
        universityData
      );
      console.log("📥 استجابة API بعد إنشاء الجامعة:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message
      );
    }
  }
);

export const updateUniversityAsync = createAsyncThunk(
  "universities/updateUniversity",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log(`📤 تحديث جامعة ${id} بالبيانات:`, JSON.stringify(data, null, 2));
      // PATCH /api/universities/<university_id>/
      const response = await accountsAxios.patch(
        `universities/${id}/`,
        data
      );
      console.log("📥 استجابة API بعد تحديث الجامعة:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message
      );
    }
  }
);

export const deleteUniversityAsync = createAsyncThunk(
  "universities/deleteUniversity",
  async (id, { rejectWithValue }) => {
    try {
      // DELETE /api/universities/<university_id>/delete/
      await accountsAxios.delete(`universities/${id}/delete/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message
      );
    }
  }
);

export const getUniversityDetails = createAsyncThunk(
  "universities/getUniversityDetails",
  async (id, { rejectWithValue }) => {
    try {
      // GET /api/universities/<university_id>/
      const response = await accountsAxios.get(`universities/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message
      );
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
            
            // 🔹 استخراج البريد الإلكتروني بجميع الأسماء المحتملة
            let email = uni.email ?? 
                        uni.email_address ?? 
                        uni.emailAddress ?? 
                        uni.contact_email ?? 
                        uni.contactEmail ?? null;
            
            // إذا لم نجد البريد الإلكتروني، نبحث في جميع المفاتيح
            if (!email && typeof uni === 'object') {
              const emailKey = Object.keys(uni).find(key => 
                key.toLowerCase().includes('email') && uni[key] && uni[key] !== null && uni[key] !== ''
              );
              if (emailKey) {
                email = uni[emailKey];
              }
            }
            
            // 🔹 استخراج الهاتف بجميع الأسماء المحتملة
            let phone = uni.phone ?? 
                        uni.phone_number ?? 
                        uni.phoneNumber ?? 
                        uni.telephone ?? 
                        uni.contact_phone ?? 
                        uni.contactPhone ?? null;
            
            // إذا لم نجد الهاتف، نبحث في جميع المفاتيح
            if (!phone && typeof uni === 'object') {
              const phoneKey = Object.keys(uni).find(key => 
                (key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel')) && uni[key] && uni[key] !== null && uni[key] !== ''
              );
              if (phoneKey) {
                phone = uni[phoneKey];
              }
            }
            
            // 🔹 استخراج العنوان بجميع الأسماء المحتملة
            let address = uni.address ?? 
                         uni.location ?? 
                         uni.full_address ?? 
                         uni.fullAddress ?? null;
            
            // إذا لم نجد العنوان، نبحث في جميع المفاتيح
            if (!address && typeof uni === 'object') {
              const addressKey = Object.keys(uni).find(key => 
                (key.toLowerCase().includes('address') || key.toLowerCase().includes('location')) && uni[key] && uni[key] !== null && uni[key] !== ''
              );
              if (addressKey) {
                address = uni[addressKey];
              }
            }
            
            // 🔹 طباعة البيانات للتحقق من أول جامعة
            if (data.length > 0 && uni === data[0]) {
              console.log("🔍 بيانات الجامعة الأولى من API (كاملة):", JSON.stringify(uni, null, 2));
              console.log("📧 البريد الإلكتروني المستخرج:", email);
              console.log("📍 العنوان المستخرج:", address);
              console.log("📞 الهاتف المستخرج:", phone);
            }
            
            return {
              ...uni,
              // استخدام UUID الحقيقي فقط
              id: uniId,
              // الحفاظ على القيم الأصلية من API (null, undefined, أو القيمة الفعلية)
              name: uni.name ?? null,
              short_name: uni.short_name ?? uni.shortName ?? null,
              description: uni.description ?? null,
              address: address,
              city: uni.city ?? null,
              country: uni.country ?? null,
              website: uni.website ?? uni.website_url ?? uni.websiteUrl ?? null,
              email: email,
              phone: phone,
              logo: uni.logo ?? null,
              is_active: uni.is_active ?? uni.isActive ?? true,
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
