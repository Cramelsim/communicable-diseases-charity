import { screen } from '@testing-library/react';
import { api } from '../api/client';
import { renderWithProviders } from '../testUtils';
import Diseases from './Diseases';

jest.mock('../api/client', () => ({
  api: jest.fn(),
  unwrapList: (d) => d?.results ?? d ?? [],
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

test('lists diseases ranked by prevalence', async () => {
  api.mockResolvedValue({
    results: [
      { id: 1, name: 'Malaria', severity: 'high', total_cases: 301000, areas_affected: 4 },
      { id: 2, name: 'Cholera', severity: 'critical', total_cases: 26400, areas_affected: 3 },
    ],
  });
  renderWithProviders(<Diseases />);
  expect(await screen.findByText('Malaria')).toBeInTheDocument();
  expect(screen.getByText('#1')).toBeInTheDocument();
  expect(screen.getByText(/301,000 reported cases/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /cholera/i })).toHaveAttribute('href', '/diseases/2');
});

test('shows error state when the request fails', async () => {
  api.mockRejectedValue(new Error('Network down'));
  renderWithProviders(<Diseases />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Network down');
});
