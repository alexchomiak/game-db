import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthCreds } from "../../components/AuthForm";
import axios, { AxiosResponse } from "axios";
interface AuthState {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}

const initialState: AuthState = {
  user: null,
};

interface AuthResult {
  data: AuthState["user"];
}

export const login = createAsyncThunk(
  "auth/login",
  async (creds: AuthCreds, thunkAPI) => {
    return (
      await axios.post("/api/auth/login", {
        ...creds,
      })
    ).data as AuthState["user"];
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (creds: AuthCreds, thunkAPI) => {
    return (
      await axios.post("/api/auth/register", {
        ...creds,
      })
    ).data as AuthState["user"];
  }
);

export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
  await axios.get("/api/auth/logout");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const user = action.payload;
      if (user) {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    });

    builder.addCase(login.rejected, (state, action) => {
      state.user = null;
      // TODO: Add toast message indicating login error

      alert("login error");
    });

    builder.addCase(register.fulfilled, (state, action) => {
      const user = action.payload;
      if (user) {
        localStorage.setItem("user", JSON.stringify(action.payload));
        state.user = action.payload;
      }
    });

    builder.addCase(register.rejected, (state, action) => {
      // TODO: Add toast message indicating register error
      alert("registration error");
    });

    builder.addCase(logout.fulfilled, (state) => {
      localStorage.setItem("user", "");
      state.user = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      // TODO: Add toast message indicating logout error
      alert("logout error");
    });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
