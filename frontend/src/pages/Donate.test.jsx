import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api } from '../api/client';
import { renderWithProviders } from '../testUtils';
import Donate from './Donate';

jest.mock('../api/client', () => ({
  api: jest.fn(),
  unwrapList: (d) => d?.results ?? d ?? [],
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

test('donor can pick a preset and donate to an area', async () => {
  api.mockImplementation(async (path, opts = {}) => {
    if (path === '/areas/') return { results: [{ id: 7, name: 'Kisumu', country: 'Kenya' }] };
    if (path === '/diseases/') return { results: [] };
    if (path === '/donations/' && opts.method === 'POST')
      return { id: 1, amount: '25.00', currency: 'USD', area_name: 'Kisumu, Kenya', status: 'completed' };
    return { results: [] };
  });
  renderWithProviders(<Donate />);
  await screen.findByRole('option', { name: 'Kisumu, Kenya' });
  await userEvent.selectOptions(screen.getByLabelText(/^area/i), '7');
  await userEvent.click(screen.getByRole('button', { name: '$25' }));
  await userEvent.click(screen.getByRole('button', { name: 'Donate' }));
  expect(await screen.findByRole('status')).toHaveTextContent(/25\.00 USD to Kisumu, Kenya/);
  const post = api.mock.calls.find(([, o]) => o?.method === 'POST');
  expect(post[1].body).toMatchObject({ area: 7, amount: '25', disease: null });
});
