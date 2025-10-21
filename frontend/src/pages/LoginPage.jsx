import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const { login, register, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formState, setFormState] = useState({ email: '', password: '', username: '', displayName: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isSignUp) {
        await register(formState);
      } else {
        await login({ email: formState.email, password: formState.password });
      }
      navigate('/dashboard');
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="glass-card p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">{isSignUp ? 'Create account' : 'Sign in'}</h1>
        <p className="text-center text-sm text-white/60">
          {isSignUp ? 'Claim your guns-inspired handle in seconds.' : 'Return to your dashboard to manage your profile.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Username</label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 focus:border-gunspink focus:outline-none"
                  placeholder="swift"
                  value={formState.username}
                  onChange={(event) => setFormState({ ...formState, username: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Display name</label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 focus:border-gunspink focus:outline-none"
                  placeholder="Swift"
                  value={formState.displayName}
                  onChange={(event) => setFormState({ ...formState, displayName: event.target.value })}
                  required
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Email</label>
            <input
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 focus:border-gunspink focus:outline-none"
              placeholder="you@example.com"
              value={formState.email}
              onChange={(event) => setFormState({ ...formState, email: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60">Password</label>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 focus:border-gunspink focus:outline-none"
              placeholder="••••••••"
              value={formState.password}
              onChange={(event) => setFormState({ ...formState, password: event.target.value })}
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gunspink px-6 py-3 text-sm font-semibold shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <button className="w-full text-sm text-gunspink hover:text-pink-400" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign in' : "Need an account? Create one"}
        </button>
      </div>
      <div className="glass-card p-6 text-center text-sm text-white/60">
        <p>Or sign in with Discord to sync your server roles.</p>
        <button className="mt-4 rounded-full bg-[#5865F2] px-6 py-3 text-sm font-semibold hover:bg-[#4752c4]">
          Connect Discord
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
