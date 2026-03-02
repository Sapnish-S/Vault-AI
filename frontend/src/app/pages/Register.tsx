import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { SanctuaryBackground } from '../components/SanctuaryBackground';

const API_BASE = 'http://localhost:8000';

export const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          first_name: firstName,
          last_name: lastName,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Registration failed. Please try again.');
        return;
      }

      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/'), 1500);
    } catch {
      setError('Unable to connect to server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable inline style helpers
  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };
  const onFocusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#06B6D4';
    e.target.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
  };
  const onBlurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="relative w-full min-h-screen flex bg-black text-white overflow-hidden font-sans">

      {/* Code-Generated Dynamic Background */}
      <SanctuaryBackground />

      {/* Register Card Container */}
      <div className="relative w-full h-full z-10 flex items-center justify-center px-6 py-12">

        {/* Register Card */}
        <div className="relative w-full max-w-[450px]">

          {/* Glass Card Container */}
          <div
            className="relative rounded-[15px] p-12 overflow-hidden"
            style={{
              background: 'rgba(7, 8, 8, 0.3)',
              backgroundBlendMode: 'color-dodge',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: `
                inset 0px 0px 22px rgba(242, 242, 242, 0.5),
                inset 0px 0px 0px 1px rgba(153, 153, 153, 0.3),
                inset 2px 2px 1px -2px rgba(179, 179, 179, 0.2),
                inset -2px -2px 1px -2px rgba(179, 179, 179, 0.2),
                inset 3px 3px 0px -3px rgba(0, 0, 0, 0.5)
              `,
              backdropFilter: 'blur(5px)',
            }}
          >
            {/* Card Header */}
            <div className="text-center mb-8 relative z-10">
              <h1 className="text-white tracking-[0.2em] font-bold mb-2" style={{ fontFamily: "'Tiro Devanagari Hindi', serif", fontSize: '27px' }}>
                VAULT AI
              </h1>
              <p className="text-sm text-cyan-300/70 font-light tracking-wide">
                Your AI Sanctuary
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

              {/* Error Message */}
              {error && (
                <div
                  className="px-4 py-3 rounded-lg text-sm text-red-300 text-center"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div
                  className="px-4 py-3 rounded-lg text-sm text-green-300 text-center"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                  }}
                >
                  {success}
                </div>
              )}

              {/* First Name and Last Name - Side by Side */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-all"
                    style={inputStyle}
                    onFocus={onFocusStyle}
                    onBlur={onBlurStyle}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-all"
                    style={inputStyle}
                    onFocus={onFocusStyle}
                    onBlur={onBlurStyle}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={onFocusStyle}
                  onBlur={onBlurStyle}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={onFocusStyle}
                  onBlur={onBlurStyle}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-all pr-12"
                  style={inputStyle}
                  onFocus={onFocusStyle}
                  onBlur={onBlurStyle}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-all pr-12"
                  style={inputStyle}
                  onFocus={onFocusStyle}
                  onBlur={onBlurStyle}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-cyan-400"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-xs text-white/50 leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 text-white font-medium tracking-wider transition-all duration-300 hover:scale-[1.02] relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: `
                    0px 0px 0.5px 1.5px rgba(0, 0, 0, 0.68),
                    inset 0px 1px 1px rgba(255, 255, 255, 0.25),
                    inset 0px -1px 1px rgba(0, 0, 0, 0.2)
                  `,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = 'rgba(14, 165, 233, 0.25)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6 relative z-10">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-4 text-xs text-white/40">or</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Sign In Link */}
            <div className="text-center relative z-10">
              <p className="text-sm text-white/50">
                Already have an account?{' '}
                <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};