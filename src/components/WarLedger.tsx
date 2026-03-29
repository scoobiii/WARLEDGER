import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WARLEDGER_DATA, Counter, TimelineItem, DamageItem, Correction, Position } from '../data/damage';
import { Github, ExternalLink, AlertTriangle, CheckCircle, Info, Menu, X, ChevronDown } from 'lucide-react';

const fmt = (n: number, unit = '') => {
  if (typeof n !== 'number') return n;
  if (Math.abs(n) >= 1e12) return unit + (n / 1e12).toFixed(1) + 'T';
  if (Math.abs(n) >= 1e9)  return unit + (n / 1e9).toFixed(1) + 'B';
  if (Math.abs(n) >= 1e6)  return unit + (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3)  return unit + Math.round(n).toLocaleString();
  return unit + n.toFixed(n % 1 === 0 ? 0 : 1);
};

const fmtFull = (n: number) => {
  return Math.round(n).toLocaleString();
};

const actorLabels: Record<string, string> = {
  trump: 'TRUMP', netanyahu: 'NETANYAHU', israel: 'ISRAEL',
  iran: 'IRAN', iran_proxy: 'IRAN PROXY', hamas: 'HAMAS',
  gcc: 'GCC', market: 'MARKET', unsc: 'UNSC', ongoing: 'ONGOING'
};

const actorClasses: Record<string, string> = {
  trump: 'bg-red-500/15 text-red-500 border border-red-500/30',
  israel: 'bg-orange-500/15 text-orange-500 border border-orange-500/30',
  iran: 'bg-teal-500/15 text-teal-500 border border-teal-500/30',
  iran_proxy: 'bg-teal-500/8 text-teal-500 border border-teal-500/20',
  gcc: 'bg-blue-500/15 text-blue-500 border border-blue-500/30',
  hamas: 'bg-purple-500/15 text-purple-500 border border-purple-500/30',
  market: 'bg-accent/10 text-accent border border-accent/20',
  unsc: 'bg-ink-tertiary/15 text-ink-secondary border border-border',
  ongoing: 'bg-accent-danger/20 text-accent-danger border border-accent-danger/40'
};

export default function WarLedger() {
  const [counters, setCounters] = useState(WARLEDGER_DATA.counters);
  const [activeDamageTab, setActiveDamageTab] = useState('humanitarian');
  const [correctionFilter, setCorrectionFilter] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          next[key] = {
            ...next[key],
            value: next[key].value + next[key].rate / 10
          };
        });
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const filteredCorrections = useMemo(() => {
    if (correctionFilter === 'all') return WARLEDGER_DATA.corrections;
    return WARLEDGER_DATA.corrections.filter(c => c.category === correctionFilter);
  }, [correctionFilter]);

  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-accent selection:text-bg">
      <div className="noise" />
      
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14 bg-bg/95 border-b border-border backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-lg">⬛</span>
          <span className="font-display text-lg font-extrabold tracking-tighter">
            WAR<span className="text-accent">LEDGER</span>
          </span>
          <span className="hidden sm:inline-block font-mono text-[9px] font-bold tracking-widest text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-sm">
            OPEN SOURCE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {['Damage', 'Timeline', 'Corrections', 'Positions'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="font-mono text-[11px] font-bold tracking-wider text-ink-secondary hover:text-ink hover:bg-bg-tertiary px-3 py-1.5 rounded-sm transition-colors"
            >
              {item}
            </a>
          ))}
          <a 
            href="https://github.com/warledger/warledger" 
            target="_blank" 
            className="font-mono text-[11px] font-bold tracking-wider text-accent border border-accent/30 hover:bg-accent/10 px-3 py-1.5 rounded-sm transition-colors ml-2"
          >
            GitHub ↗
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-10 py-20 border-b border-border overflow-hidden">
        <div className="absolute top-0 right-0 w-3/5 h-full bg-[radial-gradient(ellipse_at_80%_50%,rgba(200,255,0,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] font-bold tracking-[0.15em] text-ink-tertiary mb-8"
        >
          ACCOUNTABILITY DASHBOARD — MIDDLE EAST CONFLICT 2023–2026
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-[clamp(60px,12vw,140px)] font-extrabold leading-[0.9] tracking-tighter mb-8"
        >
          THE COST<br />OF <span className="accent-stroke">POWER</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base md:text-lg font-light text-ink-secondary max-w-[560px] leading-relaxed mb-8"
        >
          Open-source ledger tracking human, economic and geopolitical damage caused by the Trump-Netanyahu war policy — and the corrections needed to fix it.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-ink-tertiary"
        >
          <div className="flex items-center gap-2">
            <span className="live-dot w-2 h-2 bg-accent-danger rounded-full" />
            <span>LIVE DATA — Updated {WARLEDGER_DATA.meta.lastUpdate}</span>
          </div>
          <span className="hidden md:inline text-border-secondary">|</span>
          <span>Open data. No ads. No government funding.</span>
        </motion.div>
        
        <div className="absolute bottom-10 left-6 md:left-10 font-mono text-[10px] text-ink-tertiary tracking-widest scroll-hint-anim">
          scroll ↓
        </div>
      </section>

      {/* COUNTERS */}
      <section id="counters" className="px-6 md:px-10 py-20 border-b border-border">
        <div className="flex items-center gap-4 mb-10 font-mono text-[10px] font-bold tracking-[0.15em] text-ink-tertiary">
          REAL-TIME COUNTERS
          <div className="flex-1 h-px bg-border" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {Object.entries(counters).map(([key, c]) => (
            <div key={key} className="bg-bg p-8 hover:bg-bg-secondary transition-colors">
              <div className="font-mono text-[10px] font-bold tracking-widest text-ink-tertiary uppercase mb-3">
                {c.label}
              </div>
              <div className="font-display text-4xl font-extrabold tracking-tighter text-accent tabular-nums mb-2">
                {c.unit}{fmtFull(c.value)}
              </div>
              <div className="font-mono text-[12px] text-ink-tertiary">
                +{c.rate > 0 ? fmt(c.rate * 3600, c.unit) : '0'} /hr est.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DAMAGE BREAKDOWN */}
      <section id="damage" className="px-6 md:px-10 py-20 border-b border-border">
        <div className="flex items-center gap-4 mb-10 font-mono text-[10px] font-bold tracking-[0.15em] text-ink-tertiary">
          DAMAGE BREAKDOWN
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex border border-border w-fit mb-8">
          {['humanitarian', 'economic', 'infrastructure'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveDamageTab(tab)}
              className={`font-mono text-[11px] font-bold tracking-wider px-6 py-2.5 uppercase transition-colors border-r border-border last:border-r-0 ${
                activeDamageTab === tab ? 'bg-accent text-bg' : 'text-ink-tertiary hover:bg-bg-tertiary hover:text-ink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="font-mono text-[10px] font-bold tracking-widest text-ink-tertiary uppercase text-left border-b border-border">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {WARLEDGER_DATA.damages[activeDamageTab].map((item, i) => (
                <tr key={i} className="border-b border-border hover:bg-bg-secondary transition-colors group">
                  <td className="px-4 py-4 text-ink-secondary group-hover:text-ink">{item.category}</td>
                  <td className="px-4 py-4 font-mono font-bold text-accent-danger">
                    {fmt(item.value, item.unit.includes('USD') ? '$' : '')} 
                    <span className="text-[10px] font-normal opacity-60 ml-1">
                      {item.unit.replace('USD', '').replace('people', '').replace('structures', '').replace('hospitals', '').replace('schools', '').replace('facility', '').replace('bases', '').replace('airports', '').trim()}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-[10px] text-ink-tertiary">{item.source}</td>
                  <td className="px-4 py-4">
                    <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm border ${
                      item.verified 
                        ? 'bg-accent/10 text-accent border-accent/20' 
                        : 'bg-accent-danger/10 text-accent-danger border-accent-danger/20'
                    }`}>
                      {item.verified ? 'VERIFIED' : 'ESTIMATED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="px-6 md:px-10 py-20 border-b border-border">
        <div className="flex items-center gap-4 mb-10 font-mono text-[10px] font-bold tracking-[0.15em] text-ink-tertiary">
          CONFLICT TIMELINE
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="relative pl-8 border-l border-border">
          {[...WARLEDGER_DATA.timeline].reverse().map((item, i) => (
            <div key={i} className="relative grid grid-cols-[100px_1fr] gap-6 py-5 pl-8 border-b border-border hover:bg-white/[0.02] transition-colors group">
              <div className={`absolute left-[-5px] top-7 w-[9px] h-[9px] rounded-full border-2 border-bg ${
                item.severity >= 5 ? 'bg-accent-danger' : item.severity >= 4 ? 'bg-accent-warning' : 'bg-accent-info'
              }`} />
              <div className="font-mono text-[11px] text-ink-tertiary pt-0.5">{item.date}</div>
              <div>
                <span className={`inline-block font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm mr-2 uppercase ${actorClasses[item.actor] || 'bg-bg-tertiary text-ink-tertiary border border-border'}`}>
                  {actorLabels[item.actor] || item.actor}
                </span>
                <span className="text-sm text-ink-secondary group-hover:text-ink">{item.event}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORRECTIONS */}
      <section id="corrections" className="px-6 md:px-10 py-20 border-b border-border">
        <div className="flex items-center gap-4 mb-6 font-mono text-[10px] font-bold tracking-[0.15em] text-ink-tertiary">
          CORRECTIONS & SOLUTIONS
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-sm text-ink-secondary max-w-xl mb-10">
          Concrete actions that could stop or reduce the damage — blocked by whom and at what cost.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {['all', 'humanitarian', 'economic', 'geopolitical', 'military', 'legal'].map((filter) => (
            <button
              key={filter}
              onClick={() => setCorrectionFilter(filter)}
              className={`font-mono text-[10px] font-bold tracking-wider px-4 py-1.5 uppercase border rounded-sm transition-all ${
                correctionFilter === filter ? 'bg-accent text-bg border-accent' : 'text-ink-tertiary border-border hover:border-border-secondary hover:text-ink'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {filteredCorrections.map((c) => (
            <div key={c.id} className="bg-bg p-7 hover:bg-bg-secondary transition-colors flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-mono text-[10px] text-ink-tertiary mb-1">{c.id} · {c.category.toUpperCase()}</div>
                  <div className="font-display text-lg font-bold tracking-tight text-ink">{c.title}</div>
                </div>
                <span className={`font-mono text-[9px] font-bold tracking-widest px-2 py-1 rounded-sm uppercase border whitespace-nowrap ${
                  c.status === 'blocked' ? 'bg-accent-danger/15 text-accent-danger border-accent-danger/30' :
                  c.status === 'proposed' ? 'bg-accent-info/10 text-accent-info border-accent-info/30' :
                  'bg-accent-warning/10 text-accent-warning border-accent-warning/30'
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="text-[13px] text-ink-secondary leading-relaxed">{c.description}</div>
              <div className="font-mono text-[11px] text-accent-danger flex items-center gap-2">
                <span>⛔</span> {c.blockedBy}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-tertiary border border-border p-3 rounded-sm">
                  <div className="font-mono text-[9px] text-ink-tertiary tracking-wider mb-1">COST TO IMPLEMENT</div>
                  <div className={`font-display text-lg font-bold ${c.costToImplement === 0 ? 'text-accent' : 'text-accent-danger'}`}>
                    {c.costToImplement === 0 ? 'ZERO' : fmt(c.costToImplement, '$')}
                  </div>
                </div>
                <div className="bg-bg-tertiary border border-border p-3 rounded-sm">
                  <div className="font-mono text-[9px] text-ink-tertiary tracking-wider mb-1">SAVING IF DONE</div>
                  <div className="font-display text-lg font-bold text-accent">
                    {c.savingIfImplemented === 0 ? 'MORAL' : fmt(c.savingIfImplemented, '$')}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.actors.map(a => (
                  <span key={a} className="font-mono text-[9px] px-2 py-0.5 bg-bg-tertiary border border-border rounded-sm text-ink-tertiary">
                    {a}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-2">
                <div className="h-[3px] bg-border rounded-full overflow-hidden mb-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.urgency >= 5 ? 'bg-accent-danger' : c.urgency >= 4 ? 'bg-accent-warning' : 'bg-accent-info'
                    }`}
                    style={{ width: `${c.urgency * 20}%` }}
                  />
                </div>
                <div className="font-mono text-[9px] text-ink-tertiary">
                  URGENCY: {c.urgency >= 5 ? 'CRITICAL' : c.urgency >= 4 ? 'HIGH' : 'MEDIUM'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POSITIONS */}
      <section id="positions" className="px-6 md:px-10 py-20 border-b border-border">
        <div className="flex items-center gap-4 mb-10 font-mono text-[10px] font-bold tracking-[0.15em] text-ink-tertiary">
          ACTOR POSITIONS
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {Object.entries(WARLEDGER_DATA.positions).map(([key, p]) => {
            const pct = ((p.score + 5) / 10) * 100;
            const scoreColor = p.score < 0 ? 'text-accent-danger' : p.score > 0 ? 'text-accent' : 'text-ink-tertiary';
            const barColor = p.score < 0 ? 'bg-accent-danger' : p.score > 0 ? 'bg-accent' : 'bg-ink-tertiary';

            return (
              <div key={key} className="bg-bg p-7 border-l-4 hover:bg-bg-secondary transition-colors" style={{ borderLeftColor: p.color }}>
                <div className="font-display text-lg font-bold mb-2" style={{ color: p.color }}>{p.label}</div>
                <div className="text-[13px] text-ink-secondary leading-relaxed mb-4">{p.stance}</div>
                <div className="font-mono text-[11px] text-ink-tertiary flex items-center gap-3">
                  <span className={scoreColor}>{p.score > 0 ? '+' : ''}{p.score}</span>
                  <div className="relative h-1 flex-1 bg-border rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 h-full rounded-full ${barColor}`}
                      style={{ 
                        left: p.score < 0 ? `${pct}%` : '50%',
                        width: `${Math.abs(p.score) * 10}%`,
                        transform: p.score < 0 ? 'translateX(-100%)' : 'none'
                      }}
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-tighter">
                    {p.score < -2 ? 'ESCALATORY' : p.score < 0 ? 'OBSTRUCTING' : p.score === 0 ? 'NEUTRAL' : p.score < 3 ? 'CONSTRUCTIVE' : 'DE-ESCALATORY'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTRIBUTE */}
      <section className="px-6 md:px-10 py-20">
        <div className="flex items-center gap-4 mb-10 font-mono text-[10px] font-bold tracking-[0.15em] text-ink-tertiary">
          CONTRIBUTE
          <div className="flex-1 h-px bg-border" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-start">
          <div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight mb-4">
              This project is open source.<br />Help us keep it accurate.
            </h2>
            <p className="text-ink-secondary mb-8 leading-relaxed">
              All data sourced from UN OCHA, WHO, World Bank, IATA, IMF, peer-reviewed researchers and investigative journalists. No government funding. No political affiliation.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/warledger/warledger" className="bg-accent text-bg font-mono text-xs font-bold tracking-wider px-6 py-3 rounded-sm hover:opacity-80 transition-opacity">
                GitHub Repository ↗
              </a>
              <a href="https://github.com/warledger/warledger/issues" className="border border-border-secondary text-ink font-mono text-xs font-bold tracking-wider px-6 py-3 rounded-sm hover:border-ink transition-colors">
                Report Data Error
              </a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { color: 'bg-accent', text: 'Data Sources: UN, WHO, World Bank, IATA, ICC, ACLED' },
              { color: 'bg-accent-info', text: 'License: MIT — free to fork, embed, translate' },
              { color: 'bg-accent-warning', text: 'Translations: AR, HE, FA, PT, ES, FR — PRs welcome' },
              { color: 'bg-accent-danger', text: 'API: JSON endpoint available — docs in /api' },
              { color: 'bg-ink-tertiary', text: 'Embed: <iframe> widget for news orgs — free' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-xs text-ink-secondary">
                <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-10 py-10 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display text-xl font-extrabold">WAR<span className="text-accent">LEDGER</span></div>
          <div className="flex gap-6">
            {['GitHub', 'Methodology', 'Sources', 'API'].map(link => (
              <a key={link} href="#" className="font-mono text-[11px] text-ink-tertiary hover:text-ink transition-colors">{link}</a>
            ))}
          </div>
          <div className="font-mono text-[10px] text-ink-tertiary text-center md:text-right">
            Data accuracy is our responsibility. Sources linked. Corrections welcome via PR.
          </div>
        </div>
      </footer>
    </div>
  );
}
