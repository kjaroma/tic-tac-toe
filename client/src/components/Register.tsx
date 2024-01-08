import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { onRegister } = useAuth();

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogin()
    if (email && password) {
      setError('');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <div>
      <form>
        <h2>Login</h2>

        {error && <p>{error}</p>}

        <div>
          <label htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleRegister}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Register;
