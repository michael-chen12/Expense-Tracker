'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, FormGroup, FormLabel, FormError, FormActions } from '@/components/Form';
import { Input } from '@/components/Input';
import { Text } from '@/components/Text';
import Spinner from '@/components/Spinner';
import './register.css';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Registration successful, but login failed. Please try logging in.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGitHubRegister = async () => {
    setLoading(true);
    try {
      await signIn('github', {
        callbackUrl: '/',
      });
    } catch (err) {
      setError('Failed to sign up with GitHub');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Text as="h1" variant="heading-2">Create Account</Text>
          <Text as="p" variant="body" color="muted" className="subtle">Start tracking your expenses today</Text>
        </div>

        {error && (
          <div className="error error-margin">
            {error}
          </div>
        )}

        <Form onSubmit={handleRegister} className="auth-form">
          <FormGroup>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              variant="light"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              variant="light"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              variant="light"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="At least 8 characters"
              disabled={loading}
              minLength={8}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              variant="light"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
              disabled={loading}
            />
          </FormGroup>

          <button
            type="submit"
            className="button primary full-width"
            disabled={loading}
          >
            {loading ? (
              <span className="button-loading-content-centered">
                <Spinner size="small" color="white" />
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </Form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="button github-button full-width"
          onClick={handleGitHubRegister}
          disabled={loading}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ marginRight: '8px' }}
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Sign up with GitHub
        </button>

        <div className="auth-footer">
          <Text as="p" variant="body-small">
            Already have an account?{' '}
            <Link href="/login" className="link">
              Sign in
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}
