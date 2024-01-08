import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { onLogin } = useAuth();

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogin(email, password)
    if (email && password) {
      setError('');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <div className="w-full max-w-xs mt-6">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
        {error && <p>{error}</p>}
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6"
          onClick={handleLogin}
        >
          Login
        </button>
        <div>
          <span className='text-sm block mb-2'>
            Do not have account yet?
          </span>
          <Link className="text-blue-500 hover:text-blue-800" to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
