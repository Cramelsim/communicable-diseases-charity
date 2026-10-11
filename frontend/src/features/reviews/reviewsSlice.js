import { makeResourceSlice } from '../../api/resourceSlice';

const resource = makeResourceSlice('reviews', 'reviews');

export const reviews = resource.thunks;
export const selectReviews = (s) => s.reviews;
export default resource.reducer;
