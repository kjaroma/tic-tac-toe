import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {

  const { userAuthData, onLogout } = useAuth()

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">Tic Tac Toe Online</div>
        <div className="space-x-4">
          <Link className="text-white" to="/game">Game</Link>
          <Link className="text-white" to="/history">History</Link>
          {userAuthData.accessToken ? (
            <button className="text-white" type="button" onClick={onLogout}>
              Sign Out
            </button>
          ) :
            <Link className="text-white" to="/login">Login</Link>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navigation