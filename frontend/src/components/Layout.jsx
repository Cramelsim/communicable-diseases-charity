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
        <div className="header-inner">
          <Link to="/" className="brand" onClick={close}>
            <span className="brand-mark" aria-hidden="true">🩺</span> Health Aid
          </Link>
          <button className="menu-toggle" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
          <nav className={`nav ${open ? 'open' : ''}`} onClick={close}>
            <NavLink to="/diseases">Diseases</NavLink>
            <NavLink to="/areas">Areas</NavLink>
            <NavLink to="/map">Map</NavLink>
            {isAdmin && (
              <>
                <span className="nav-sep" />
                <NavLink to="/admin/diseases">Diseases admin</NavLink>
                <NavLink to="/admin/areas">Areas admin</NavLink>
                <NavLink to="/admin/users">Users</NavLink>
              </>
            )}
            <span className="nav-sep" />
            {user ? (
              <>
                <NavLink to="/donate" className="nav-cta">Donate</NavLink>
                <button className="link-btn" onClick={handleLogout}>
                  Log out ({user.username})
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <NavLink to="/register" className="nav-cta">Sign up</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        Health Aid · Preventing communicable diseases through data, community and giving.
      </footer>
    </>
  );
}
