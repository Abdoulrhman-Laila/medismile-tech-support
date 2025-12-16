// src/redux/slices/coursesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import coursesAxiosInstance from "@/api/coursesAxios";

// استخدام axios instance من ملف coursesAxios.js
const coursesAxios = coursesAxiosInstance;

const initialState = {
  courses: [],
  loading: false,
  error: null,
  selectedUniversityId: null,
};

// 🔹 جلب مقررات جامعة معينة
export const fetchCoursesByUniversity = createAsyncThunk(
  "courses/fetchCoursesByUniversity",
  async (universityId, { rejectWithValue }) => {
    try {
      const response = await coursesAxios.get(`/universities/${universityId}/courses/`);
      return { universityId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 إنشاء مقرر جديد
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async ({ universityId, courseData }, { rejectWithValue }) => {
    try {
      const response = await coursesAxios.post(`/universities/${universityId}/courses/create/`, courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 تحديث مقرر
export const updateCourseAsync = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // المسار الصحيح: /universities/courses/<pk>/update/
      const response = await coursesAxios.put(`/universities/courses/${id}/update/`, data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 حذف مقرر
export const deleteCourseAsync = createAsyncThunk(
  "courses/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      // المسار الصحيح: /universities/courses/<pk>/delete/
      await coursesAxios.delete(`/universities/courses/${id}/delete/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUniversity: (state, action) => {
      state.selectedUniversityId = action.payload;
    },
    clearCourses: (state) => {
      state.courses = [];
    },
  },
  extraReducers: (builder) => {
    // 🔹 جلب مقررات جامعة
    builder
      .addCase(fetchCoursesByUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByUniversity.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data.data || action.payload.data.results || action.payload.data;
        state.courses = Array.isArray(data) ? data : [];
      })
      .addCase(fetchCoursesByUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 إنشاء مقرر
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        const newCourse = action.payload.data || action.payload;
        state.courses.push(newCourse);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 تحديث مقرر
      .addCase(updateCourseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourseAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCourse = action.payload.data || action.payload;
        const index = state.courses.findIndex((c) => c.id === updatedCourse.id);
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
      })
      .addCase(updateCourseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 حذف مقرر
      .addCase(deleteCourseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourseAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCourseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedUniversity, clearCourses } = coursesSlice.actions;
export default coursesSlice.reducer;

