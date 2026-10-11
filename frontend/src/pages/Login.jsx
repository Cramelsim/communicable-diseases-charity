import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthError, login, selectUser } from '../features/auth/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
  useEffect(() => {
    if (user) navigate(location.state?.from || '/diseases', { replace: true });
  }, [user, navigate, location.state]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <form className="card form" onSubmit={onSubmit}>
      <h1>Log in</h1>
      {error && <p role="alert" className="error">{error}</p>}
      <label>
        Username
        <input name="username" value={form.username} onChange={onChange} required autoComplete="username" />
      </label>
      <label>
        Password
        <input name="password" type="password" value={form.password} onChange={onChange} required autoComplete="current-password" />
      </label>
      <button className="btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Logging in…' : 'Log in'}
      </button>
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
