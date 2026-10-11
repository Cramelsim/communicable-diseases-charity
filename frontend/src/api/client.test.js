import { api, ApiError, tokenStorage, unwrapList } from './client';

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  const respond = (status, body) =>
    global.fetch.mockResolvedValue({ ok: status < 400, status, json: async () => body });

  test('sends bearer token and query params', async () => {
    tokenStorage.set('abc');
    respond(200, { results: [] });
    await api('/diseases/', { params: { search: 'mal', empty: '' } });
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toBe('http://api.test/api/diseases/?search=mal');
    expect(opts.headers.Authorization).toBe('Bearer abc');
  });

  test('throws ApiError with a readable message', async () => {
    respond(400, { amount: ['The minimum donation is 1.00.'] });
    await expect(api('/donations/', { method: 'POST', body: {} })).rejects.toThrow(
      'amount: The minimum donation is 1.00.'
    );
    await expect(api('/x/')).rejects.toBeInstanceOf(ApiError);
  });

  test('handles 204 responses', async () => {
    respond(204);
    expect(await api('/diseases/1/', { method: 'DELETE' })).toBeNull();
  });

  test('unwrapList accepts paginated and plain responses', () => {
    expect(unwrapList({ results: [1] })).toEqual([1]);
    expect(unwrapList([2])).toEqual([2]);
    expect(unwrapList(null)).toEqual([]);
  });
});
