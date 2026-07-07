import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Materi from './pages/Materi';
import DetailMateri from './pages/DetailMateri';
import Kuis from './pages/Kuis';
import Nilai from './pages/Nilai';
import Admin from './pages/Admin';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';
import DotField from './components/DotField';
import HandCursor from './components/HandCursor';
import { Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated Top Navigation Loading Progress Bar
function PageLoaderProgress() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // Duration matches transition speed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ width: '0%', opacity: 1 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}

// Premium Fullscreen Global Authentication Loader
function FullscreenLoader() {
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-50">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-10 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-96 h-96 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Glowing rotating circle */}
        <div className="relative w-16 h-16 mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
            <Globe className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        <h2 className="font-display text-lg font-black text-slate-800 tracking-tight">BelajarJaringan</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5 animate-pulse">Menyiapkan materi...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullscreenLoader />;
  }

  return (
    <div className="relative min-h-screen">
      <PageLoaderProgress />
      {!user && <DotField />}
      {user && <Navbar />}
      {user && <HandCursor />}
      <main className={`relative z-10 ${user ? 'pt-0' : ''}`}>
        <ErrorBoundary>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <PageTransition><Register /></PageTransition>} />
          <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
          <Route path="/materi" element={<ProtectedRoute><PageTransition><Materi /></PageTransition></ProtectedRoute>} />
          <Route path="/materi/:id" element={<ProtectedRoute><PageTransition><DetailMateri /></PageTransition></ProtectedRoute>} />
          <Route path="/kuis/:materi_id" element={<ProtectedRoute><PageTransition><Kuis /></PageTransition></ProtectedRoute>} />
          <Route path="/nilai" element={<ProtectedRoute><PageTransition><Nilai /></PageTransition></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><PageTransition><Admin /></PageTransition></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        </ErrorBoundary>
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
