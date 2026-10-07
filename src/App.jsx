import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';
import AuthModal from './components/AuthModal';

const INITIAL_MARKETS = [
  { pair: 'EUR/USD', price: 1.0824, decimals: 4, type: 'Forex' },
  { pair: 'GBP/USD', price: 1.2741, decimals: 4, type: 'Forex' },
  { pair: 'XAU/USD', price: 2341.50, decimals: 2, type: 'Commodity' },
  { pair: 'BTC/USD', price: 68420, decimals: 0, type: 'Crypto' },
  { pair: 'NAS100', price: 19842, decimals: 0, type: 'Index' },
  { pair: 'USD/JPY', price: 154.82, decimals: 2, type: 'Forex' },
];

export default function App() {
  const [markets, setMarkets] = useState(INITIAL_MARKETS);
  const [basePrices] = useState(INITIAL_MARKETS.map(m => m.price));
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    const timer = setInterval(() => {
      setMarkets(prev =>
        prev.map(item => ({
          ...item,
          price: +(item.price * (1 + (Math.random() - 0.5) * 0.0006)).toFixed(item.decimals)
        }))
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const openAuth = (mode) => {
    setAuthView(mode);
    setAuthOpen(true);
  };

  return (
    <div>
      <header>
        <div className="wrap nav">
          <a href="#" className="logo">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <circle cx="13" cy="13" r="10" fill="none" stroke="var(--ac)" strokeWidth="2.2" strokeDasharray="52 12" strokeLinecap="round" />
              <circle cx="13" cy="13" r="2.6" fill="var(--ac)" />
            </svg>
            demoSite
          </a>
          <nav className="nav-links">
            <a href="#markets">Markets</a>
            <a href="#infrastructure">Infrastructure</a>
            <a href="#execution">Execution</a>
            <a href="#faq">Compliance</a>
          </nav>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" onClick={() => openAuth('login')}>Client Portal</button>
            <button className="btn pri" onClick={() => openAuth('signup')}>Create Account</button>
          </div>
        </div>
      </header>

      {/* Ticker Strip */}
      <div className="ticker">
        <div className="track">
          {[...markets, ...markets].map((m, idx) => {
            const base = basePrices[idx % markets.length];
            const change = (((m.price - base) / base) * 100);
            return (
              <span key={idx}>
                {m.pair} <b className={change >= 0 ? 'up' : 'dn'}>
                  {m.price.toFixed(m.decimals)} {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </b>
              </span>
            );
          })}
        </div>
      </div>

      <main className="wrap">
        {/* Hero Section */}
        <div className="hero">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1px solid var(--line)', borderRadius: 99, fontSize: 12, color: 'var(--mu)', marginBottom: 15 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ac)' }}></span> Institutional Liquidity &middot; Ultra-Low Latency
            </div>
            <h1>Precision Trading with <em>demoSite</em></h1>
            <p className="lead">
              Direct market access to multi-asset liquidity engines. Single margin balance across FX, precious metals, high-cap indices, and digital currencies.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn pri" onClick={() => openAuth('signup')}>Launch Terminal</button>
              <a className="btn" href="#markets">Specifications</a>
            </div>
          </div>

          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 10 }}>
              <span>Prime Watchlist</span>
              <span style={{ color: 'var(--ac)' }}>&bull; Live Interbank</span>
            </div>
            {markets.slice(0, 4).map((m, idx) => {
              const diff = (((m.price - basePrices[idx]) / basePrices[idx]) * 100);
              return (
                <div key={m.pair} className="wr">
                  <div>
                    <strong>{m.pair}</strong>
                    <div style={{ fontSize: 11, color: 'var(--mu)' }}>{m.type}</div>
                  </div>
                  <div style={{ height: 20 }}>
                    <svg width="60" height="20" viewBox="0 0 60 20">
                      <polyline
                        fill="none"
                        stroke={diff >= 0 ? 'var(--up)' : 'var(--dn)'}
                        strokeWidth="1.5"
                        points="0,15 15,10 30,12 45,6 60,8"
                      />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>{m.price.toFixed(m.decimals)}</div>
                    <div style={{ fontSize: 11 }} className={diff >= 0 ? 'up' : 'dn'}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Markets */}
        <section id="markets" style={{ padding: '60px 0' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 38 }}>Global Asset Coverage</h2>
          <p style={{ color: 'var(--mu)', marginTop: 8 }}>High depth of book from tier-1 liquidity providers without dealing desk intervention.</p>
          
          <div className="bento">
            <div className="tile w">
              <h4>Forex Majors & Minors</h4>
              <p>Tight pricing on 40+ currency pairs with deep interbank order matching.</p>
            </div>
            <div className="tile w">
              <h4>Global Stock Indices</h4>
              <p>Cash and index futures covering US30, NAS100, GER40, and UK100 with zero overnight premiums on select assets.</p>
            </div>
            <div className="tile">
              <h4>Commodities</h4>
              <p>Direct exposure to spot Gold, Silver, Brent, and WTI crude oils.</p>
            </div>
            <div className="tile">
              <h4>US Equities</h4>
              <p>Leveraged CFDs on major tech conglomerates and global blue-chip corporations.</p>
            </div>
            <div className="tile">
              <h4>Digital Assets</h4>
              <p>Secure derivatives pairing major crypto tokens with stable fiat currencies.</p>
            </div>
          </div>
        </section>

        {/* Why demoSite */}
        <section id="infrastructure" style={{ padding: '40px 0 80px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 38, marginBottom: 30 }}>Core Execution Architecture</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ border: '1px solid var(--line)', padding: 24, borderRadius: 16, background: 'var(--s)' }}>
              <Zap color="var(--ac)" size={28} />
              <h3 style={{ margin: '14px 0 8px', fontFamily: 'var(--serif)', fontSize: 22 }}>Sub-10ms Fill Rates</h3>
              <p style={{ color: 'var(--mu)', fontSize: 14 }}>Co-located servers in LD4 and NY4 data centers reduce execution latency and slippage on market orders.</p>
            </div>
            <div style={{ border: '1px solid var(--line)', padding: 24, borderRadius: 16, background: 'var(--s)' }}>
              <ShieldCheck color="var(--ac)" size={28} />
              <h3 style={{ margin: '14px 0 8px', fontFamily: 'var(--serif)', fontSize: 22 }}>Segregated Balances</h3>
              <p style={{ color: 'var(--mu)', fontSize: 14 }}>Retail and institutional capital remains completely isolated from operating reserves in top-tier banking facilities.</p>
            </div>
            <div style={{ border: '1px solid var(--line)', padding: 24, borderRadius: 16, background: 'var(--s)' }}>
              <Layers color="var(--ac)" size={28} />
              <h3 style={{ margin: '14px 0 8px', fontFamily: 'var(--serif)', fontSize: 22 }}>Zero Re-Quotes</h3>
              <p style={{ color: 'var(--mu)', fontSize: 14 }}>Pure ECN processing passes liquidity provider quotes straight through with transparent raw spreads.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid var(--line)', padding: '50px 0', background: '#050d0a' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="logo">demoSite</div>
            <p style={{ color: 'var(--mu)', fontSize: 13, marginTop: 6 }}>Institutional-grade trading infrastructure.</p>
          </div>
          <p style={{ color: 'var(--mu)', fontSize: 12 }}>
            &copy; {new Date().getFullYear()} demoSite. All rights reserved. Leveraged financial derivatives involve capital risk.
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={authOpen}
        initialView={authView}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
}