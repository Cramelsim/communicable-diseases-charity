import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DiseaseMap from './DiseaseMap';

// Leaflet needs a real layout engine, so swap react-leaflet for simple elements.
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  CircleMarker: ({ children, radius }) => <div data-testid="marker" data-radius={radius}>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
}));

const markers = [
  { area: 1, name: 'Lagos, Nigeria', latitude: 6.5, longitude: 3.4, total_cases: 127400, total_deaths: 2000, intensity: 1, cases_per_100k: 827.3, diseases: [{ disease: 1, name: 'Malaria', cases: 120000 }] },
  { area: 2, name: 'Turkana, Kenya', latitude: 3.1, longitude: 35.6, total_cases: 7100, total_deaths: 130, intensity: 0.05, cases_per_100k: 767.5, diseases: [{ disease: 3, name: 'Cholera', cases: 4800 }] },
];

test('renders a marker per area, sized by intensity', () => {
  render(<MemoryRouter><DiseaseMap markers={markers} /></MemoryRouter>);
  const rendered = screen.getAllByTestId('marker');
  expect(rendered).toHaveLength(2);
  expect(Number(rendered[0].dataset.radius)).toBeGreaterThan(Number(rendered[1].dataset.radius));
  expect(screen.getByRole('link', { name: 'Lagos, Nigeria' })).toHaveAttribute('href', '/areas/1');
});
