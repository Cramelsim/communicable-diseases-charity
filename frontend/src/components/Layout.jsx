import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout, selectIsAdmin, selectUser } from '../features/auth/authSlice';

export default function Layout() {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    close();
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="brand" onClick={close}>
          🩺 Health Aid
        </Link>
        <button className="menu-toggle" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <nav className={`nav ${open ? 'open' : ''}`} onClick={close}>
          <NavLink to="/diseases">Diseases</NavLink>
          <NavLink to="/areas">Areas</NavLink>
          <NavLink to="/map">Map</NavLink>
          {user && <NavLink to="/donate">Donate</NavLink>}
          {isAdmin && (
            <>
              <NavLink to="/admin/diseases">Manage diseases</NavLink>
              <NavLink to="/admin/areas">Manage areas</NavLink>
              <NavLink to="/admin/users">Manage users</NavLink>
            </>
          )}
          {user ? (
            <button className="link-btn" onClick={handleLogout}>
              Log out ({user.username})
            </button>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Sign up</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
