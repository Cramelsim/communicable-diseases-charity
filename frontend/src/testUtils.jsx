import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeStore } from './app/store';

export function renderWithProviders(ui, { preloadedState, route = '/', store = makeStore(preloadedState) } = {}) {
  return { store, ...render(<Provider store={store}><MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter></Provider>) };
}
