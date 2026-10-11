import { makeResourceSlice } from '../../api/resourceSlice';

const resource = makeResourceSlice('areas', 'areas');

export const areas = resource.thunks;
export const selectAreas = (s) => s.areas;
export default resource.reducer;
