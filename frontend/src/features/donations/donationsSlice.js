import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, unwrapList } from '../../api/client';

export const fetchMyDonations = createAsyncThunk('donations/fetchMine', async (_, { rejectWithValue }) => {
  try {
    return unwrapList(await api('/donations/'));
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchTotals = createAsyncThunk('donations/fetchTotals', async (_, { rejectWithValue }) => {
  try {
    return await api('/donations/totals/');
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const donate = createAsyncThunk('donations/donate', async (body, { rejectWithValue }) => {
  try {
    return await api('/donations/', { method: 'POST', body });
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const donationsSlice = createSlice({
  name: 'donations',
  initialState: { mine: [], totals: [], status: 'idle', error: null, lastDonation: null },
  reducers: {
    resetDonation(state) {
      state.lastDonation = null;
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchMyDonations.fulfilled, (s, a) => {
      s.mine = a.payload;
    })
      .addCase(fetchTotals.fulfilled, (s, a) => {
        s.totals = a.payload;
      })
      .addCase(donate.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(donate.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.lastDonation = a.payload;
        s.mine.unshift(a.payload);
      })
      .addCase(donate.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error?.message;
      });
  },
});

export const { resetDonation } = donationsSlice.actions;
export default donationsSlice.reducer;
