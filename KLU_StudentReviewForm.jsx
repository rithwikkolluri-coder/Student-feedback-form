import { useState, useCallback } from "react";

// ── CSS Variables & Global Styles ──────────────────────────────────────────
const globalStyle = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --kl-red: #c0111f; --kl-red-dark: #8f0d17; --kl-red-light: #fdf0f1;
    --kl-red-mid: #f5c0c3; --kl-gold: #f0a500; --kl-teal: #006d77;
    --text-primary: #1a1a1a; --text-secondary: #555; --text-muted: #999;
    --bg-page: #f4f5f8; --bg-card: #ffffff; --border: #e5e7eb;
    --radius: 14px; --radius-sm: 9px;
  }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-page); min-height: 100vh; color: var(--text-primary); }

  .topbar { background: #8f0d17; padding: 6px 1.5rem; display: flex;
    align-items: center; justify-content: space-between; }
  .topbar span { font-size: 12px; color: rgba(255,255,255,0.75); display: flex; align-items: center; gap: 6px; }
  .naac { background: var(--kl-gold); color: #7a4a00; font-size: 11px; font-weight: 700;
    padding: 2px 9px; border-radius: 4px; letter-spacing: 0.04em; }
  .user-chip { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.85); }
  .btn-logout { background: rgba(255,255,255,0.15); border: none; color: #fff; font-size: 11px;
    padding: 3px 10px; border-radius: 5px; cursor: pointer; }
  .btn-logout:hover { background: rgba(255,255,255,0.25); }

  .klu-header { background: var(--kl-red); position: relative; overflow: hidden; }
  .klu-header::before { content:''; position:absolute; top:-50px; right:-50px; width:260px; height:260px;
    border-radius:50%; background:rgba(255,255,255,0.05); pointer-events:none; }
  .header-inner { max-width:760px; margin:0 auto; padding:2rem 1.5rem; position:relative; z-index:1; }
  .header-top { display:flex; align-items:center; gap:18px; margin-bottom:1.25rem; }
  .logo-wrap { width:64px; height:64px; border-radius:14px; background:#fff; display:flex;
    flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;
    box-shadow:0 3px 14px rgba(0,0,0,0.18); padding:6px; }
  .logo-kl { font-size:22px; font-weight:900; color:var(--kl-red); line-height:1; letter-spacing:-1px; }
  .logo-u { font-size:10px; font-weight:700; color:var(--kl-gold); letter-spacing:0.12em; margin-top:1px; }
  .header-text h1 { font-size:22px; font-weight:800; color:#fff; line-height:1.2; margin-bottom:3px; }
  .header-text .sub { font-size:13px; color:rgba(255,255,255,0.7); display:flex; align-items:center; gap:6px; }
  .header-banner { display:flex; align-items:flex-start; gap:12px; background:rgba(255,255,255,0.1);
    border-radius:10px; border-left:3px solid var(--kl-gold); padding:14px 16px; }
  .header-banner div { font-size:13.5px; color:rgba(255,255,255,0.9); line-height:1.6; }
  .header-banner strong { color:#fff; }

  .progress-wrap { max-width:760px; margin:0 auto; background:#fff; border-bottom:1px solid var(--border); }
  .progress-inner { display:flex; }
  .prog-step { flex:1; padding:10px 0; text-align:center; font-size:12px; font-weight:500;
    color:var(--text-muted); border-bottom:3px solid transparent; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:5px;
    transition:color 0.15s, border-color 0.15s; background:none; border-top:none;
    border-left:none; border-right:none; font-family:inherit; }
  .prog-step.active { color:var(--kl-red); border-bottom-color:var(--kl-red); }

  .page-body { max-width:760px; margin:0 auto; padding:1.75rem 1.25rem 3rem; }

  .tab-bar { display:flex; gap:8px; margin-bottom:1.5rem; flex-wrap:wrap; }
  .tab { padding:9px 20px; border-radius:99px; border:1.5px solid var(--border); font-size:14px;
    font-weight:400; cursor:pointer; background:#fff; color:var(--text-secondary);
    transition:all 0.15s; display:flex; align-items:center; gap:7px; font-family:inherit; }
  .tab.active { background:var(--kl-red); color:#fff; border-color:var(--kl-red); font-weight:600; }
  .tab:hover:not(.active) { border-color:var(--kl-red-mid); color:var(--kl-red); background:var(--kl-red-light); }

  .section-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius);
    padding:1.5rem; margin-bottom:1rem; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
  .section-card.dashed { border-style:dashed; box-shadow:none; }
  .card-head { display:flex; align-items:center; gap:10px; margin-bottom:1.25rem;
    padding-bottom:1rem; border-bottom:1px solid #f0f0f0; }
  .card-icon { width:36px; height:36px; border-radius:9px; background:var(--kl-red-light);
    display:flex; align-items:center; justify-content:center; font-size:18px; color:var(--kl-red); }
  .card-head-text h2 { font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:1px; }
  .card-head-text p { font-size:12px; color:var(--text-muted); }
  .sub-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;
    letter-spacing:0.08em; margin-bottom:0.85rem; display:flex; align-items:center; gap:6px; }

  .field { margin-bottom:1.25rem; }
  .field:last-child { margin-bottom:0; }
  .field label { display:block; font-size:14px; font-weight:500; color:var(--text-primary); margin-bottom:6px; }
  .opt { font-weight:400; color:var(--text-muted); font-size:13px; }
  input[type="text"], input[type="email"], input[type="password"], select, textarea {
    width:100%; padding:10px 13px; font-size:14px; border:1.5px solid var(--border);
    border-radius:var(--radius-sm); background:#fafafa; color:var(--text-primary);
    outline:none; transition:border-color 0.15s, box-shadow 0.15s; font-family:inherit; }
  input:focus, select:focus, textarea:focus { border-color:var(--kl-red);
    box-shadow:0 0 0 3px rgba(192,17,31,0.1); background:#fff; }
  input.error { border-color:#e53e3e; box-shadow:0 0 0 3px rgba(229,62,62,0.1); }
  textarea { min-height:80px; resize:vertical; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  @media (max-width:520px) { .two-col { grid-template-columns:1fr; } }
  .divider { height:1px; background:#f0f0f0; margin:1.25rem 0; }

  .rating-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .mini-card { background:#f8f9fc; border:1px solid #eeeff3; border-radius:10px; padding:0.9rem 1rem; }
  .mini-card label { font-size:13px; font-weight:500; color:#333; display:block; margin-bottom:8px; }
  .star-row { display:flex; align-items:center; gap:3px; }
  .star { font-size:21px; cursor:pointer; color:#ddd; transition:color 0.1s; user-select:none; line-height:1; }
  .star.lit { color:var(--kl-gold); }
  .star-label { font-size:11px; color:var(--text-muted); margin-left:5px; min-width:58px; }

  .tag-row { display:flex; flex-wrap:wrap; gap:7px; }
  .tag { padding:6px 13px; border-radius:99px; border:1.5px solid var(--border); font-size:13px;
    cursor:pointer; color:var(--text-secondary); background:#fff; transition:all 0.12s; font-family:inherit; }
  .tag.selected { background:var(--kl-red-light); color:var(--kl-red-dark);
    border-color:var(--kl-red); font-weight:600; }
  .tag:hover:not(.selected) { background:#f5f5f5; }

  .submit-row { display:flex; align-items:center; gap:10px; margin-top:1.5rem; flex-wrap:wrap; }
  .btn-submit { padding:12px 32px; border-radius:var(--radius-sm); background:var(--kl-red);
    color:#fff; border:none; font-size:14px; font-weight:700; cursor:pointer;
    display:flex; align-items:center; gap:8px; transition:opacity 0.15s, transform 0.1s;
    font-family:inherit; letter-spacing:0.02em; }
  .btn-submit:hover { opacity:0.88; }
  .btn-submit:active { transform:scale(0.98); }
  .btn-reset { padding:12px 20px; border-radius:var(--radius-sm); background:transparent;
    color:var(--text-secondary); border:1.5px solid var(--border); font-size:14px;
    cursor:pointer; font-family:inherit; transition:background 0.12s; }
  .btn-reset:hover { background:#f0f0f0; }

  .success-box { background:#fff; border:1px solid var(--border); border-radius:var(--radius);
    padding:3rem 1.5rem; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
  .success-icon { width:68px; height:68px; border-radius:50%; background:#eaf3de;
    display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem; font-size:32px; }
  .success-box h3 { font-size:21px; font-weight:800; color:#1a1a1a; margin-bottom:8px; }
  .success-box p { font-size:14px; color:var(--text-secondary); margin-bottom:4px; }
  .klu-tag { display:inline-block; margin:12px 0 1.5rem; background:var(--kl-red-light);
    color:var(--kl-red-dark); font-size:12px; font-weight:600; padding:5px 14px; border-radius:99px; }
  .btn-new { padding:11px 26px; border-radius:var(--radius-sm); background:var(--kl-red);
    color:#fff; border:none; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; }
  .btn-new:hover { opacity:0.88; }

  .page-footer { text-align:center; font-size:12px; color:#bbb; margin-top:2rem; line-height:1.8; }
  .page-footer strong { color:var(--kl-red); }
  .page-footer a { color:#aaa; text-decoration:none; }

  #loginPage { min-height:100vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; background:var(--bg-page); padding:1.5rem; }
  .login-card { background:#fff; border:1px solid var(--border); border-radius:var(--radius);
    box-shadow:0 4px 24px rgba(0,0,0,0.07); padding:2.5rem 2rem; width:100%; max-width:420px; }
  .login-logo { display:flex; align-items:center; gap:14px; margin-bottom:1.75rem; }
  .login-logo-box { width:52px; height:52px; border-radius:12px; background:var(--kl-red);
    display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; }
  .login-logo-box .logo-kl { font-size:18px; font-weight:900; color:#fff; line-height:1; letter-spacing:-1px; }
  .login-logo-box .logo-u { font-size:8px; font-weight:700; color:rgba(255,255,255,0.75); letter-spacing:0.1em; margin-top:1px; }
  .login-title h2 { font-size:17px; font-weight:800; color:var(--text-primary); margin-bottom:2px; }
  .login-title p { font-size:12px; color:var(--text-muted); }
  .login-divider { height:1px; background:#f0f0f0; margin:0 0 1.5rem; }
  .login-field { margin-bottom:1.1rem; }
  .login-field label { display:block; font-size:13.5px; font-weight:500; color:var(--text-primary); margin-bottom:6px; }
  .login-input-wrap { position:relative; }
  .login-input-wrap .icon { position:absolute; left:12px; top:50%; transform:translateY(-50%);
    font-size:16px; color:var(--text-muted); pointer-events:none; }
  .login-input-wrap input { padding-left:36px; }
  .login-hint { font-size:11.5px; color:var(--text-muted); margin-top:5px; }
  .login-error { display:flex; align-items:center; gap:8px; background:#fff5f5;
    border:1px solid #fed7d7; border-radius:8px; padding:10px 12px; margin-bottom:1rem;
    font-size:13px; color:#c53030; }
  .btn-login { width:100%; padding:12px; border-radius:var(--radius-sm); background:var(--kl-red);
    color:#fff; border:none; font-size:15px; font-weight:700; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px;
    font-family:inherit; transition:opacity 0.15s; margin-top:0.5rem; }
  .btn-login:hover { opacity:0.88; }
  .login-footer { font-size:12px; color:var(--text-muted); text-align:center; margin-top:1.25rem; line-height:1.7; }
`;

// ── Reusable: StarRating ───────────────────────────────────────────────────
const starLabels = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

function StarRating({ label, ratingKey, ratings, setRatings }) {
  const [hover, setHover] = useState(0);
  const val = ratings[ratingKey] || 0;
  const display = hover || val;
  return (
    <div className="mini-card">
      <label>{label}</label>
      <div className="star-row">
        {[1,2,3,4,5].map(n => (
          <span
            key={n}
            className={`star${display >= n ? ' lit' : ''}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRatings(r => ({ ...r, [ratingKey]: n }))}
          >★</span>
        ))}
        <span className="star-label">{display ? starLabels[display] : '—'}</span>
      </div>
    </div>
  );
}

// ── Reusable: TagSelector ──────────────────────────────────────────────────
function TagSelector({ tags, selected, setSelected }) {
  const toggle = (tag, exclusive) => {
    if (exclusive) {
      setSelected([tag]);
    } else {
      const without = selected.filter(t => !tags.find(x => x.exclusive && x.label === t));
      setSelected(
        without.includes(tag) ? without.filter(t => t !== tag) : [...without, tag]
      );
    }
  };
  return (
    <div className="tag-row">
      {tags.map(({ label, exclusive }) => (
        <button
          key={label}
          type="button"
          className={`tag${selected.includes(label) ? ' selected' : ''}`}
          onClick={() => toggle(label, exclusive)}
        >{label}</button>
      ))}
    </div>
  );
}

// ── Login Page ─────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email.toLowerCase().endsWith('@klh.edu.in')) {
      setError('Please use your official @klh.edu.in college email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    onLogin(email);
  };

  return (
    <div id="loginPage">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-box">
            <div className="logo-kl">KL</div>
            <div className="logo-u">UNIVERSITY</div>
          </div>
          <div className="login-title">
            <h2>KL University Hyderabad</h2>
            <p>Student Services Feedback Portal</p>
          </div>
        </div>
        <div className="login-divider" />

        {error && (
          <div className="login-error">
            ⚠️ <span>{error}</span>
          </div>
        )}

        <div className="login-field">
          <label>College Email Address</label>
          <div className="login-input-wrap">
            <span className="icon">✉</span>
            <input
              type="email"
              placeholder="yourname@klh.edu.in"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={error && !email.toLowerCase().endsWith('@klh.edu.in') ? 'error' : ''}
            />
          </div>
          <div className="login-hint">Must be your official <strong>@klh.edu.in</strong> email</div>
        </div>

        <div className="login-field">
          <label>Password</label>
          <div className="login-input-wrap">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        <button className="btn-login" onClick={handleLogin}>→ Sign in</button>

        <div className="login-footer">
          Use your KLU Hyderabad student portal credentials.<br />
          Issues? Contact <strong>it.support@klh.edu.in</strong>
        </div>
      </div>
    </div>
  );
}

// ── Bus Section ────────────────────────────────────────────────────────────
function BusSection({ data, setData, ratings, setRatings }) {
  const busIssues = [
    { label: 'Overcrowding' }, { label: 'Late arrivals' }, { label: 'Rough driving' },
    { label: 'AC / heating issue' }, { label: 'Route change without notice' },
    { label: 'Breakdown / delay' }, { label: 'Rude staff' }, { label: 'Insufficient buses' },
    { label: 'No issues ✓', exclusive: true },
  ];
  return (
    <div className="section-card">
      <div className="card-head">
        <div className="card-icon">🚌</div>
        <div className="card-head-text">
          <h2>KLU Hyderabad — Bus Service</h2>
          <p>Rate the transportation facilities provided by the university</p>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: '1.25rem' }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Route / bus number</label>
          <input type="text" placeholder="e.g. Route 7 — Mehdipatnam"
            value={data.busRoute || ''} onChange={e => setData(d => ({ ...d, busRoute: e.target.value }))} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Your boarding stop</label>
          <select value={data.busStop || ''} onChange={e => setData(d => ({ ...d, busStop: e.target.value }))}>
            <option value="">— select stop —</option>
            <optgroup label="Hyderabad City">
              {['Mehdipatnam','Tolichowki','Attapur','Rajendranagar','Shamshabad','Aramghar',
                'Banjara Hills','Jubilee Hills','Madhapur / HITEC City','Gachibowli','Kondapur','Kothaguda'
              ].map(s => <option key={s}>{s}</option>)}
            </optgroup>
            <optgroup label="Surrounding Areas">
              {['Bachupally','Chevella','Shankarpally','Gandipet','Ibrahimpatnam','Shadnagar'
              ].map(s => <option key={s}>{s}</option>)}
            </optgroup>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: '1.25rem' }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Usual travel time</label>
          <select value={data.busTime || ''} onChange={e => setData(d => ({ ...d, busTime: e.target.value }))}>
            <option value="">— select —</option>
            {['Morning (before 7:30 AM)','Morning (7:30 – 9 AM)','Afternoon (12 – 2 PM)',
              'Evening (4 – 6 PM)','Evening (after 6 PM)'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>How long have you used this route?</label>
          <select value={data.busUsage || ''} onChange={e => setData(d => ({ ...d, busUsage: e.target.value }))}>
            <option value="">— select —</option>
            {['Less than 1 month','1 – 3 months','3 – 6 months','6 months – 1 year','More than 1 year'
            ].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="divider" />
      <div className="sub-title">⭐ Rate your experience</div>
      <div className="rating-grid">
        {[['Punctuality','punctuality'],['Cleanliness','cleanliness_bus'],
          ['Driver behaviour','driver'],['Comfort & seating','comfort'],
          ['Safety & security','safety'],['Overall satisfaction','bus_overall']
        ].map(([lbl, key]) => (
          <StarRating key={key} label={lbl} ratingKey={key} ratings={ratings} setRatings={setRatings} />
        ))}
      </div>

      <div className="divider" />
      <div className="field">
        <label>Issues faced <span className="opt">(select all that apply)</span></label>
        <TagSelector tags={busIssues} selected={data.busIssues || []}
          setSelected={v => setData(d => ({ ...d, busIssues: v }))} />
      </div>

      <div className="two-col">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Would you recommend KLU Hyderabad bus service?</label>
          <select value={data.busRecommend || ''} onChange={e => setData(d => ({ ...d, busRecommend: e.target.value }))}>
            <option value="">— select —</option>
            {['Yes, definitely','Yes, with some improvements','Not sure','No'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>How do you travel on off-days?</label>
          <select value={data.altTravel || ''} onChange={e => setData(d => ({ ...d, altTravel: e.target.value }))}>
            <option value="">— select —</option>
            {['Auto / cab','Personal vehicle','Metro + auto','Hostel resident','Other'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="divider" />
      <div className="field">
        <label>Comments & suggestions <span className="opt">(optional)</span></label>
        <textarea placeholder="Share your experience or suggest improvements for KLU Hyderabad bus service…"
          value={data.busComments || ''} onChange={e => setData(d => ({ ...d, busComments: e.target.value }))} />
      </div>
    </div>
  );
}

// ── Canteen Section ────────────────────────────────────────────────────────
function CanteenSection({ data, setData, ratings, setRatings }) {
  const canteenIssues = [
    { label: 'Long queues' }, { label: 'Unhygienic conditions' }, { label: 'Stale / bad food' },
    { label: 'High prices' }, { label: 'Limited vegetarian options' }, { label: 'Limited non-veg options' },
    { label: 'Poor seating' }, { label: 'Rude staff' }, { label: 'Satisfied ✓', exclusive: true },
  ];
  return (
    <div className="section-card">
      <div className="card-head">
        <div className="card-icon">🍽️</div>
        <div className="card-head-text">
          <h2>KLU Hyderabad — Canteen & Food Court</h2>
          <p>Rate the food and dining facilities on campus</p>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: '1.25rem' }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Canteen</label>
          <input type="text" value="KLU Hyderabad Main Canteen" readOnly
            style={{ background: '#f0f0f0', color: 'var(--text-secondary)', cursor: 'default' }} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Usual visit time</label>
          <select value={data.canteenTime || ''} onChange={e => setData(d => ({ ...d, canteenTime: e.target.value }))}>
            <option value="">— select —</option>
            {['Breakfast (7 – 9 AM)','Mid-morning snack (9 – 11 AM)','Lunch (12 – 2 PM)',
              'Evening snack (4 – 6 PM)','Dinner (7 – 9 PM)'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label>How often do you use the canteen?</label>
        <select value={data.canteenFreq || ''} onChange={e => setData(d => ({ ...d, canteenFreq: e.target.value }))}>
          <option value="">— select —</option>
          {['Every day','4–5 times a week','2–3 times a week','Once a week','Occasionally'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="divider" />
      <div className="sub-title">⭐ Rate your experience</div>
      <div className="rating-grid">
        {[['Food quality & taste','food'],['Hygiene & cleanliness','hygiene'],
          ['Value for money','value'],['Staff behaviour','staff'],
          ['Service speed','speed'],['Overall satisfaction','canteen_overall']
        ].map(([lbl, key]) => (
          <StarRating key={key} label={lbl} ratingKey={key} ratings={ratings} setRatings={setRatings} />
        ))}
      </div>

      <div className="divider" />
      <div className="field">
        <label>Issues faced <span className="opt">(select all that apply)</span></label>
        <TagSelector tags={canteenIssues} selected={data.canteenIssues || []}
          setSelected={v => setData(d => ({ ...d, canteenIssues: v }))} />
      </div>

      <div className="two-col">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Favourite item <span className="opt">(optional)</span></label>
          <input type="text" placeholder="e.g. Hyderabadi biryani, Dosa…"
            value={data.favItem || ''} onChange={e => setData(d => ({ ...d, favItem: e.target.value }))} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Avg. spend per visit (₹)</label>
          <select value={data.canteenSpend || ''} onChange={e => setData(d => ({ ...d, canteenSpend: e.target.value }))}>
            <option value="">— select —</option>
            {['Under ₹50','₹50 – ₹100','₹100 – ₹150','₹150 – ₹200','Above ₹200'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="divider" />
      <div className="field">
        <label>Comments & suggestions <span className="opt">(optional)</span></label>
        <textarea placeholder="What would you like improved, or what do you enjoy most at KLU Hyderabad canteen?"
          value={data.canteenComments || ''} onChange={e => setData(d => ({ ...d, canteenComments: e.target.value }))} />
      </div>
    </div>
  );
}

// ── Hostel Section ─────────────────────────────────────────────────────────
function HostelSection({ data, setData, ratings, setRatings }) {
  const hostelIssues = [
    { label: 'Dirty rooms' }, { label: 'Water shortage' }, { label: 'Power cuts' },
    { label: 'Poor Wi-Fi' }, { label: 'Maintenance ignored' }, { label: 'Noisy environment' },
    { label: 'Security concerns' }, { label: 'Insufficient common areas' }, { label: 'Overcrowding' },
    { label: 'No issues ✓', exclusive: true },
  ];
  return (
    <div className="section-card">
      <div className="card-head">
        <div className="card-icon" style={{ background: '#f0f4ff', color: '#3b5bdb' }}>🏠</div>
        <div className="card-head-text">
          <h2>KLU Hyderabad — Hostel</h2>
          <p>Rate your hostel accommodation and facilities</p>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: '1.25rem' }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Hostel block</label>
          <select value={data.hostelBlock || ''} onChange={e => setData(d => ({ ...d, hostelBlock: e.target.value }))}>
            <option value="">— select —</option>
            {['Boys hostel – Block A','Boys hostel – Block B','Boys hostel – Block C',
              'Girls hostel – Block A','Girls hostel – Block B','Other / Not sure'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Room type</label>
          <select value={data.hostelRoom || ''} onChange={e => setData(d => ({ ...d, hostelRoom: e.target.value }))}>
            <option value="">— select —</option>
            {['Single occupancy','Double sharing','Triple sharing','Four sharing'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label>How long have you been staying?</label>
        <select value={data.hostelDuration || ''} onChange={e => setData(d => ({ ...d, hostelDuration: e.target.value }))}>
          <option value="">— select —</option>
          {['Less than 1 month','1 – 3 months','3 – 6 months','6 months – 1 year','More than 1 year'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="divider" />
      <div className="sub-title">⭐ Rate your experience</div>
      <div className="rating-grid">
        {[['Room cleanliness','hostel_clean'],['Washroom hygiene','hostel_washroom'],
          ['Wi-Fi connectivity','hostel_wifi'],['Water & power supply','hostel_utilities'],
          ['Warden / staff behaviour','hostel_warden'],['Overall satisfaction','hostel_overall']
        ].map(([lbl, key]) => (
          <StarRating key={key} label={lbl} ratingKey={key} ratings={ratings} setRatings={setRatings} />
        ))}
      </div>

      <div className="divider" />
      <div className="field">
        <label>Issues faced <span className="opt">(select all that apply)</span></label>
        <TagSelector tags={hostelIssues} selected={data.hostelIssues || []}
          setSelected={v => setData(d => ({ ...d, hostelIssues: v }))} />
      </div>

      <div className="two-col">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Would you recommend the KLU hostel?</label>
          <select value={data.hostelRecommend || ''} onChange={e => setData(d => ({ ...d, hostelRecommend: e.target.value }))}>
            <option value="">— select —</option>
            {['Yes, definitely','Yes, with some improvements','Not sure','No'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Mess / food quality in hostel</label>
          <select value={data.hostelMess || ''} onChange={e => setData(d => ({ ...d, hostelMess: e.target.value }))}>
            <option value="">— select —</option>
            {['Excellent','Good','Average','Poor','Very poor'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="divider" />
      <div className="field">
        <label>Comments & suggestions <span className="opt">(optional)</span></label>
        <textarea placeholder="Share your experience or suggest improvements for KLU Hyderabad hostel…"
          value={data.hostelComments || ''} onChange={e => setData(d => ({ ...d, hostelComments: e.target.value }))} />
      </div>
    </div>
  );
}

// ── Student Details ────────────────────────────────────────────────────────
function StudentDetails({ data, setData }) {
  return (
    <div className="section-card dashed">
      <div className="card-head" style={{ marginBottom: '1rem', paddingBottom: '.85rem' }}>
        <div className="card-icon" style={{ background: '#f0f8ff', color: '#185fa5' }}>👤</div>
        <div className="card-head-text">
          <h2>Your details</h2>
          <p>Optional — used only if we need to follow up on your feedback</p>
        </div>
      </div>
      <div className="two-col">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Full name</label>
          <input type="text" placeholder="Your name"
            value={data.studentName || ''} onChange={e => setData(d => ({ ...d, studentName: e.target.value }))} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>KL Hyderabad ID / Roll no.</label>
          <input type="text" placeholder="e.g. 21331A0001"
            value={data.studentId || ''} onChange={e => setData(d => ({ ...d, studentId: e.target.value }))} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Department</label>
          <select value={data.studentDept || ''} onChange={e => setData(d => ({ ...d, studentDept: e.target.value }))}>
            <option value="">— select —</option>
            {['CSE','CSE (AI & ML)','CSE (Data Science)','CSE (Cyber Security)','ECE','EEE',
              'Mechanical Engineering','Civil Engineering','IT','MBA','MCA','B.Sc / M.Sc','Other'
            ].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Year of study</label>
          <select value={data.studentYear || ''} onChange={e => setData(d => ({ ...d, studentYear: e.target.value }))}>
            <option value="">— select —</option>
            {['1st year','2nd year','3rd year','4th year','PG / MBA 1st year','PG / MBA 2nd year','PhD'
            ].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Accommodation</label>
          <select value={data.studentAccom || ''} onChange={e => setData(d => ({ ...d, studentAccom: e.target.value }))}>
            <option value="">— select —</option>
            {['KLU Hyderabad hostel','Private hostel / PG','Day scholar (commuting)'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Mobile number <span className="opt">(optional)</span></label>
          <input type="text" placeholder="For follow-up only"
            value={data.studentPhone || ''} onChange={e => setData(d => ({ ...d, studentPhone: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const TABS = ['bus', 'canteen', 'hostel', 'both'];
  const TAB_LABELS = [
    { key: 'bus',     icon: '🚌', label: 'Bus service' },
    { key: 'canteen', icon: '🍽️', label: 'Canteen' },
    { key: 'hostel',  icon: '🏠', label: 'Hostel' },
    { key: 'both',    icon: '☑️', label: 'All services' },
  ];

  const [activeTab, setActiveTab] = useState('bus');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [ratings, setRatings] = useState({});

  const showBus     = activeTab === 'bus'     || activeTab === 'both';
  const showCanteen = activeTab === 'canteen' || activeTab === 'both';
  const showHostel  = activeTab === 'hostel'  || activeTab === 'both';

  const handleReset = () => {
    setFormData({});
    setRatings({});
    setSubmitted(false);
    setActiveTab('bus');
  };

  if (submitted) {
    return (
      <div>
        <div className="topbar">
          <span>📍 Hyderabad Campus — Bachupally, Hyderabad, Telangana</span>
          <span className="naac">NAAC A++</span>
          <div className="user-chip">
            👤 {user}
            <button className="btn-logout" onClick={onLogout}>Sign out</button>
          </div>
        </div>
        <div className="page-body">
          <div className="success-box">
            <div className="success-icon">✅</div>
            <h3>Thank you for your feedback!</h3>
            <p>Your review has been submitted to the KLU Hyderabad Student Welfare Cell.</p>
            <p>We typically act on feedback within <strong>7 working days</strong>.</p>
            <div className="klu-tag">KL University Hyderabad — Bachupally</div>
            <br />
            <button className="btn-new" onClick={handleReset}>Submit another review</button>
          </div>
        </div>
        <div className="page-footer">
          <strong>KL University Hyderabad</strong> &nbsp;·&nbsp; Bachupally, Hyderabad – 500090, Telangana<br />
          Student Welfare Cell &nbsp;·&nbsp; <a href="#">studentwelfare.hyd@kluniversity.in</a> &nbsp;·&nbsp; © 2024–25 KL University
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Bar */}
      <div className="topbar">
        <span>📍 Hyderabad Campus — Bachupally, Hyderabad, Telangana</span>
        <span className="naac">NAAC A++</span>
        <div className="user-chip">
          👤 {user}
          <button className="btn-logout" onClick={onLogout}>Sign out</button>
        </div>
      </div>

      {/* Header */}
      <div className="klu-header">
        <div className="header-inner">
          <div className="header-top">
            <div className="logo-wrap">
              <div className="logo-kl">KL</div>
              <div className="logo-u">UNIVERSITY</div>
            </div>
            <div className="header-text">
              <h1>KL University Hyderabad</h1>
              <div className="sub">🏛️ Student Services Feedback Portal &nbsp;·&nbsp; Academic Year 2024–25</div>
            </div>
          </div>
          <div className="header-banner">
            <div>
              <strong>Campus Service Review Form</strong> — Share your experience with KLU Hyderabad's
              bus transportation, canteen, and hostel facilities. Your feedback is reviewed weekly by the{' '}
              <strong>Student Welfare Cell</strong> and helps us deliver a better campus life.
            </div>
          </div>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="progress-wrap">
        <div className="progress-inner">
          {TAB_LABELS.map(({ key, icon, label }) => (
            <button key={key} className={`prog-step${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="page-body">
        {/* Tab Bar */}
        <div className="tab-bar">
          {TAB_LABELS.map(({ key, icon, label }) => (
            <button key={key} className={`tab${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}>
              {icon} {label}
            </button>
          ))}
        </div>

        {showBus     && <BusSection     data={formData} setData={setFormData} ratings={ratings} setRatings={setRatings} />}
        {showCanteen && <CanteenSection  data={formData} setData={setFormData} ratings={ratings} setRatings={setRatings} />}
        {showHostel  && <HostelSection   data={formData} setData={setFormData} ratings={ratings} setRatings={setRatings} />}

        <StudentDetails data={formData} setData={setFormData} />

        <div className="submit-row">
          <button className="btn-submit" onClick={() => setSubmitted(true)}>✈ Submit review</button>
          <button className="btn-reset" onClick={handleReset}>Clear form</button>
        </div>
      </div>

      <div className="page-footer">
        <strong>KL University Hyderabad</strong> &nbsp;·&nbsp; Bachupally, Hyderabad – 500090, Telangana<br />
        Student Welfare Cell &nbsp;·&nbsp; <a href="#">studentwelfare.hyd@kluniversity.in</a> &nbsp;·&nbsp; © 2024–25 KL University
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <style>{globalStyle}</style>
      {user
        ? <MainApp user={user} onLogout={() => setUser(null)} />
        : <LoginPage onLogin={setUser} />
      }
    </>
  );
}
