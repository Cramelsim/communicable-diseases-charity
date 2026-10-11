import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api } from '../api/client';
import { renderWithProviders } from '../testUtils';
import Login from './Login';

jest.mock('../api/client', () => ({
  api: jest.fn(),
  unwrapList: (d) => d?.results ?? d ?? [],
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

test('submits credentials and stores the user', async () => {
  api.mockResolvedValue({ access: 't', user: { id: 1, username: 'amina', role: 'user' } });
  const { store } = renderWithProviders(<Login />);
  await userEvent.type(screen.getByLabelText(/username/i), 'amina');
  await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));
  await waitFor(() => expect(store.getState().auth.user.username).toBe('amina'));
  expect(api).toHaveBeenCalledWith('/auth/login/', { method: 'POST', body: { username: 'amina', password: 'secret123' } });
});

test('shows an error for bad credentials', async () => {
  api.mockRejectedValue({ status: 401, message: 'x' });
  renderWithProviders(<Login />);
  await userEvent.type(screen.getByLabelText(/username/i), 'a');
  await userEvent.type(screen.getByLabelText(/password/i), 'b');
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid username or password');
});
