import './App.css';
import Game from './components/Game';
import History from './components/History';
import Navigation from './components/Navigation';
import { Routes, Route } from 'react-router-dom';
import NotFound from './components/NotFound';
import Login from './components/Login';
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route index element={<Game />} />
          <Route path="login" element={<Login />} />
          <Route path="game" element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          } />
          <Route path="history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
