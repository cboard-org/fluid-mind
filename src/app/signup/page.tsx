'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, Label } from '@fluentui/react-components';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = useCallback(() => {
    setError(null);
    if (!username) {
      setError('username is required.');
    }

    if (!email) {
      setError('Email is required.');
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid.');
    }

    if (!password) {
      setError('Password is required.');
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long.');
    }
    if (password && password !== repeatPassword) {
      setError('Passwords do not match.');
    }
  }, [username, email, password, repeatPassword]);

  useEffect(() => {
    validateForm();
  }, [username, email, password, validateForm]);

  const handleSignup = async () => {
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
      const { status, body } = response;

      if (status === 409) throw Error('User or email already exists');
      if (status !== 201) throw Error('error creating user');
      if (!body) throw Error('empty response');
      setIsLoading(false);
      router.push('/login');
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
      if (error instanceof Error) return setError(error.message);
      return setError('Something went wrong');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value !== repeatPassword) {
      return setError('Passwords do not match');
    }
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
    if (password !== e.target.value) {
      setError('Passwords do not match');
    } else {
      setError(null);
    }
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Signup</h2>
        <div className={styles.fieldContainer}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.fieldContainer}>
          <Label htmlFor="userName">User Name</Label>
          <Input
            id="UserName"
            placeholder="Enter your username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.fieldContainer}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className={styles.fieldContainer}>
          <Label htmlFor="repeatPassword">Repeat Password</Label>
          <Input
            id="repeatPassword"
            type="password"
            placeholder="Repeat your password"
            value={repeatPassword}
            onChange={handleRepeatPasswordChange}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className={styles.buttonGroup}>
          <Button
            appearance="primary"
            onClick={handleSignup}
            disabled={error !== null || password === '' || email === '' || isLoading}
          >
            Signup
          </Button>
          <Button appearance="secondary" onClick={goToLogin}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
