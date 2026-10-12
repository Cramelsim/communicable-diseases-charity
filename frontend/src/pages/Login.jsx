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
    if (user) navigate(location.state?.from || '/', { replace: true });
  }, [user, navigate, location.state]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="auth-wrap">
      <form className="panel form" onSubmit={onSubmit}>
        <div>
          <h1>Log in</h1>
          <p className="muted">Log in to share ideas and donate.</p>
        </div>
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
        <p className="muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
