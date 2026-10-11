import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, unwrapList } from './client';

const errorMessage = (e) => e.message || 'Something went wrong';

/**
 * Builds a slice + thunks for a REST resource (list / get / create / update / remove).
 * Used for diseases, areas and reviews so state handling stays consistent.
 */
export function makeResourceSlice(name, path) {
  const fetchList = createAsyncThunk(`${name}/fetchList`, async (params, { rejectWithValue }) => {
    try {
      return unwrapList(await api(`/${path}/`, { params }));
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  });
  const fetchOne = createAsyncThunk(`${name}/fetchOne`, async (id, { rejectWithValue }) => {
    try {
      return await api(`/${path}/${id}/`);
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  });
  const create = createAsyncThunk(`${name}/create`, async (body, { rejectWithValue }) => {
    try {
      return await api(`/${path}/`, { method: 'POST', body });
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  });
  const update = createAsyncThunk(`${name}/update`, async ({ id, ...body }, { rejectWithValue }) => {
    try {
      return await api(`/${path}/${id}/`, { method: 'PATCH', body });
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  });
  const remove = createAsyncThunk(`${name}/remove`, async (id, { rejectWithValue }) => {
    try {
      await api(`/${path}/${id}/`, { method: 'DELETE' });
      return id;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  });

  const slice = createSlice({
    name,
    initialState: { items: [], current: null, status: 'idle', error: null },
    reducers: {
      clearError(state) {
        state.error = null;
      },
    },
    extraReducers: (b) => {
      b.addCase(fetchList.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
        .addCase(fetchList.fulfilled, (s, a) => {
          s.status = 'succeeded';
          s.items = a.payload;
        })
        .addCase(fetchOne.pending, (s) => {
          s.status = 'loading';
          s.current = null;
          s.error = null;
        })
        .addCase(fetchOne.fulfilled, (s, a) => {
          s.status = 'succeeded';
          s.current = a.payload;
        })
        .addCase(create.fulfilled, (s, a) => {
          s.items.unshift(a.payload);
        })
        .addCase(update.fulfilled, (s, a) => {
          s.items = s.items.map((i) => (i.id === a.payload.id ? { ...i, ...a.payload } : i));
        })
        .addCase(remove.fulfilled, (s, a) => {
          s.items = s.items.filter((i) => i.id !== a.payload);
        })
        .addMatcher(
          (a) => a.type.startsWith(`${name}/`) && a.type.endsWith('/rejected'),
          (s, a) => {
            s.status = 'failed';
            s.error = a.payload || a.error?.message;
          }
        );
    },
  });

  return { slice, reducer: slice.reducer, actions: slice.actions, thunks: { fetchList, fetchOne, create, update, remove } };
}
