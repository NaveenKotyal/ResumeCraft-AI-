import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function Layout({ children, sidebar }: LayoutProps) {
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">💼</span>
            ResumeCraft AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">AI Career Copilot</p>
        </div>
        {sidebar}
        {isAuthenticated && (
          <div className="mt-auto p-4 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm truncate mb-2">{username}</p>
            <button
              onClick={logout}
              className="w-full text-sm py-2 px-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
