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
import { AppRoutes } from './constants';


function App() {
  return (
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            } />
            <Route path={AppRoutes.LOGIN} element={<Login />} />
            <Route path={AppRoutes.REGISTER} element={<Register />} />
            <Route path={AppRoutes.GAME} element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            } />
            <Route path={AppRoutes.HISTORY} element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
  );
}

export default App;
