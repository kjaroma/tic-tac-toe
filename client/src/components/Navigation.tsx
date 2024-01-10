import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {

  const { userAuthData, onLogout } = useAuth()
  const {pathname} = useLocation()

  console.log(pathname)
  if(pathname.match(/^(\/login|\/register)$/)) {

    return null
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-gray-300 font-bold text-lg">Tic Tac Toe Online</div>
        <div className="space-x-4">
          <Link className="text-gray-300" to="/game">Game</Link>
          <Link className="text-gray-300" to="/history">History</Link>
          {userAuthData.accessToken ? (
            <button className="text-gray-300" type="button" onClick={onLogout}>
              Sign Out
            </button>
          ) :
            <Link className="text-gray-300" to="/login">Login</Link>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navigation