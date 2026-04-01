import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { SanctuaryBackground } from '../components/SanctuaryBackground';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Login failed');
        return;
      }
      sessionStorage.setItem('user', JSON.stringify({ id: data.user_id, username: data.username }));
      navigate('/dashboard');
    } catch (err) {
      setError('Network error connecting to the server');
    }
  };

  return (
    <div className="relative w-full min-h-screen flex bg-[#05070A] text-white overflow-hidden font-sans">

      {/* Code-Generated Dynamic Background */}
      <SanctuaryBackground />

      {/* Login Card Container */}
      <div className="relative w-full h-full z-10 flex items-center justify-center px-6 py-12">

        {/* Login Card */}
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
              <h1 className="text-white tracking-[0.2em] font-bold text-[40px] mx-[0px] mt-[0px] mb-[-3px]" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                Log In
              </h1>
              <p className="text-sm text-cyan-300/70 font-light tracking-wide">
                Your AI Sanctuary
              </p>
            </div>

            {/* Spacing */}


            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              {/* Username Field */}
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#06B6D4';
                    e.target.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
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
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#06B6D4';
                    e.target.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button type="button" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Liquid-Glass Sign In Button */}
              <button
                type="submit"
                className="w-full py-3.5 text-white font-medium tracking-wider transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
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
                  e.currentTarget.style.background = 'rgba(14, 165, 233, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.boxShadow = `
                    0px 0px 0.5px 2px rgba(0, 0, 0, 0.68),
                    inset 0px 1px 1px rgba(255, 255, 255, 0.35),
                    inset 0px -1px 1px rgba(0, 0, 0, 0.2)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.boxShadow = `
                    0px 0px 0.5px 1.5px rgba(0, 0, 0, 0.68),
                    inset 0px 1px 1px rgba(255, 255, 255, 0.25),
                    inset 0px -1px 1px rgba(0, 0, 0, 0.2)
                  `;
                }}
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6 relative z-10">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-4 text-xs text-white/40">or</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center relative z-10">
              <p className="text-sm text-white/50">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};