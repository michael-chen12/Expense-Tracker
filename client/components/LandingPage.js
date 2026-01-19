'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

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
          <h1>Track Your Expenses Effortlessly</h1>
          <p>Take control of your finances with our intuitive expense tracker. Monitor spending, set budgets, and achieve your financial goals.</p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="landing-right">
        <div className="signup-card">
          <h2>Create Your Account</h2>
          <p className="signup-subtitle">Start managing your finances today</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Spinner size="small" color="white" />
                  Creating Account...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
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

          <p className="login-link">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="link-button"
            >
              Log in
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .landing-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .landing-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px;
          color: white;
        }

        .illustration {
          position: relative;
          width: 500px;
          height: 400px;
          margin-bottom: 40px;
        }

        /* Computer */
        .computer {
          position: absolute;
          top: 50px;
          left: 50px;
          z-index: 5;
        }

        .screen {
          width: 280px;
          height: 180px;
          background: linear-gradient(145deg, #2d3748, #1a202c);
          border-radius: 8px;
          border: 3px solid #4a5568;
          padding: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .screen-content {
          display: flex;
          gap: 15px;
          align-items: flex-end;
          height: 100%;
        }

        .chart-line {
          flex: 1;
          height: 70%;
          background: linear-gradient(180deg, #48bb78 0%, #38a169 100%);
          border-radius: 4px;
          animation: grow 2s ease-in-out infinite;
        }

        .chart-bar {
          flex: 1;
          height: 50%;
          background: linear-gradient(180deg, #4299e1 0%, #3182ce 100%);
          border-radius: 4px;
          animation: grow 2s ease-in-out infinite 0.3s;
        }

        @keyframes grow {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.1); }
        }

        .computer-base {
          width: 300px;
          height: 20px;
          background: linear-gradient(145deg, #4a5568, #2d3748);
          border-radius: 0 0 8px 8px;
          margin-top: -2px;
        }

        /* Coffee Cup */
        .coffee-cup {
          position: absolute;
          top: 250px;
          left: 350px;
          display: flex;
          align-items: center;
          z-index: 10;
        }

        .cup-body {
          width: 70px;
          height: 85px;
          background: linear-gradient(145deg, #ed8936, #dd6b20);
          border-radius: 0 0 12px 12px;
          position: relative;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .steam {
          position: absolute;
          top: -20px;
          left: 15px;
          width: 4px;
          height: 20px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: steam 2s ease-in-out infinite;
        }

        .steam-2 {
          left: 30px;
          animation-delay: 0.3s;
        }

        .steam-3 {
          left: 45px;
          animation-delay: 0.6s;
        }

        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-15px) scale(0.5); opacity: 0; }
        }

        .cup-handle {
          width: 25px;
          height: 40px;
          border: 4px solid #ed8936;
          border-left: none;
          border-radius: 0 50% 50% 0;
          margin-left: -4px;
          margin-top: 20px;
        }

        /* Notebook */
        .notebook {
          position: absolute;
          top: 150px;
          right: 50px;
          width: 140px;
          height: 180px;
          background: linear-gradient(145deg, #f7fafc, #edf2f7);
          border-radius: 4px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          transform: rotate(-5deg);
          z-index: 3;
        }

        .notebook-spiral {
          position: absolute;
          top: 0;
          left: 10px;
          width: 8px;
          height: 100%;
          background: repeating-linear-gradient(
            to bottom,
            #cbd5e0 0px,
            #cbd5e0 8px,
            transparent 8px,
            transparent 16px
          );
        }

        .notebook-lines {
          margin: 30px 30px 30px 35px;
        }

        .line {
          height: 2px;
          background: #e2e8f0;
          margin-bottom: 15px;
        }

        /* Plant */
        .plant {
          position: absolute;
          bottom: 50px;
          right: 100px;
          z-index: 8;
        }

        .pot {
          width: 60px;
          height: 50px;
          background: linear-gradient(145deg, #fc8181, #f56565);
          border-radius: 0 0 8px 8px;
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
        }

        .leaf {
          position: absolute;
          width: 30px;
          height: 45px;
          background: linear-gradient(145deg, #48bb78, #38a169);
          border-radius: 0 50% 50% 0;
          transform-origin: bottom left;
        }

        .leaf-1 {
          bottom: 50px;
          left: 15px;
          transform: rotate(-30deg);
          animation: sway 3s ease-in-out infinite;
        }

        .leaf-2 {
          bottom: 50px;
          left: 25px;
          transform: rotate(10deg);
          animation: sway 3s ease-in-out infinite 0.5s;
        }

        .leaf-3 {
          bottom: 50px;
          left: 5px;
          transform: rotate(-60deg);
          animation: sway 3s ease-in-out infinite 1s;
        }

        @keyframes sway {
          0%, 100% { transform: rotate(var(--rotation, 0deg)); }
          50% { transform: rotate(calc(var(--rotation, 0deg) + 10deg)); }
        }

        .landing-text {
          text-align: center;
          max-width: 600px;
        }

        .landing-text h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .landing-text p {
          font-size: 20px;
          line-height: 1.6;
          opacity: 0.95;
        }

        /* Right Side - Sign Up Form */
        .landing-right {
          flex: 0 0 500px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .signup-card {
          width: 100%;
          max-width: 420px;
        }

        .signup-card h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .signup-subtitle {
          color: #718096;
          margin-bottom: 30px;
          font-size: 15px;
        }

        .error-message {
          background: #fff5f5;
          color: #c53030;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          border: 1px solid #feb2b2;
        }

        .signup-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s;
          outline: none;
        }

        .form-group input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .signup-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .signup-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .signup-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .divider {
          text-align: center;
          margin: 25px 0;
          position: relative;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 45%;
          height: 1px;
          background: #e2e8f0;
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .divider span {
          background: white;
          padding: 0 15px;
          color: #718096;
          font-size: 14px;
        }

        .github-button {
          width: 100%;
          padding: 12px;
          background: #24292e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s;
        }

        .github-button:hover {
          background: #1a1e22;
        }

        .login-link {
          text-align: center;
          margin-top: 25px;
          color: #718096;
          font-size: 14px;
        }

        .link-button {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          font-size: 14px;
          text-decoration: underline;
        }

        .link-button:hover {
          color: #5a67d8;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .landing-container {
            flex-direction: column;
          }

          .landing-left {
            padding: 40px 20px;
          }

          .illustration {
            transform: scale(0.7);
          }

          .landing-text h1 {
            font-size: 36px;
          }

          .landing-text p {
            font-size: 18px;
          }

          .landing-right {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
