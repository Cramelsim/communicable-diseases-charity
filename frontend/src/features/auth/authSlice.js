import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, tokenStorage } from '../../api/client';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await api('/auth/login/', { method: 'POST', body: credentials });
    tokenStorage.set(data.access);
    return data.user;
  } catch (e) {
    return rejectWithValue(e.status === 401 ? 'Invalid username or password' : e.message);
  }
});

export const register = createAsyncThunk('auth/register', async (body, { dispatch, rejectWithValue }) => {
  try {
    await api('/auth/register/', { method: 'POST', body });
  } catch (e) {
    return rejectWithValue(e.message);
  }
  return dispatch(login({ username: body.username, password: body.password })).unwrap();
});

export const loadCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  if (!tokenStorage.get()) return null;
  try {
    return await api('/auth/me/');
  } catch (e) {
    tokenStorage.clear();
    return rejectWithValue(e.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {
    logout(state) {
      tokenStorage.clear();
      state.user = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload;
      })
      .addCase(register.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload;
      })
      .addCase(loadCurrentUser.fulfilled, (s, a) => {
        s.user = a.payload;
      })
      .addMatcher(
        (a) => ['auth/login/rejected', 'auth/register/rejected'].includes(a.type),
        (s, a) => {
          s.status = 'failed';
          s.error = a.payload || a.error?.message;
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectUser = (s) => s.auth.user;
export const selectIsAdmin = (s) => s.auth.user?.role === 'admin';
export default authSlice.reducer;
