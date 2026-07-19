import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, PieChart, TrendingUp, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';

const dummyKSEData = [
  { value: 80234 }, { value: 80560 }, { value: 80100 }, { value: 81200 },
  { value: 81500 }, { value: 81100 }, { value: 81900 }, { value: 82450 },
  { value: 82100 }, { value: 83050 }, { value: 82800 }, { value: 83456 }
];

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Marquee Hero Section */}
      <section className="relative pt-28 pb-24 md:pt-36 md:pb-32 px-4 text-center overflow-hidden border-b border-[var(--color-border-subtle)]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Financial Abstract" 
            className="w-full h-full object-cover object-center opacity-10 dark:opacity-40 mix-blend-multiply dark:mix-blend-normal"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-paper-1)]/60 via-[var(--color-paper-1)]/90 to-[var(--color-paper-1)]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Top Pill Banner for Shariah Screener */}
          <Link 
            to="/shariah-screener" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 transition-all text-xs sm:text-sm font-medium mb-6 group cursor-pointer shadow-lg shadow-emerald-950/10"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>PSX Shariah Screener (500+ Listed Companies)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-500" />
          </Link>

          <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-[1.1] mb-6">
            See What Your PSX Investment Is <span className="text-gradient-accent">Really Worth</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Most trackers only show price action. We factor in <strong className="text-[var(--color-text)] font-semibold">dividends</strong>, <strong className="text-[var(--color-text)] font-semibold">bonus shares</strong>, and <strong className="text-[var(--color-text)] font-semibold">Shariah compliance status</strong> to reveal your true investment potential.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-3.5 max-w-md mx-auto w-full">
            {/* Shariah Screener Button placed directly above Plan Your SIP */}
            <Link 
              to="/shariah-screener" 
              className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-900/25 hover:shadow-emerald-600/40 transition-all duration-300 transform hover:-translate-y-0.5 border border-emerald-400/30 group"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-100 group-hover:scale-110 transition-transform" />
              <span className="text-base font-semibold tracking-wide">PSX Shariah Screener</span>
              <span className="bg-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ml-1 backdrop-blur-sm">
                New
              </span>
            </Link>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <Link 
                to="/sip-calculator" 
                className="bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-hover)] text-[var(--color-navy)] font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-hallmark w-full sm:w-1/2 justify-center shadow-md"
              >
                Plan Your SIP
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/cagr-calculator" 
                className="bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] text-[var(--color-text)] font-medium px-6 py-3.5 rounded-xl transition-hallmark border border-[var(--color-border-subtle)] w-full sm:w-1/2 justify-center flex items-center gap-2 shadow-sm"
              >
                CAGR Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KSE-100 Mini Chart Card & Trust Bar */}
      <section className="px-4 pb-20 max-w-5xl mx-auto w-full">
        <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-end justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">KSE-100 Index</h3>
                <div className="text-3xl font-display font-medium fin-number">
                  83,456.20
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 text-[var(--color-accent-base)] bg-[var(--color-accent-base)]/10 px-2 py-1 rounded text-sm font-medium">
                  <TrendingUp className="w-3 h-3" />
                  +1.24%
                </div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">Today</div>
              </div>
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyKSEData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-base)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-base)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <YAxis domain={['dataMin - 300', 'dataMax + 300']} hide />
                  <Area type="monotone" dataKey="value" stroke="var(--color-accent-base)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-24 bg-black/10 dark:bg-white/10" />
          
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[200px]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-accent-base)]" />
              <span className="text-sm font-medium">500+ PSX companies</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-accent-base)]" />
              <span className="text-sm font-medium">20+ years history</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-accent-base)]" />
              <span className="text-sm font-medium">Updated daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[var(--color-paper-3)] border-y border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-display font-semibold mb-16 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-black/10 dark:bg-white/10" />
            
            {[
              { step: '01', title: 'Pick a stock & year', desc: 'Select any PSX listed company and the year you theoretically invested.' },
              { step: '02', title: 'We factor it all', desc: 'Our engine computes price appreciation, plus all cash dividends and bonus shares.' },
              { step: '03', title: 'See real returns', desc: 'Get your absolute return, total portfolio value, and CAGR instantly.' }
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] flex items-center justify-center font-mono text-[var(--color-accent-base)] font-bold text-lg mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-display font-semibold mb-4 text-center text-gradient">Platform Capabilities</h2>
        <p className="text-[var(--color-text-muted)] text-center mb-16 max-w-2xl mx-auto">
          Everything you need to analyze historical performance and plan future investments in the Pakistan Stock Exchange.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/sip-calculator" className="glass-card p-8 group hover:border-[var(--color-accent-base)]/30 transition-hallmark relative overflow-hidden flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-base)]/10 text-[var(--color-accent-base)] flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium mb-3 group-hover:text-[var(--color-accent-base)] transition-hallmark">SIP Calculator</h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-8 flex-1">
              Project future wealth by simulating systematic investment plans (cost-averaging) with compound growth.
            </p>
            <div className="text-[var(--color-accent-base)] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Open Tool <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/cagr-calculator" className="glass-card p-8 group hover:border-[var(--color-accent-base)]/30 transition-hallmark relative overflow-hidden flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-base)]/10 text-[var(--color-accent-base)] flex items-center justify-center mb-6">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium mb-3 group-hover:text-[var(--color-accent-base)] transition-hallmark">CAGR Calculator</h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-8 flex-1">
              Compute the Compound Annual Growth Rate for different timeframes and asset classes.
            </p>
            <div className="text-[var(--color-accent-base)] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Open Tool <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
          
          <Link to="/shariah-screener" className="glass-card p-8 group hover:border-emerald-500/40 transition-hallmark relative overflow-hidden flex flex-col h-full bg-emerald-500/5">
            <div className="absolute top-8 right-8 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full">
              New Feature
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium mb-3 group-hover:text-emerald-400 transition-hallmark">PSX Shariah Screener</h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-8 flex-1">
              Filter and screen 500+ PSX listed companies by KMI Shariah compliance, debt ratios, illiquid assets, and track recent screening status changes.
            </p>
            <div className="text-emerald-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Explore Shariah Screener <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
          
          <div className="glass-card p-8 relative overflow-hidden flex flex-col h-full opacity-70">
            <div className="absolute top-8 right-8 bg-white/10 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded">
              Coming Soon
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 text-white/50 flex items-center justify-center mb-6">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium mb-3">KSE-100 Advanced Charts</h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-8 flex-1">
              Deep dive into historical index performance, sector rotation, and macro trends.
            </p>
            <div className="text-[var(--color-text-muted)]/50 text-sm font-medium">
              Unavailable
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
