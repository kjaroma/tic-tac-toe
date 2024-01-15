import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import FormTitle from '../ui/FormTitle';
import FromError from '../ui/FormError';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { onLogin } = useAuth();

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    const error = await onLogin(email, password)
    if (error) {
      setError(error);
    }
  };

  useEffect(() => {
    setError('')
  }, [email, password])
  const isDisabled = email.length === 0 || password.length === 0

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 flex flex-col w-80">
        <FormTitle>Login</FormTitle>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">
            Email
          </label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">
            Password
          </label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <FromError message={error} />
        <Button onClick={handleLogin} disabled={isDisabled}>Login</Button>
        <div>
          <span className='text-sm block pt-4'>
            Do not have account yet?
          </span>
          <Link className="text-blue-500 hover:text-blue-800" to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
