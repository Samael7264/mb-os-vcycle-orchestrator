import React, { useEffect, useMemo, useState } from 'react';
import { Activity, FileText, History, Sparkles, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CopilotTool } from '../CopilotTool';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { name: 'Dashboard', path: '/', icon: Activity },
      { name: 'Summary', path: '/summary', icon: FileText },
      { name: 'History', path: '/history', icon: History },
    ],
    []
  );

  useEffect(() => {
    if (!isCopilotOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCopilotOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCopilotOpen]);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-950">
      <a
        href="#main-content"
        className="focus-ring absolute left-4 top-4 z-[60] -translate-y-20 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="app-grid absolute inset-0 opacity-70" />
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(177,31,41,0.2),_transparent_72%)] blur-2xl" />
        <div className="absolute right-[-8rem] top-[-2rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(35,50,69,0.22),_transparent_70%)] blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <header className="px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.875rem,env(safe-area-inset-top))]">
          <nav className="panel-surface mx-auto flex w-full max-w-[1500px] flex-col gap-3 rounded-[28px] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                to="/"
                className="focus-ring flex min-w-0 items-center gap-3 rounded-2xl px-1 py-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#12161d,#283649)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                  <span className="font-display text-lg font-bold tracking-[0.22em]">MB</span>
                </div>
                <div className="min-w-0">
                  <div className="font-display text-lg font-bold tracking-tight text-slate-950">
                    V-Cycle Control Tower
                  </div>
                  <p className="truncate text-xs font-medium text-slate-500">
                    Mercedes validation workflows, orchestrated end to end.
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
              <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`focus-ring inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-slate-950 text-white shadow-[0_14px_30px_rgba(17,19,24,0.18)]'
                          : 'bg-white/70 text-slate-600 hover:bg-white hover:text-slate-950'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="hidden rounded-full border border-white/70 bg-white/70 px-4 py-2 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:block">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Session
                  </div>
                  <div className="text-sm font-semibold text-slate-900">Control Room Beta</div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCopilotOpen(true)}
                  aria-label="Open MB.OS Copilot"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b11f29,#d54a43)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_16px_32px_rgba(177,31,41,0.28)] transition-colors hover:bg-[linear-gradient(135deg,#981822,#c63c35)]"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Open Copilot
                </button>

                <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <img
                    src="https://ui-avatars.com/api/?name=Jane+Engineer&background=233245&color=fff"
                    alt="Jane Engineer"
                    width="36"
                    height="36"
                    fetchPriority="high"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="hidden pr-2 sm:block">
                    <div className="text-sm font-semibold text-slate-900">Jane Engineer</div>
                    <div className="text-xs text-slate-500">Systems Validation Lead</div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main
          id="main-content"
          className="relative flex-1 overflow-y-auto px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 pb-8 pt-4">
            {children}
          </div>
        </main>
      </div>

      <aside
        aria-hidden={!isCopilotOpen}
        aria-label="MB.OS Copilot"
        className={`panel-surface-dark fixed bottom-24 right-4 z-50 flex h-[min(74vh,680px)] w-[min(392px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[26px] text-white transition-[opacity,transform] duration-300 sm:right-6 ${
          isCopilotOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              MB.OS Agent
            </div>
            <div className="mt-1 font-display text-lg font-bold text-white">Copilot Console</div>
          </div>
          <button
            type="button"
            onClick={() => setIsCopilotOpen(false)}
            aria-label="Close MB.OS Copilot"
            className="focus-ring rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden bg-white text-slate-950">
          <CopilotTool />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setIsCopilotOpen((open) => !open)}
        aria-label={isCopilotOpen ? 'Close MB.OS Copilot' : 'Open MB.OS Copilot'}
        className={`focus-ring fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_24px_44px_rgba(17,19,24,0.28)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 sm:bottom-6 sm:right-6 ${
          isCopilotOpen
            ? 'bg-slate-900 hover:bg-black'
            : 'bg-[linear-gradient(135deg,#b11f29,#d54a43)] hover:bg-[linear-gradient(135deg,#981822,#c63c35)]'
        }`}
      >
        {isCopilotOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Sparkles className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  );
};
