import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAdmin, selectUser } from '../features/auth/authSlice';

export default function ProtectedRoute({ adminOnly = false }) {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (adminOnly && !isAdmin) return <p role="alert">You need admin access to view this page.</p>;
  return <Outlet />;
}
