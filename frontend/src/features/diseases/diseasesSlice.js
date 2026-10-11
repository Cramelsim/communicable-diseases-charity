import { makeResourceSlice } from '../../api/resourceSlice';

const resource = makeResourceSlice('diseases', 'diseases');

export const diseases = resource.thunks;
export const selectDiseases = (s) => s.diseases;
export default resource.reducer;
