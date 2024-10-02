'use client';

import React, { useState } from 'react';
import { Button, Input, Label } from '@fluentui/react-components';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== repeatPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      const { body, status } = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
      if (status !== 201) throw Error('error');
      if (!body) throw Error('empty response');
      setIsLoading(false);
      router.push('/login');
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value !== repeatPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError(null);
    }
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
    if (password !== e.target.value) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError(null);
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
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
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
        <div className={styles.buttonGroup}>
          <Button
            appearance="primary"
            onClick={handleSignup}
            disabled={passwordError !== null || password === '' || email === '' || isLoading}
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
