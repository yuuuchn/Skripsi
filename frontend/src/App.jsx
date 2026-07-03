import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import NetworkBackground from './components/NetworkBackground';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Materi from './pages/Materi';
import DetailMateri from './pages/DetailMateri';
import Kuis from './pages/Kuis';
import Nilai from './pages/Nilai';
import Admin from './pages/Admin';

function AppContent() {
  const { user, loading } = useAuth();

  return (
    <div className="relative min-h-screen">
      {!user && <NetworkBackground />}
      {user && <Navbar />}
      <main className={`relative z-10 ${user ? 'pt-0' : ''}`}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/materi" element={<ProtectedRoute><Materi /></ProtectedRoute>} />
          <Route path="/materi/:id" element={<ProtectedRoute><DetailMateri /></ProtectedRoute>} />
          <Route path="/kuis/:materi_id" element={<ProtectedRoute><Kuis /></ProtectedRoute>} />
          <Route path="/nilai" element={<ProtectedRoute><Nilai /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
