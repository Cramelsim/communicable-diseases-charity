import { makeStore } from '../app/store';
import { diseases } from '../features/diseases/diseasesSlice';
import { api } from './client';

jest.mock('./client', () => ({
  api: jest.fn(),
  unwrapList: (d) => (Array.isArray(d) ? d : d?.results ?? []),
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

describe('resource slice (diseases)', () => {
  beforeEach(() => jest.clearAllMocks());

  test('fetchList stores items', async () => {
    api.mockResolvedValue({ results: [{ id: 1, name: 'Malaria' }] });
    const store = makeStore();
    await store.dispatch(diseases.fetchList());
    expect(store.getState().diseases.items).toHaveLength(1);
    expect(store.getState().diseases.status).toBe('succeeded');
  });

  test('create, update and remove keep list in sync', async () => {
    const store = makeStore();
    api.mockResolvedValueOnce({ id: 2, name: 'TB' });
    await store.dispatch(diseases.create({ name: 'TB' }));
    api.mockResolvedValueOnce({ id: 2, name: 'Tuberculosis' });
    await store.dispatch(diseases.update({ id: 2, name: 'Tuberculosis' }));
    expect(store.getState().diseases.items[0].name).toBe('Tuberculosis');
    api.mockResolvedValueOnce(null);
    await store.dispatch(diseases.remove(2));
    expect(store.getState().diseases.items).toHaveLength(0);
  });

  test('failures set error state', async () => {
    api.mockRejectedValue(new Error('boom'));
    const store = makeStore();
    await store.dispatch(diseases.fetchList());
    expect(store.getState().diseases.status).toBe('failed');
    expect(store.getState().diseases.error).toBe('boom');
  });
});
