import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../testUtils';
import ProtectedRoute from './ProtectedRoute';

const ui = (
  <Routes>
    <Route path="/login" element={<p>login page</p>} />
    <Route element={<ProtectedRoute adminOnly />}>
      <Route path="/admin" element={<p>admin area</p>} />
    </Route>
  </Routes>
);
const withUser = (role) => ({ auth: { user: { username: 'u', role }, status: 'idle', error: null } });

test('redirects anonymous visitors to login', () => {
  renderWithProviders(ui, { route: '/admin' });
  expect(screen.getByText('login page')).toBeInTheDocument();
});

test('blocks non-admin users', () => {
  renderWithProviders(ui, { route: '/admin', preloadedState: withUser('user') });
  expect(screen.getByRole('alert')).toHaveTextContent(/admin access/i);
});

test('allows admins', () => {
  renderWithProviders(ui, { route: '/admin', preloadedState: withUser('admin') });
  expect(screen.getByText('admin area')).toBeInTheDocument();
});
