import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import FormTitle from '../ui/FormTitle';
import FromError from '../ui/FormError';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { onRegister } = useAuth();

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    const error = await onRegister(email, name, password)
    if (error) {
      setError(error);
    }
  };

  useEffect(() => {
    setError('')
  }, [email, password])

  const isDisabled = email.length === 0 || password.length === 0

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 flex flex-col w-80">
        <FormTitle>Register</FormTitle>
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
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="name">
            Your name
          </label>
          <Input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <Button onClick={handleRegister} disabled={isDisabled}>Register</Button>
      </form>
    </div>
  );
};

export default Register;
