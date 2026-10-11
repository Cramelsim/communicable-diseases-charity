import { makeStore } from '../../app/store';
import { login, logout, register } from './authSlice';
import { api, tokenStorage } from '../../api/client';

jest.mock('../../api/client', () => ({
  api: jest.fn(),
  unwrapList: (d) => (Array.isArray(d) ? d : d?.results ?? []),
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

const user = { id: 1, username: 'amina', role: 'user' };

describe('authSlice', () => {
  beforeEach(() => jest.clearAllMocks());

  test('login stores token and user', async () => {
    api.mockResolvedValue({ access: 'tok', user });
    const store = makeStore();
    await store.dispatch(login({ username: 'amina', password: 'pw' }));
    expect(tokenStorage.set).toHaveBeenCalledWith('tok');
    expect(store.getState().auth.user).toEqual(user);
  });

  test('login failure sets friendly error', async () => {
    api.mockRejectedValue({ status: 401, message: 'nope' });
    const store = makeStore();
    await store.dispatch(login({ username: 'x', password: 'y' }));
    expect(store.getState().auth.error).toBe('Invalid username or password');
    expect(store.getState().auth.user).toBeNull();
  });

  test('register creates account then logs in', async () => {
    api.mockResolvedValueOnce({}).mockResolvedValueOnce({ access: 'tok', user });
    const store = makeStore();
    await store.dispatch(register({ username: 'amina', email: 'a@x.org', password: 'pw' }));
    expect(api).toHaveBeenCalledTimes(2);
    expect(store.getState().auth.user).toEqual(user);
  });

  test('logout clears user and token', () => {
    const store = makeStore({ auth: { user, status: 'idle', error: null } });
    store.dispatch(logout());
    expect(store.getState().auth.user).toBeNull();
    expect(tokenStorage.clear).toHaveBeenCalled();
  });
});
