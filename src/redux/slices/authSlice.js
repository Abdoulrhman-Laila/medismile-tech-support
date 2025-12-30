import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginApi, logout as logoutApi, refreshAccessToken as refreshTokenApi } from "@/api/accountsApi";

const initialState = {
  user: null,
  user_id: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/* ──────────── Thunks ──────────── */

/**
 * 🔹 تسجيل الدخول
 * POST /api/accounts/login/tech-support/
 */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);

      // نتعامل مع احتمال أن يرجع الـ backend بصيغ مختلفة
      // إما: { token, user: {id, role} } أو { status, message, data: {tokens, user} } أو { detail, user_id, role }
      const { token, user: directUser, data, tokens: directTokens } = response || {};
      const nested = data && typeof data === "object" ? data : {};
      const tokens = token ? { access: token } : (directTokens || nested.tokens);
      const user = directUser || nested.user;

      // التحقق من وجود token
      let accessToken = null;
      let refreshToken = null;
      
      if (tokens) {
        accessToken = tokens.access || tokens.token || token;
        refreshToken = tokens.refresh || null;
      }

      // إذا كان هناك user_id و role مباشرة (بدون tokens)
      const user_id = user?.id || response?.user_id || nested.user_id;
      const role = user?.role || response?.role || nested.role;

      if (!accessToken || !user_id || !role) {
        throw new Error("لم يتم إرجاع بيانات المستخدم أو التوكن من السيرفر");
      }

      // حفظ Tokens و User في localStorage
      const userData = {
        user_id,
        role,
        id: user_id,
        email: user?.email || null,
        first_name: user?.first_name || null,
        last_name: user?.last_name || null,
      };

      if (typeof window !== "undefined") {
        if (accessToken) {
          localStorage.setItem("mediSmile_accessToken", accessToken);
        }
        if (refreshToken) {
          localStorage.setItem("mediSmile_refreshToken", refreshToken);
        }
        localStorage.setItem("mediSmile_currentUser", JSON.stringify(userData));
      }

      return {
        user: userData,
        user_id,
        role,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في تسجيل الدخول";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * 🔹 تسجيل الخروج
 * POST /api/accounts/logout/tech-support/
 */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken;

      // إذا كان هناك refresh token، نرسل طلب logout للسيرفر
      if (refreshToken) {
        try {
          await logoutApi(refreshToken);
        } catch (logoutError) {
          // حتى لو فشل logout في السيرفر، نتابع عملية تسجيل الخروج محلياً
          console.warn("⚠️ فشل تسجيل الخروج في السيرفر:", logoutError);
        }
      }

      // حذف البيانات من localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("mediSmile_accessToken");
        localStorage.removeItem("mediSmile_refreshToken");
        localStorage.removeItem("mediSmile_currentUser");
      }

      return null;
    } catch (err) {
      // حتى لو حدث خطأ، نتابع عملية تسجيل الخروج محلياً
      if (typeof window !== "undefined") {
        localStorage.removeItem("mediSmile_accessToken");
        localStorage.removeItem("mediSmile_refreshToken");
        localStorage.removeItem("mediSmile_currentUser");
      }
      return null;
    }
  }
);


/**
 * 🔹 تجديد Access Token
 * POST /api/token/refresh/
 */
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        throw new Error("لا يوجد refresh token");
      }

      const response = await refreshTokenApi(refreshToken);
      const { access } =
        (response && response.access) ||
        (response && response.data && response.data.access)
          ? response
          : response?.data || {};

      // حفظ Access Token الجديد
      if (typeof window !== "undefined") {
        localStorage.setItem("mediSmile_accessToken", access);
      }

      return { accessToken: access };
    } catch (err) {
      // إذا فشل تجديد Token، نقوم بتسجيل الخروج
      if (typeof window !== "undefined") {
        localStorage.removeItem("mediSmile_accessToken");
        localStorage.removeItem("mediSmile_refreshToken");
        localStorage.removeItem("mediSmile_currentUser");
      }
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في تجديد Token";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * 🔹 تحميل بيانات المستخدم من localStorage عند تحميل الصفحة
 */
export const loadAuthFromStorage = createAsyncThunk(
  "auth/loadFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const accessToken = localStorage.getItem("mediSmile_accessToken");
      const refreshToken = localStorage.getItem("mediSmile_refreshToken");
      const userStr = localStorage.getItem("mediSmile_currentUser");

      if (!accessToken || !refreshToken || !userStr) {
        return null;
      }

      const userData = JSON.parse(userStr);

      if (!userData.user_id || !userData.role) {
        return null;
      }

      return {
        user: userData,
        user_id: userData.user_id,
        role: userData.role,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      // إذا حدث خطأ في قراءة البيانات، نمسحها
      if (typeof window !== "undefined") {
        localStorage.removeItem("mediSmile_accessToken");
        localStorage.removeItem("mediSmile_refreshToken");
        localStorage.removeItem("mediSmile_currentUser");
      }
      return null;
    }
  }
);

/* ──────────── Slice ──────────── */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.user_id = action.payload.user_id;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // 🔸 Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.user_id = null;
        state.role = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // حتى لو فشل logout، نمسح البيانات محلياً
        state.loading = false;
        state.user = null;
        state.user_id = null;
        state.role = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // 🔸 Refresh Token
      .addCase(refreshAccessToken.pending, (state) => {
        // لا نضع loading = true لتجنب إظهار spinner أثناء تجديد Token
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // إذا فشل تجديد Token، نقوم بتسجيل الخروج
        state.user = null;
        state.user_id = null;
        state.role = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // 🔸 Load from Storage
      .addCase(loadAuthFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAuthFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.user_id = action.payload.user_id;
          state.role = action.payload.role;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.user_id = null;
          state.role = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loadAuthFromStorage.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.user_id = null;
        state.role = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;







