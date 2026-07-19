import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Moon, 
  Sun, 
  MessageCircle, 
  Phone, 
  Video, 
  MessageSquare, 
  ArrowUpRight,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Calculator,
  ChevronRight
} from 'lucide-react';

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6c-1.7 0-3.1-1.4-3.1-3.1V7.1z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    { name: 'Shariah Screener', path: '/shariah-screener', active: true, icon: ShieldCheck, isNew: true, desc: 'PSX Shariah Compliance Screener' },
    { name: 'SIP Calculator', path: '/sip-calculator', active: true, icon: TrendingUp, isNew: false, desc: 'Calculate investment returns' },
    { name: 'CAGR Calculator', path: '/cagr-calculator', active: true, icon: PieChart, isNew: false, desc: 'Compound annual growth rate' },
    { name: 'KSE-100 Index', path: '#', active: false, icon: Calculator, isNew: false, desc: 'Market overview' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper-1)] text-[var(--color-text)]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-paper-1)]/80 backdrop-blur-xl border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[var(--color-text)] transition-colors flex items-center gap-2 group"
              aria-label="Open Sidebar Navigation"
              title="Open Mobile Navigation Menu"
            >
              <Menu className="w-5 h-5 text-[var(--color-accent-base)] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]">
                Menu
              </span>
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="Shariah Capital Logo" 
                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-border-subtle)] shadow-sm group-hover:border-[var(--color-accent-base)] transition-hallmark"
              />
              <div className="flex flex-col justify-center">
                <span className="text-lg sm:text-xl font-display font-medium tracking-tight group-hover:text-[var(--color-accent-base)] transition-hallmark leading-none">
                  Shariah Capital
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm ml-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.active ? link.path : '#'}
                  className={`relative flex items-center gap-1.5 font-medium transition-hallmark ${
                    location.pathname === link.path 
                      ? 'text-[var(--color-accent-base)]' 
                      : link.active 
                        ? 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]' 
                        : 'text-[var(--color-text-muted)]/50 cursor-not-allowed'
                  }`}
                >
                  {link.name === 'Shariah Screener' && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  )}
                  {link.name}
                  {link.isNew && (
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                  {!link.active && (
                    <span className="text-[10px] uppercase tracking-wider bg-black/5 dark:bg-white/5 text-[var(--color-text-muted)] px-1.5 py-0.5 rounded font-mono">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/shariah-screener"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Shariah Screener</span>
            </Link>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-hallmark"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input 
                type="text" 
                placeholder="Search symbol (e.g., OGDC)..." 
                className="bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-full pl-9 pr-4 py-1.5 text-sm w-56 focus:outline-none focus:border-[var(--color-accent-base)]/50 transition-hallmark placeholder:text-[var(--color-text-muted)]/50 text-[var(--color-text)]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar Content Panel */}
          <aside className="relative w-full max-w-xs sm:max-w-sm bg-[var(--color-paper-1)] border-r border-[var(--color-border-subtle)] shadow-2xl flex flex-col z-10 h-full overflow-y-auto">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-paper-2)]/50">
              <Link 
                to="/" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 group"
              >
                <img 
                  src="/logo.png" 
                  alt="Shariah Capital Logo" 
                  className="w-9 h-9 rounded-full object-cover border border-[var(--color-border-subtle)]"
                />
                <div>
                  <h3 className="font-display font-medium text-base text-[var(--color-text)] leading-none">
                    Shariah Capital
                  </h3>
                  <span className="text-[11px] text-[var(--color-text-muted)]">PSX Analytics Platform</span>
                </div>
              </Link>
              
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Main Links */}
            <div className="p-4 flex-1 space-y-6">
              <div>
                <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-3 mb-3">
                  Main Navigation
                </div>

                <div className="space-y-1.5">
                  {/* Shariah Screener Featured Link */}
                  <Link
                    to="/shariah-screener"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      location.pathname === '/shariah-screener'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-[var(--color-text)]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-emerald-400">
                          Shariah Screener
                        </span>
                        <span className="bg-emerald-500 text-black text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                          New
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        KMI All Shares Shariah Screening 2026
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-500/60 self-center" />
                  </Link>

                  {/* SIP Calculator Link */}
                  <Link
                    to="/sip-calculator"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                      location.pathname === '/sip-calculator'
                        ? 'bg-[var(--color-accent-base)]/10 border border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                        : 'hover:bg-[var(--color-paper-2)] border border-transparent text-[var(--color-text)]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-[var(--color-paper-2)] text-[var(--color-accent-base)] mt-0.5">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">SIP Calculator</div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        Plan systematic investment returns
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] self-center" />
                  </Link>

                  {/* CAGR Calculator Link */}
                  <Link
                    to="/cagr-calculator"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                      location.pathname === '/cagr-calculator'
                        ? 'bg-[var(--color-accent-base)]/10 border border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                        : 'hover:bg-[var(--color-paper-2)] border border-transparent text-[var(--color-text)]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-[var(--color-paper-2)] text-[var(--color-accent-base)] mt-0.5">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">CAGR Calculator</div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        Calculate annual growth rate
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] self-center" />
                  </Link>

                  {/* KSE-100 Index Link */}
                  <div className="flex items-start gap-3 p-3 rounded-xl opacity-60 cursor-not-allowed">
                    <div className="p-2 rounded-lg bg-[var(--color-paper-2)] text-[var(--color-text-muted)] mt-0.5">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">KSE-100 Index</span>
                        <span className="text-[9px] uppercase tracking-wider bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">
                          Soon
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        Market performance & insights
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community & Contact Section inside Sidebar */}
              <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-3 mb-3">
                  Connect & Socials
                </div>

                <div className="space-y-2">
                  <a 
                    href="https://whatsapp.com/channel/0029Vb4dCWbJ93wPlhyt8K2H" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-paper-2)] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    <span>WhatsApp Community</span>
                  </a>
                  <a 
                    href="https://youtube.com/@tradinginsightswithwadeed?si=AeGBBD7gCcPZWlCH" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-paper-2)] transition-colors"
                  >
                    <YoutubeIcon className="w-4 h-4 text-red-500" />
                    <span>YouTube Channel</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/tradinginsightswithwadeedwajid?utm_source=qr&igsh=c3ppbGw5aWY1cHNm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-paper-2)] transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-500" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar Footer Controls */}
            <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-paper-2)]/40 flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-muted)]">Theme Preference</span>
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)] text-[var(--color-text)] hover:border-[var(--color-accent-base)] transition-colors"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] bg-gradient-to-b from-[var(--color-paper-1)] to-[var(--color-paper-2)] pt-16 pb-8 mt-auto relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent-base)]/20 to-transparent"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--color-accent-base)]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-1 sm:col-span-2 md:col-span-2">
              <Link to="/" className="text-xl font-display font-medium mb-4 flex items-center gap-3 group">
                <img 
                  src="/logo.png" 
                  alt="Shariah Capital Logo" 
                  className="w-8 h-8 rounded-full object-cover border border-[var(--color-border-subtle)] shadow-sm group-hover:border-[var(--color-accent-base)] transition-hallmark"
                />
                <span className="group-hover:text-[var(--color-accent-base)] transition-hallmark">Shariah Capital</span>
              </Link>
              <p className="text-[var(--color-text-muted)] text-sm max-w-sm leading-relaxed mb-6">
                A Pakistan Stock Exchange (PSX) investment analytics platform for retail investors. 
                Data-forward, credible, and precise tools to understand your portfolio's real performance.
              </p>
              
              <div className="flex items-center gap-3">
                <a href="https://youtube.com/@tradinginsightswithwadeed?si=AeGBBD7gCcPZWlCH" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-accent-base)] hover:text-white hover:border-[var(--color-accent-base)] transition-all duration-300 shadow-sm" aria-label="YouTube">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/tradinginsightswithwadeedwajid?utm_source=qr&igsh=c3ppbGw5aWY1cHNm" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-accent-base)] hover:text-white hover:border-[var(--color-accent-base)] transition-all duration-300 shadow-sm" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://tiktok.com/@tradinginsightwithwadeed" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-accent-base)] hover:text-white hover:border-[var(--color-accent-base)] transition-all duration-300 shadow-sm" aria-label="TikTok">
                  <Video className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/in/wadeed-wajid-624510296?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-accent-base)] hover:text-white hover:border-[var(--color-accent-base)] transition-all duration-300 shadow-sm" aria-label="LinkedIn">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-display text-sm mb-5 text-[var(--color-text)] font-medium tracking-wide">Tools</h4>
              <ul className="space-y-3.5 text-sm text-[var(--color-text-muted)]">
                <li><Link to="/sip-calculator" className="hover:text-[var(--color-accent-base)] transition-colors duration-200 flex items-center gap-1.5 group"><ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /> SIP Calculator</Link></li>
                <li><Link to="/cagr-calculator" className="hover:text-[var(--color-accent-base)] transition-colors duration-200 flex items-center gap-1.5 group"><ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /> CAGR Calculator</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display text-sm mb-5 text-[var(--color-text)] font-medium tracking-wide">Resources</h4>
              <ul className="space-y-3.5 text-sm text-[var(--color-text-muted)]">
                <li><span className="hover:text-[var(--color-accent-base)] transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group"><ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /> KSE-100 Market Data</span></li>
                <li><span className="hover:text-[var(--color-accent-base)] transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group"><ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /> Methodology</span></li>
                <li><span className="hover:text-[var(--color-accent-base)] transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group"><ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /> Contact</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display text-sm mb-5 text-[var(--color-text)] font-medium tracking-wide">Connect</h4>
              <ul className="space-y-3.5 text-sm text-[var(--color-text-muted)]">
                <li>
                  <a href="https://whatsapp.com/channel/0029Vb4dCWbJ93wPlhyt8K2H" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 hover:text-[var(--color-accent-base)] transition-colors duration-300">
                    <MessageCircle className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-base)] transition-colors duration-300" />
                    <span>WhatsApp</span>
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/jgQJPthkR" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 hover:text-[var(--color-accent-base)] transition-colors duration-300">
                    <MessageSquare className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-base)] transition-colors duration-300" />
                    <span>Discord</span>
                  </a>
                </li>
                <li>
                  <a href="tel:03126760750" className="group flex items-center gap-2.5 hover:text-[var(--color-accent-base)] transition-colors duration-300">
                    <Phone className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-base)] transition-colors duration-300" />
                    <span>Phone: 0312-6760750</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <p className="font-medium tracking-wide">Â© {new Date().getFullYear()} Shariah Capital. All rights reserved.</p>
            <p className="max-w-2xl text-left md:text-right leading-relaxed opacity-80">
              Disclaimer: The data and calculations provided by Shariah Capital are for informational purposes only 
              and do not constitute financial or investment advice. Always consult with a qualified financial advisor 
              before making investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
