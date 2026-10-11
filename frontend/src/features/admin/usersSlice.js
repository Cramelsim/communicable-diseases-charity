import { makeResourceSlice } from '../../api/resourceSlice';

const resource = makeResourceSlice('users', 'users');

export const users = resource.thunks;
export default resource.reducer;
