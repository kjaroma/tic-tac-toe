import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {

const {token, onLogout} = useAuth()

    return (
      <nav>
        <Link to="/game">Game</Link>
        <Link to="/history">History</Link>
        {token && (
        <button type="button" onClick={onLogout}>
          Sign Out
        </button>
      )}
      </nav>
    );
  };

  export default Navigation