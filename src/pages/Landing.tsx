import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, LineChart, PieChart, TrendingUp, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const dummyKSEData = [
  { value: 80234 }, { value: 80560 }, { value: 80100 }, { value: 81200 },
  { value: 81500 }, { value: 81100 }, { value: 81900 }, { value: 82450 },
  { value: 82100 }, { value: 83050 }, { value: 82800 }, { value: 83456 }
];

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Marquee Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 text-center overflow-hidden border-b border-[var(--color-border-subtle)]">
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
          <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-[1.1] mb-6">
            See What Your PSX Investment Is <span className="text-gradient-accent">Really Worth</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Most trackers only show price action. We factor in <strong className="text-[var(--color-text)] font-semibold">dividends</strong> and <strong className="text-[var(--color-text)] font-semibold">bonus shares</strong> to reveal your true historical return.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/sip-calculator" 
              className="bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-hover)] text-[var(--color-navy)] font-medium px-8 py-4 rounded-lg flex items-center gap-2 transition-hallmark w-full sm:w-auto justify-center"
            >
              Plan Your SIP
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="#" 
              className="bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] text-[var(--color-text)] font-medium px-8 py-4 rounded-lg transition-hallmark border border-[var(--color-border-subtle)] w-full sm:w-auto justify-center flex shadow-sm"
            >
              Explore KSE-100
            </Link>
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
                <AreaChart data={dummyKSEData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-base)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-base)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="var(--color-accent-base)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
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
          
          <div className="glass-card p-8 relative overflow-hidden flex flex-col h-full opacity-70">
            <div className="absolute top-8 right-8 bg-white/10 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded">
              Coming Soon
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 text-white/50 flex items-center justify-center mb-6">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium mb-3">Historical ROI Calculator</h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-8 flex-1">
              Calculate total returns including dividends and bonus issues for any PSX stock.
            </p>
            <div className="text-[var(--color-text-muted)]/50 text-sm font-medium">
              Unavailable
            </div>
          </div>
          
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
