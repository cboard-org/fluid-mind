'use client';

import React, { useState } from 'react';
import { Button, Input, Label } from '@fluentui/react-components';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { signIn } from 'next-auth/react';

type Props = {
  errorMessage: string;
};

const LoginPage = ({ errorMessage }: Props) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn('credentials', { email, password, callbackUrl: '/' });
      setIsLoading(false);
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
    }
  };

  const goToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Login</h2>
        <div className={styles.fieldContainer}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.fieldContainer}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>Error on login</p>}
        <div className={styles.buttonGroup}>
          <Button appearance="primary" onClick={handleLogin} disabled={isLoading}>
            Login
          </Button>
          <Button appearance="secondary" onClick={goToSignup}>
            Signup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
