import {Routes, Route, Navigate} from 'react-router-dom';
import {useAuth} from './hooks/useAuth';
import Login from './pages/Login';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Scanner from './pages/Scanner'

export default function App() {
  const {session, loading} = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#0A192F] p-6 text-[#00F2FF]">Memuat...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={session ? <Home session={session} /> : <Navigate to="/login" />} />
      <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
      <Route path="/map" element={session ? <MapPage /> : <Navigate to="/login" />} />
      <Route path="/scanner" element={<Scanner session={session} />} />
    </Routes>
  );
}
