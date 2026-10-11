import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchMap = createAsyncThunk('map/fetch', async (params, { rejectWithValue }) => {
  try {
    return await api('/map/', { params });
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const mapSlice = createSlice({
  name: 'map',
  initialState: { markers: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMap.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    })
      .addCase(fetchMap.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.markers = a.payload;
      })
      .addCase(fetchMap.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error?.message;
      });
  },
});

export default mapSlice.reducer;
