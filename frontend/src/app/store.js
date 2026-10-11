import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import diseases from '../features/diseases/diseasesSlice';
import areas from '../features/areas/areasSlice';
import reviews from '../features/reviews/reviewsSlice';
import donations from '../features/donations/donationsSlice';
import users from '../features/admin/usersSlice';
import map from '../features/map/mapSlice';

export const reducer = { auth, diseases, areas, reviews, donations, users, map };

export const makeStore = (preloadedState) => configureStore({ reducer, preloadedState });
export const store = makeStore();
