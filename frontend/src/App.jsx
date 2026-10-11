import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Diseases from './pages/Diseases';
import DiseaseDetail from './pages/DiseaseDetail';
import Areas from './pages/Areas';
import AreaDetail from './pages/AreaDetail';
import MapPage from './pages/MapPage';
import Donate from './pages/Donate';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDiseases from './pages/admin/AdminDiseases';
import AdminAreas from './pages/admin/AdminAreas';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/diseases" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/diseases/:id" element={<DiseaseDetail />} />
        <Route path="/areas" element={<Areas />} />
        <Route path="/areas/:id" element={<AreaDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/donate" element={<Donate />} />
        </Route>
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/diseases" element={<AdminDiseases />} />
          <Route path="/admin/areas" element={<AdminAreas />} />
        </Route>
        <Route path="*" element={<p>Page not found.</p>} />
      </Route>
    </Routes>
  );
}
