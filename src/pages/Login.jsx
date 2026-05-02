import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'anshpatel8780@gmail.com';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'verify', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const redirectUser = (userEmail) => {
    if (userEmail === ADMIN_EMAIL) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) redirectUser(session.user.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) redirectUser(session.user.email);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email first.');
        setMode('verify');
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else if (data?.session) {
      redirectUser(data.session.user.email);
    } else {
      setSuccess('Account created! Check your email for a verification code.');
      setMode('verify');
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Email verified! You can now log in.');
      setMode('login');
      setOtp('');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password reset link sent! Check your email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#050505] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#0a0a0a] border border-white/5 p-10 rounded-sm shadow-2xl">

        {/* Header */}
        <div>
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block text-center">
            Bhairavnath Jewellers
          </span>
          <h2 className="mt-2 text-center text-3xl font-serif text-white font-light">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'verify' && 'Verify Email'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="mt-4 text-center text-sm text-gray-400 font-light">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create a new account'}
            {mode === 'verify' && `Enter the 6-digit code sent to ${email}`}
            {mode === 'forgot' && 'Enter your email to receive a reset link'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-sm text-[11px] uppercase tracking-widest font-bold text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/20 border border-green-500/30 text-green-400 p-3 rounded-sm text-[11px] uppercase tracking-widest font-bold text-center">
            {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email" type="email" required
                  className="w-full px-4 py-3 bg-black/50 border border-gray-800 placeholder-gray-600 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm transition-colors"
                  placeholder="your@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest" htmlFor="password">
                    Password
                  </label>
                  <button type="button" onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }} className="text-[10px] uppercase tracking-widest text-gold hover:text-white transition-colors">
                    Forgot Password?
                  </button>
                </div>
                <input
                  id="password" type="password" required
                  className="w-full px-4 py-3 bg-black/50 border border-gray-800 placeholder-gray-600 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm transition-colors"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm text-black bg-gold hover:bg-gold-light hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] focus:outline-none transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => { setMode('signup'); setError(null); setSuccess(null); }} className="text-[11px] uppercase tracking-widest font-medium text-gray-500 hover:text-gold transition-colors">
                Don't have an account? Sign Up
              </button>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest" htmlFor="signup-email">
                  Email Address
                </label>
                <input
                  id="signup-email" type="email" required
                  className="w-full px-4 py-3 bg-black/50 border border-gray-800 placeholder-gray-600 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm transition-colors"
                  placeholder="your@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest" htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password" type="password" required
                  className="w-full px-4 py-3 bg-black/50 border border-gray-800 placeholder-gray-600 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm transition-colors"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm text-black bg-gold hover:bg-gold-light hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] focus:outline-none transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => { setMode('login'); setError(null); setSuccess(null); }} className="text-[11px] uppercase tracking-widest font-medium text-gray-500 hover:text-gold transition-colors">
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {/* VERIFY EMAIL FORM */}
        {mode === 'verify' && (
          <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest" htmlFor="otp">
                Verification Code
              </label>
              <input
                id="otp" type="text" required maxLength={8}
                className="w-full px-4 py-3 bg-black/50 border border-gray-800 placeholder-gray-600 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-lg text-center tracking-[0.5em] transition-colors"
                placeholder="••••••••"
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            <button
              type="submit" disabled={loading || otp.length < 6}
              className="w-full flex justify-center py-3.5 px-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm text-black bg-gold hover:bg-gold-light hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] focus:outline-none transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="text-center space-y-3">
              <button type="button" onClick={handleSignup} disabled={loading} className="text-[11px] uppercase tracking-widest font-medium text-gray-500 hover:text-white transition-colors block w-full">
                Didn't receive a code? Resend
              </button>
              <button type="button" onClick={() => { setMode('login'); setError(null); }} className="text-[11px] uppercase tracking-widest font-medium text-gold hover:text-white transition-colors">
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest" htmlFor="forgot-email">
                Email Address
              </label>
              <input
                id="forgot-email" type="email" required
                className="w-full px-4 py-3 bg-black/50 border border-gray-800 placeholder-gray-600 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm transition-colors"
                placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm text-black bg-gold hover:bg-gold-light hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] focus:outline-none transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => { setMode('login'); setError(null); setSuccess(null); }} className="text-[11px] uppercase tracking-widest font-medium text-gold hover:text-white transition-colors">
                Back to Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
