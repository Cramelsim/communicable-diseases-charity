import { screen } from '@testing-library/react';
import { api } from '../api/client';
import { renderWithProviders } from '../testUtils';
import Home from './Home';

jest.mock('../api/client', () => ({
  api: jest.fn(),
  unwrapList: (d) => d?.results ?? d ?? [],
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

test('shows headline figures and top diseases', async () => {
  api.mockImplementation(async (path) => {
    if (path === '/diseases/') return { results: [{ id: 1, name: 'Malaria', total_cases: 3000 }, { id: 2, name: 'Cholera', total_cases: 1000 }] };
    if (path === '/areas/') return { results: [{ id: 1, name: 'Kisumu', country: 'Kenya', total_cases: 2000 }] };
    if (path === '/donations/totals/') return [{ area: 1, total: 125, donations: 3 }];
    return {};
  });
  renderWithProviders(<Home />);
  expect(await screen.findByRole('link', { name: 'Malaria' })).toHaveAttribute('href', '/diseases/1');
  expect(screen.getByText('4K')).toBeInTheDocument(); // total cases, compact
  expect(await screen.findByText('$125')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Join the effort' })).toHaveAttribute('href', '/register');
});
