import React, { useState } from 'react';
import AppLayout from '../components/app/AppLayout';

export default function Account() {
  const [tab, setTab] = useState('billing');

  return (
    <AppLayout>
      <div style={{ background: '#f5f0ee', minHeight: '100%', fontFamily: '"DM Sans", sans-serif' }}>
        <div className="px-8 py-6">
          <h1 className="font-bold text-xl mb-5" style={{ color: '#222' }}>My Account</h1>

          {/* Tabs */}
          <div className="flex gap-0 mb-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            {['plans', 'billing', 'profile'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2.5 text-sm font-medium capitalize transition-all"
                style={{
                  color: tab === t ? '#ab00ff' : '#666',
                  borderBottom: tab === t ? '2px solid #ab00ff' : '2px solid transparent',
                  marginBottom: -1,
                  background: 'transparent',
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'billing' && (
            <div className="space-y-5 max-w-3xl">
              {/* Current plan */}
              <div className="rounded-xl p-6 flex items-center justify-between" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <div>
                  <h2 className="font-bold text-2xl mb-1" style={{ color: '#222' }}>Free Trial</h2>
                  <p className="text-sm" style={{ color: '#999' }}>Your plan will end on <strong style={{ color: '#333' }}>May 21, 2026</strong></p>
                </div>
                <button className="px-5 py-2.5 rounded text-white text-sm font-bold" style={{ background: '#111' }}>
                  UPGRADE PLAN
                </button>
              </div>

              {/* Billing Info */}
              <div className="rounded-xl p-6" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-base" style={{ color: '#222' }}>Billing Info</h3>
                  <button className="text-sm font-medium" style={{ color: '#ab00ff' }}>View Billing History</button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#999' }}>Billing Cycle</div>
                    <div className="font-semibold text-sm" style={{ color: '#222' }}>One Time</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#999' }}>Next Billing Amount</div>
                    <div className="font-semibold text-sm" style={{ color: '#222' }}>NA</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#999' }}>Outstanding Amount</div>
                    <div className="font-semibold text-sm" style={{ color: '#222' }}>—</div>
                  </div>
                </div>
              </div>

              {/* Render Credits */}
              <div className="rounded-xl p-6" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <h3 className="font-bold text-base mb-4" style={{ color: '#222' }}>Render Credits & Custom Models</h3>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 16 }}>
                  <div className="font-semibold text-sm mb-3" style={{ color: '#333' }}>Render Credits</div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-sm" style={{ color: '#22c55e' }}>Available</span>
                    <span className="font-semibold text-sm" style={{ color: '#222' }}>5</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <span className="text-sm" style={{ color: '#ab00ff' }}>Used</span>
                    <span className="font-semibold text-sm" style={{ color: '#222' }}>0</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <span className="text-sm" style={{ color: '#666' }}>Total</span>
                    <span className="font-semibold text-sm" style={{ color: '#222' }}>5</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'plans' && (
            <PlansTab />
          )}

          {tab === 'profile' && (
            <div className="max-w-lg rounded-xl p-6" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-bold text-base mb-5" style={{ color: '#222' }}>Profile Settings</h3>
              {[
                { label: 'Full Name', value: 'Designer Pro User' },
                { label: 'Email', value: 'user@designerpro.com' },
                { label: 'Company', value: '' },
                { label: 'Phone', value: '' },
              ].map(f => (
                <div key={f.label} className="mb-4">
                  <label className="block text-xs font-medium mb-1" style={{ color: '#666' }}>{f.label}</label>
                  <input
                    defaultValue={f.value}
                    className="w-full rounded px-3 py-2 text-sm outline-none"
                    style={{ border: '1px solid rgba(0,0,0,0.12)', background: '#f9f9f9', color: '#333' }}
                    placeholder={f.label}
                  />
                </div>
              ))}
              <button className="px-5 py-2.5 rounded text-white text-sm font-bold" style={{ background: '#ab00ff' }}>Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function PlansTab() {
  const [billing, setBilling] = useState('quarterly');

  const plans = [
    {
      name: 'BASIC',
      desc: 'Aspiring interior designers with a few projects or limited need',
      price: { quarterly: 400, yearly: 320 },
      features: ['25 renders / mo', 'Single User'],
      topFeatures: ['Full Foyr Catalog With AI Search', 'HD, 2K And 4K Renders'],
      featured: false,
    },
    {
      name: 'STANDARD',
      desc: 'Professional interior designers and creators with multiple projects',
      price: { quarterly: 520, yearly: 420 },
      features: ['90 renders / mo', 'Upto 2 Users'],
      topFeatures: ['4.5x render credits than Basic'],
      featured: true,
    },
    {
      name: 'PREMIUM',
      desc: 'Established interior designers scaling their business',
      price: { quarterly: 900, yearly: 720 },
      features: ['200 renders / mo', 'Upto 5 Users'],
      topFeatures: ['8x render credits than Basic', '12K Rendering'],
      featured: false,
    },
  ];

  return (
    <div>
      {/* Toggle */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.15)' }}>
          {['quarterly', 'yearly'].map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className="px-6 py-2 text-sm font-medium capitalize transition-all"
              style={{
                background: billing === b ? '#fff' : 'transparent',
                color: billing === b ? '#333' : '#888',
                border: billing === b ? '1px solid rgba(0,0,0,0.15)' : 'none',
                margin: -1,
              }}
            >
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm mb-8" style={{ color: '#666' }}>
        All plans come with <strong style={{ color: '#333' }}>unlimited projects</strong>, <strong style={{ color: '#333' }}>unlimited access to catalog</strong> and <strong style={{ color: '#ab00ff' }}>unlimited product uploads</strong>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
        {plans.map(plan => (
          <div
            key={plan.name}
            className="rounded-xl p-6"
            style={{
              background: plan.featured ? '#fff' : 'rgba(255,255,255,0.7)',
              border: plan.featured ? '2px solid #222' : '1px solid rgba(0,0,0,0.1)',
              boxShadow: plan.featured ? '0 4px 24px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            <div className="font-black text-base tracking-wider mb-2" style={{ color: '#222' }}>{plan.name}</div>
            <p className="text-xs mb-4" style={{ color: '#777', lineHeight: 1.5 }}>{plan.desc}</p>

            <div className="mb-1">
              <span className="font-black text-3xl" style={{ color: '#222' }}>₹{plan.price[billing]}</span>
              <span className="text-sm" style={{ color: '#666' }}>/mo</span>
            </div>
            <p className="text-xs mb-5" style={{ color: '#999' }}>Billed {billing.charAt(0).toUpperCase() + billing.slice(1)}</p>

            <button
              className="w-full py-2.5 rounded text-sm font-bold mb-5 transition-all"
              style={{
                background: plan.featured ? '#222' : 'rgba(0,0,0,0.06)',
                color: plan.featured ? '#fff' : '#333',
              }}
            >
              Buy Now
            </button>

            {/* Key features */}
            <div className="space-y-2 mb-4">
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <span style={{ color: '#22c55e', fontSize: 14 }}>✓</span>
                  <span className="text-xs" style={{ color: '#333' }}>{f}</span>
                </div>
              ))}
            </div>

            <div className="text-xs font-medium mb-2" style={{ color: '#999' }}>
              {plan.name === 'BASIC' ? 'Top Features' : plan.name === 'STANDARD' ? 'All Basic plan features, plus' : 'All Standard plan features, plus'}
            </div>
            <div className="space-y-2">
              {plan.topFeatures.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <span style={{ color: '#ab00ff', fontSize: 14 }}>+</span>
                  <span className="text-xs" style={{ color: '#ab00ff' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}