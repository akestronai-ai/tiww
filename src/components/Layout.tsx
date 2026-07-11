import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Moon, Sun } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const navLinks = [
    { name: 'SIP Calculator', path: '/sip-calculator', active: true },
    { name: 'CAGR Calculator', path: '/cagr-calculator', active: true },
    { name: 'KSE-100 Index', path: '#', active: false },
    { name: 'Compare Stocks', path: '#', active: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper-1)] text-[var(--color-text)]">
      {/* N1b SaaS Header Navigation */}
      <header className="sticky top-0 z-50 bg-[var(--color-paper-1)]/80 backdrop-blur-xl border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="Trading Insights Logo" 
                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-border-subtle)] shadow-sm group-hover:border-[var(--color-accent-base)] transition-hallmark"
              />
              <div className="flex flex-col justify-center">
                <span className="text-lg sm:text-xl font-display font-medium tracking-tight group-hover:text-[var(--color-accent-base)] transition-hallmark leading-none">
                  Trading Insights
                </span>
                <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] font-medium mt-1 group-hover:text-[var(--color-accent-base)]/80 transition-hallmark uppercase tracking-wider">
                  with Wadeed Wajid
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.active ? link.path : '#'}
                  className={`relative ${
                    location.pathname === link.path 
                      ? 'text-[var(--color-accent-base)]' 
                      : link.active 
                        ? 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-hallmark' 
                        : 'text-[var(--color-text-muted)]/50 cursor-not-allowed'
                  }`}
                >
                  {link.name}
                  {!link.active && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider bg-black/5 dark:bg-white/5 text-[var(--color-text-muted)] px-1.5 py-0.5 rounded font-mono">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-hallmark"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input 
                type="text" 
                placeholder="Search symbol (e.g., OGDC)..." 
                className="bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-full pl-9 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:border-[var(--color-accent-base)]/50 transition-hallmark placeholder:text-[var(--color-text-muted)]/50 text-[var(--color-text)]"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Ft2 Minimal Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-paper-1)] pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="text-lg font-display font-medium mb-4 block">
                Trading Insights with Wadeed Wajid
              </Link>
              <p className="text-[var(--color-text-muted)] text-sm max-w-sm leading-relaxed">
                A Pakistan Stock Exchange (PSX) investment analytics platform for retail investors. 
                Data-forward, credible, and precise tools to understand your portfolio's real performance.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm mb-4 text-[var(--color-text)]">Tools</h4>
              <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
                <li><Link to="/sip-calculator" className="hover:text-[var(--color-text)] transition-hallmark">SIP Calculator</Link></li>
                <li><Link to="/cagr-calculator" className="hover:text-[var(--color-text)] transition-hallmark">CAGR Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm mb-4 text-[var(--color-text)]">Resources</h4>
              <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
                <li><span className="hover:text-[var(--color-text)] transition-hallmark cursor-pointer">KSE-100 Market Data</span></li>
                <li><span className="hover:text-[var(--color-text)] transition-hallmark cursor-pointer">Methodology</span></li>
                <li><span className="hover:text-[var(--color-text)] transition-hallmark cursor-pointer">Contact</span></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <p>Â© {new Date().getFullYear()} Trading Insights. All rights reserved.</p>
            <p className="max-w-2xl text-left md:text-right">
              Disclaimer: The data and calculations provided by Trading Insights are for informational purposes only 
              and do not constitute financial or investment advice. Always consult with a qualified financial advisor 
              before making investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
