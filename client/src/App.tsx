import './App.css';
import Game from './components/pages/Game';
import History from './components/pages/History';
import Navigation from './components/Navigation';
import { Routes, Route } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css'
import Layout from './components/Layout';
import Register from './components/pages/Register';


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            } />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
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
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
