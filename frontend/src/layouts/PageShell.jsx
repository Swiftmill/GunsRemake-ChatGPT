import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/templates', label: 'Templates' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin', label: 'Admin' }
];

const PageShell = ({ children }) => {
  const { user, logout, loadProfile } = useAuth();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <div className="min-h-screen bg-[#06020f] text-white">
      <header className="sticky top-0 z-30 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide">
            <div className="size-10 rounded-2xl bg-gunspurple flex items-center justify-center shadow-glow">🔗</div>
            guns remake
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition hover:text-gunspink ${isActive ? 'text-gunspink' : 'text-white/70'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-white/60 hidden md:block">Hi, {user.displayName || user.username}</span>
                <button
                  onClick={logout}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-gunspink px-4 py-2 text-sm font-semibold hover:bg-pink-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-12">{children}</main>
      <footer className="border-t border-white/5 bg-black/40 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} guns remake. Inspired by guns.lol — built with React & Express.
      </footer>
    </div>
  );
};

export default PageShell;
