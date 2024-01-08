import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { onRegister } = useAuth();

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    onRegister(email, name, password)
    if (email && password) {
      setError('');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <div className="w-full max-w-xs mt-6">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>
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
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="name">
            Your name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleRegister}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
