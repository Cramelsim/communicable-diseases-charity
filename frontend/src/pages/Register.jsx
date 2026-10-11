import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthError, register, selectUser } from '../features/auth/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  return (
    <div className="auth-wrap">
    <form className="card form" onSubmit={onSubmit}>
      <div>
        <h1>Join Health Aid</h1>
        <p className="muted">Create a free account to share ideas and donate.</p>
      </div>
      {error && <p role="alert" className="error">{error}</p>}
      <label>
        Username
        <input name="username" value={form.username} onChange={onChange} required autoComplete="username" />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" value={form.password} onChange={onChange} required minLength={8} autoComplete="new-password" />
      </label>
      <button className="btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Creating…' : 'Sign up'}
      </button>
      <p className="muted">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </form>
    </div>
  );
}
