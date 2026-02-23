import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import bgImage from '../../assets/32b5adc24d802aa47887feab8f75626ce1822581.png';
import logoImage from '../../assets/2dc092ee03f319cd3f20c442aee8da480f076515.png';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Login failed');
      }

      // const data = await response.json();
      // On success
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex bg-black text-white overflow-hidden font-sans">

      {/* Spline 3D Animation Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <iframe
          src="https://my.spline.design/blackabstractart-LSnH96VuAI86os4UR4GXW6dG/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="w-full h-full"
        />
        {/* Hide Spline Watermark */}
        <style>{`
          iframe {
            pointer-events: none;
          }
          iframe body {
            overflow: hidden !important;
          }
        `}</style>
        <div className="absolute bottom-0 right-0 w-48 h-16 bg-black z-10"></div>
      </div>

      {/* Left Section - Glass Floating Elements (40-45%) */}
      <div className="hidden lg:flex lg:w-[42%] relative items-center justify-center z-10">

        {/* Environmental Radial Lights */}
        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute top-[45%] left-[60%] w-[250px] h-[250px]"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />


        </div>

        {/* Floating Logo with Glow */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Glow Background */}


          {/* Logo Image */}

        </div>

      </div>

      {/* Right Section - Login Card (55-60%) */}
      <div className="flex-1 lg:w-[58%] flex items-center justify-center px-6 py-12">

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
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center relative z-10">
                {error}
              </div>
            )}


            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
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
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
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