'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Text } from '@/components/Text';
import { Input } from '@/components/Input';
import Spinner from '@/components/Spinner';
import './LandingPage.css';

export default function LandingPage() {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
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
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="landing-container">
      {/* Left Side - Illustration */}
      <div className="landing-left">
        <div className="illustration">
          {/* Computer Monitor */}
          <div className="computer">
            <div className="screen">
              <div className="screen-content">
                <div className="chart-line"></div>
                <div className="chart-bar"></div>
              </div>
            </div>
            <div className="computer-base"></div>
          </div>

          {/* Coffee Cup */}
          <div className="coffee-cup">
            <div className="cup-body">
              <div className="steam"></div>
              <div className="steam steam-2"></div>
              <div className="steam steam-3"></div>
            </div>
            <div className="cup-handle"></div>
          </div>

          {/* Notebook */}
          <div className="notebook">
            <div className="notebook-spiral"></div>
            <div className="notebook-lines">
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
          </div>

          {/* Plant */}
          <div className="plant">
            <div className="pot"></div>
            <div className="leaf leaf-1"></div>
            <div className="leaf leaf-2"></div>
            <div className="leaf leaf-3"></div>
          </div>
        </div>

        <div className="landing-text">
          <Text as="h1" variant="heading-1">Track Your Expenses Effortlessly</Text>
          <Text as="p" variant="body-large" color="muted">Take control of your finances with our intuitive expense tracker. Monitor spending, set budgets, and achieve your financial goals.</Text>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="landing-right">
        <div className="signup-card">
          <Text as="h2" variant="heading-2" color="dark">Create Your Account</Text>
          <Text as="p" variant="body" color="light-gray" className="signup-subtitle">Start managing your finances today</Text>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <Input
              variant="light"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              label="Full Name"
              required
            />

            <Input
              variant="light"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              label="Email Address"
              required
            />

            <Input
              variant="light"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              label="Password"
              required
            />

            <Input
              variant="light"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              label="Confirm Password"
              required
            />

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? (
                <span className="signup-button-loading">
                  <Spinner size="small" color="white" />
                  Creating Account...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="divider">
            <Text as="span" variant="body-small" color="light-gray">or</Text>
          </div>

          <button
            type="button"
            className="github-button"
            onClick={() => signIn('github')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <Text as="p" variant="body-small" color="dark-gray" className="login-link">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="link-button"
            >
              Log in
            </button>
          </Text>
        </div>
      </div>
    </div>
  );
}
