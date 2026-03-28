import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// SAUTI — AI-Powered Voice-Authenticated Mobile Money
// KSU FinTech Hackathon 2026 — Interactive Prototype
// ═══════════════════════════════════════════════════════════════════

const C = {
  navy: "#1E2761", navyDeep: "#141B45", navyLight: "#2D3A8C",
  gold: "#D4A843", goldLight: "#E8D08A", goldDim: "#B8923A",
  green: "#2C8C4A", greenLight: "#34A85A", greenSoft: "#E8F5EE",
  red: "#C0392B", redSoft: "#FDF0EE",
  bg: "#F5F2EB", bgWarm: "#FFFDF8",
  white: "#FFFFFF", dark: "#14141A",
  gray50: "#FAFAF8", gray100: "#F0EDE6", gray200: "#D9D5CC",
  gray400: "#A09B90", gray500: "#7A756B", gray600: "#5C584F",
};

const gradient = {
  navy: "linear-gradient(135deg, #141B45 0%, #1E2761 50%, #2D3A8C 100%)",
  gold: "linear-gradient(135deg, #B8923A 0%, #D4A843 50%, #E8D08A 100%)",
  green: "linear-gradient(135deg, #1F7A3A 0%, #2C8C4A 50%, #34A85A 100%)",
  card: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)",
  glass: "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
};

// ──────────── SHARED COMPONENTS ────────────

const StatusBar = () => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 24px 6px", color: "rgba(255,255,255,0.8)", fontSize: 13,
    fontWeight: 600, fontVariantNumeric: "tabular-nums",
  }}>
    <span style={{ letterSpacing: 0.5 }}>9:41</span>
    <div style={{ display: "flex", gap: 6, alignItems: "center", opacity: 0.8 }}>
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
        <rect x="0.5" y="7.5" width="2.5" height="4" rx="0.75" fill="currentColor" opacity=".4"/>
        <rect x="4.5" y="5" width="2.5" height="6.5" rx="0.75" fill="currentColor" opacity=".6"/>
        <rect x="8.5" y="2.5" width="2.5" height="9" rx="0.75" fill="currentColor" opacity=".8"/>
        <rect x="12.5" y="0.5" width="2.5" height="11" rx="0.75" fill="currentColor"/>
      </svg>
      <svg width="22" height="11" viewBox="0 0 22 11"><rect x=".5" y=".5" width="18" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="19.5" y="3" width="1.5" height="5" rx=".75" fill="currentColor" opacity=".4"/><rect x="2" y="2" width="13" height="7" rx="1.5" fill="currentColor"/></svg>
    </div>
  </div>
);

const AppHeader = ({ title, subtitle, onBack, showLogo }) => (
  <div style={{
    display: "flex", alignItems: "center", padding: "10px 20px 14px", gap: 12,
  }}>
    {onBack && (
      <button onClick={onBack} style={{
        background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
        width: 36, height: 36, borderRadius: 12, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>←</button>
    )}
    <div style={{ flex: 1 }}>
      {showLogo ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: gradient.gold, display: "flex",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px #D4A84344",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7 3 3 6 3 10c0 2 1 4 3 5l-1 6 5-3c.7.1 1.3.2 2 .2 5 0 9-3 9-7s-4-8.2-9-8.2z" fill="white" opacity=".9"/>
              <circle cx="8" cy="10" r="1.2" fill="#1E2761"/><circle cx="12" cy="10" r="1.2" fill="#1E2761"/><circle cx="16" cy="10" r="1.2" fill="#1E2761"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#D4A843", letterSpacing: 2.5 }}>SAUTI</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 3, textTransform: "uppercase" }}>AI-Powered Payments</div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{subtitle}</div>}
        </>
      )}
    </div>
  </div>
);

const BottomNav = ({ active, onNavigate }) => {
  const items = [
    { id: "home", label: "Nyumbani", sub: "Home" },
    { id: "history", label: "Historia", sub: "History" },
    { id: "security", label: "Usalama", sub: "Security" },
    { id: "help", label: "Msaada", sub: "Help" },
  ];
  const icons = {
    home: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" stroke={a?C.gold:C.gray400} strokeWidth="2" fill={a?C.gold+"22":"none"}/><path d="M9 21V14h6v7" stroke={a?C.gold:C.gray400} strokeWidth="2"/></svg>,
    history: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={a?C.gold:C.gray400} strokeWidth="2"/><path d="M12 7v5l3 3" stroke={a?C.gold:C.gray400} strokeWidth="2" strokeLinecap="round"/></svg>,
    security: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v5c0 5-3 9.5-7 11-4-1.5-7-6-7-11V6l7-4z" stroke={a?C.gold:C.gray400} strokeWidth="2" fill={a?C.gold+"22":"none"}/></svg>,
    help: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={a?C.gold:C.gray400} strokeWidth="2"/><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4" stroke={a?C.gold:C.gray400} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill={a?C.gold:C.gray400}/></svg>,
  };
  return (
    <div style={{
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "6px 0 18px", background: C.white, borderTop: "1px solid " + C.gray100,
      position: "absolute", bottom: 0, left: 0, right: 0,
    }}>
      {items.map(item => {
        const isA = active === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "6px 12px", position: "relative",
          }}>
            {isA && <div style={{ position: "absolute", top: -6, width: 24, height: 3, background: gradient.gold, borderRadius: 2 }}/>}
            {icons[item.id](isA)}
            <span style={{ fontSize: 10, fontWeight: isA ? 700 : 500, color: isA ? C.navy : C.gray400, marginTop: 1 }}>{item.label}</span>
            <span style={{ fontSize: 7, color: C.gray400 }}>{item.sub}</span>
          </button>
        );
      })}
    </div>
  );
};

const AIPill = ({ label, size = "sm" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: size === "sm" ? "3px 8px" : "5px 12px",
    background: "linear-gradient(135deg, #141B4518, #2D3A8C12)",
    borderRadius: 20, border: "1px solid #2D3A8C22",
    fontSize: size === "sm" ? 9 : 11, fontWeight: 600, color: C.navyLight, letterSpacing: 0.3,
  }}>
    <svg width={size === "sm" ? 10 : 13} height={size === "sm" ? 10 : 13} viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11 6.5 7.5 3 6l3.5-1.5L8 1z" fill={C.navyLight}/>
      <path d="M3 11l.75 1.75L5.5 13.5l-1.75.75L3 16l-.75-1.75L.5 13.5l1.75-.75L3 11z" fill={C.navyLight} opacity=".5"/>
    </svg>
    {label}
  </span>
);

// ──────────── SCREEN 1: HOME ────────────

const HomeScreen = ({ onNavigate, onReceive }) => {
  const [showBal, setShowBal] = useState(false);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: gradient.navy, paddingBottom: 28, borderRadius: "0 0 28px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(212,168,67,0.06)" }}/>
        <StatusBar />
        <AppHeader showLogo />
        <div style={{ padding: "8px 24px 0" }}>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.65)" }}>Habari, <span style={{ color: "#fff", fontWeight: 600 }}>Amina</span> 👋</div>
          <button onClick={() => setShowBal(!showBal)} style={{
            marginTop: 16, width: "100%", padding: "18px 20px",
            background: gradient.glass, borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: C.green + "33", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke={C.greenLight} strokeWidth="2"/><path d="M2 10h20" stroke={C.greenLight} strokeWidth="2"/><circle cx="17" cy="15" r="1.5" fill={C.greenLight}/></svg>
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>M-Pesa Balance</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                {showBal ? "TZS 142,500" : "TZS •••,•••"}
              </div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{showBal ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/><path d="M1 1l22 22" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/></>}</svg>
            </div>
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "20px 20px 100px", background: C.bg }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          <button onClick={onReceive} style={{ flex: 1, padding: "24px 16px", background: gradient.green, border: "none", borderRadius: 22, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: "0 8px 28px #2C8C4A33" }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Pokea</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Receive</div>
          </button>
          <button onClick={() => {}} style={{ flex: 1, padding: "24px 16px", background: gradient.navy, border: "none", borderRadius: 22, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: "0 8px 28px #1E276133" }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Tuma</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Send</div>
          </button>
        </div>
        <div style={{ padding: "18px", background: C.white, borderRadius: 20, border: "1px solid " + C.gray100, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <AIPill label="AI Protected" size="md" />
            <span style={{ fontSize: 12, color: C.gray500, fontWeight: 500 }}>Every transaction secured</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ icon: "🎤", label: "Voice ID", sub: "Biometric" }, { icon: "🛡️", label: "Anomaly AI", sub: "Detection" }, { icon: "🔊", label: "Audio", sub: "Receipt" }].map((f, i) => (
              <div key={i} style={{ flex: 1, padding: "12px 8px", background: C.gray50, borderRadius: 14, textAlign: "center", border: "1px solid " + C.gray100 }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{f.label}</div>
                <div style={{ fontSize: 9, color: C.gray400 }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "16px 18px", background: C.white, borderRadius: 18, border: "1px solid " + C.gray100, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.green, fontSize: 18, fontWeight: 800 }}>+</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>TZS 8,500</div>
            <div style={{ fontSize: 11, color: C.gray500 }}>Fatuma K. · Jana 14:32</div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }}/>
        </div>
      </div>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
};

// ──────────── SCREEN 2: RECEIVE ────────────

const ReceiveScreen = ({ onBack, onConfirm }) => {
  const [amount, setAmount] = useState("");
  const handleKey = (k) => {
    if (k === "C") setAmount("");
    else if (k === "⌫") setAmount(a => a.slice(0, -1));
    else if (amount.length < 8) setAmount(a => a + k);
  };
  const fmt = amount ? parseInt(amount).toLocaleString() : "0";
  const hasAmt = amount.length > 0;
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: gradient.navy, borderRadius: "0 0 28px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(44,140,74,0.08)" }}/>
        <StatusBar />
        <AppHeader title="Pokea Malipo" subtitle="Receive Payment" onBack={onBack} />
        <div style={{ padding: "8px 24px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginBottom: 6 }}>Ingiza kiasi · Enter amount</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>TZS</span>
            <span style={{ fontSize: 44, fontWeight: 800, color: hasAmt ? "#fff" : "rgba(255,255,255,0.2)", fontVariantNumeric: "tabular-nums", letterSpacing: 1, transition: "color 0.2s", textShadow: hasAmt ? "0 0 30px #D4A84344" : "none" }}>{fmt}</span>
          </div>
          {hasAmt && <div style={{ marginTop: 6, display: "inline-flex", padding: "4px 12px", background: C.green + "22", borderRadius: 20, fontSize: 11, color: C.greenLight, fontWeight: 600 }}>≈ USD {(parseInt(amount) / 2650).toFixed(2)}</div>}
        </div>
      </div>
      <div style={{ flex: 1, padding: "20px 24px", background: C.bg, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, flex: 1, maxHeight: 340 }}>
          {["1","2","3","4","5","6","7","8","9","C","0","⌫"].map(k => (
            <button key={k} onClick={() => handleKey(k)} style={{
              fontSize: k === "C" || k === "⌫" ? 16 : 26, fontWeight: 700, border: "none", borderRadius: 16, cursor: "pointer",
              background: k === "C" ? C.redSoft : k === "⌫" ? C.gray50 : C.white,
              color: k === "C" ? C.red : k === "⌫" ? C.gray500 : C.navy,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "transform 0.1s",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >{k}</button>
          ))}
        </div>
        <button onClick={() => hasAmt && onConfirm(amount)} disabled={!hasAmt} style={{
          marginTop: 16, padding: "18px", width: "100%", background: hasAmt ? gradient.green : C.gray200,
          color: "#fff", border: "none", borderRadius: 18, fontSize: 17, fontWeight: 800,
          cursor: hasAmt ? "pointer" : "default", boxShadow: hasAmt ? "0 6px 24px #2C8C4A44" : "none",
          transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <span>Thibitisha</span><span style={{ opacity: 0.7, fontSize: 13, fontWeight: 500 }}>· Confirm</span>
          {hasAmt && <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>
      </div>
    </div>
  );
};

// ──────────── SCREEN 3: VOICE AUTH ────────────

const VoiceAuthScreen = ({ onBack, onVerified, amount }) => {
  const [phase, setPhase] = useState("calling");
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase("speaking"), 2800); return () => clearTimeout(t); }, []);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 120); return () => clearInterval(iv); }, []);
  const handleSpeak = () => { setPhase("processing"); setTimeout(() => onVerified(), 2200); };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: gradient.navy, position: "relative", overflow: "hidden" }}>
      {[0,1,2].map(i => (<div key={i} style={{ position: "absolute", top: "35%", left: "50%", width: 250 + i * 100, height: 250 + i * 100, borderRadius: "50%", border: "1px solid rgba(212,168,67," + (0.04 + ((tick + i * 3) % 8) * 0.015) + ")", transform: "translate(-50%, -50%)", transition: "border-color 0.3s" }}/>))}
      <StatusBar />
      <AppHeader title="Uthibitishaji wa Sauti" subtitle="Voice Authentication" onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 28, position: "relative", zIndex: 1 }}>
        <AIPill label="AI Voice Biometric Engine" size="md" />
        <div style={{ position: "relative", width: 120, height: 120 }}>
          {[0,1,2].map(i => (<div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 70 + i * 28, height: 70 + i * 28, borderRadius: "50%", border: "2px solid " + C.gold, opacity: phase === "calling" ? 0.08 + ((tick + i * 2) % 5) * 0.08 : phase === "speaking" ? 0.06 + Math.abs(Math.sin((tick + i * 4) * 0.12)) * 0.25 : 0.06, transform: "translate(-50%, -50%)", transition: "opacity 0.2s" }}/>))}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(" + (phase === "speaking" ? 1 + Math.sin(tick * 0.15) * 0.06 : 1) + ")", width: 64, height: 64, borderRadius: 20, background: gradient.gold, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px #D4A84344", transition: "transform 0.2s" }}>
            {phase === "calling" ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#1E2761" strokeWidth="2"/></svg> : phase === "speaking" ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="9" y="1" width="6" height="12" rx="3" stroke="#1E2761" strokeWidth="2"/><path d="M19 10v1a7 7 0 01-14 0v-1" stroke="#1E2761" strokeWidth="2" strokeLinecap="round"/><path d="M12 19v4M8 23h8" stroke="#1E2761" strokeWidth="2" strokeLinecap="round"/></svg> : <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 2l1.5 3.5L17 7l-3.5 1.5L12 12l-1.5-3.5L7 7l3.5-1.5L12 2z" fill="#1E2761" opacity=".8"/></svg>}
          </div>
        </div>
        {phase === "speaking" && (
          <div style={{ display: "flex", alignItems: "center", gap: 2.5, height: 44 }}>
            {Array.from({ length: 32 }, (_, i) => { const h = 6 + Math.abs(Math.sin((tick * 0.25) + i * 0.55)) * 34; return (<div key={i} style={{ width: 3, borderRadius: 3, background: "linear-gradient(to top, #D4A843, #E8D08A)", height: h, transition: "height 0.12s ease", opacity: 0.5 + (h / 40) * 0.5 }}/>); })}
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          {phase === "calling" && (<><div style={{ fontSize: 22, fontWeight: 800, color: C.gold, marginBottom: 6 }}>Sauti inakupigia...</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Sauti is calling you...</div><div style={{ marginTop: 20, padding: "12px 20px", background: "rgba(255,255,255,0.06)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}><div style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>📱 IVR Callback via GSM Network</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Works without internet · 2G/3G compatible</div></div></>)}
          {phase === "speaking" && (<><div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Sema · Say:</div><div style={{ fontSize: 26, fontWeight: 800, color: "#fff", padding: "18px 28px", background: "rgba(212,168,67,0.12)", borderRadius: 20, border: "1.5px solid " + C.gold + "44", fontStyle: "italic" }}>"Jua linapanda"</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>"The sun is rising"</div><button onClick={handleSpeak} style={{ marginTop: 24, padding: "16px 36px", background: gradient.gold, color: C.navy, border: "none", borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 24px #D4A84344", display: "flex", alignItems: "center", gap: 10 }}>🎤 Done Speaking</button></>)}
          {phase === "processing" && (<><div style={{ fontSize: 20, fontWeight: 800, color: C.gold, marginBottom: 6 }}>AI Analyzing Voiceprint...</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Deep neural network matching</div><div style={{ marginTop: 20, display: "flex", gap: 6, justifyContent: "center" }}>{[0,1,2,3,4].map(i => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, opacity: Math.abs(((tick * 0.4) % 5) - i) < 1 ? 1 : 0.2, transition: "opacity 0.2s" }}/>))}</div></>)}
        </div>
        <div style={{ padding: "12px 18px", background: "rgba(255,255,255,0.05)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", width: "100%", maxWidth: 280 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: 1.5, marginBottom: 8 }}>AI PIPELINE</div>
          {[{ label: "Voice Capture", done: phase !== "calling" }, { label: "Neural Voiceprint Match", done: phase === "processing" }, { label: "Anti-Spoofing Check", done: false }].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: s.done ? C.green : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", transition: "all 0.5s" }}>{s.done ? "✓" : ""}</div>
              <span style={{ fontSize: 11, color: s.done ? C.greenLight : "rgba(255,255,255,0.3)", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ──────────── SCREEN 4: VERIFIED ────────────

const VerifiedScreen = ({ onContinue }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); setTimeout(() => onContinue(), 3000); }, []);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: gradient.navy, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "40%", left: "50%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #2C8C4A22 0%, transparent 70%)", transform: "translate(-50%, -50%)", opacity: show ? 1 : 0, transition: "opacity 1s" }}/>
      <div style={{ width: 110, height: 110, borderRadius: 30, background: gradient.green, display: "flex", alignItems: "center", justifyContent: "center", transform: show ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)", transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)", boxShadow: "0 12px 48px #2C8C4A55", position: "relative", zIndex: 1 }}>
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{ marginTop: 28, fontSize: 26, fontWeight: 800, color: C.gold, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.3s", position: "relative", zIndex: 1 }}>Sauti Imethibitisha</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 6, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.5s" }}>Voice Verified Successfully</div>
      <div style={{ marginTop: 32, padding: "16px 28px", background: "rgba(44,140,74,0.12)", borderRadius: 18, border: "1px solid " + C.green + "33", opacity: show ? 1 : 0, transition: "opacity 0.5s 0.7s", display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
        <AIPill label="AI Confidence" />
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><span style={{ fontSize: 28, fontWeight: 800, color: C.greenLight }}>97.3</span><span style={{ fontSize: 14, color: C.greenLight, fontWeight: 600 }}>%</span></div>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.green, boxShadow: "0 0 12px " + C.green + "88" }}/>
      </div>
    </div>
  );
};

// ──────────── SCREEN 5: ANOMALY ────────────

const AnomalyScreen = ({ onContinue }) => {
  const [phase, setPhase] = useState("checking");
  const [showAlt, setShowAlt] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => { if (phase === "checking") { const iv = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 50); const t = setTimeout(() => setPhase("result"), 2600); return () => { clearInterval(iv); clearTimeout(t); }; } }, [phase]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ background: gradient.navy, paddingBottom: 20, borderRadius: "0 0 28px 28px" }}><StatusBar /><AppHeader title="Ukaguzi wa AI" subtitle="AI Security Check" /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, overflow: "auto" }}>
        {phase === "checking" ? (<>
          <AIPill label="Anomaly Detection Engine v2.1" size="md" />
          <div style={{ marginTop: 28, width: 100, height: 100, borderRadius: 28, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", position: "relative" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v5c0 5-3 9.5-7 11-4-1.5-7-6-7-11V6l7-4z" stroke={C.navy} strokeWidth="2" fill={C.navy + "11"}/></svg>
            <div style={{ position: "absolute", inset: -4, borderRadius: 32, border: "3px solid " + C.navy + "22", borderTopColor: C.navy, animation: "aSpin 1.2s linear infinite" }}/>
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}><div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>Inakagua usalama...</div><div style={{ fontSize: 12, color: C.gray500, marginTop: 4 }}>Checking transaction safety</div></div>
          <div style={{ marginTop: 24, width: "100%", maxWidth: 260 }}>
            <div style={{ width: "100%", height: 6, background: C.gray100, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", background: gradient.navy, borderRadius: 4, width: progress + "%", transition: "width 0.1s" }}/></div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {[{ label: "Transaction pattern analysis", pct: 35 }, { label: "Behavioral biometric check", pct: 65 }, { label: "Network fraud correlation", pct: 90 }].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: progress > s.pct ? C.green : C.gray200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", transition: "all 0.3s" }}>{progress > s.pct ? "✓" : ""}</div>
                  <span style={{ fontSize: 11, color: progress > s.pct ? C.dark : C.gray400, fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>) : !showAlt ? (<>
          <div style={{ width: 100, height: 100, borderRadius: 28, background: C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid " + C.green + "33", boxShadow: "0 8px 32px " + C.green + "22" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v5c0 5-3 9.5-7 11-4-1.5-7-6-7-11V6l7-4z" fill={C.greenSoft} stroke={C.green} strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}><AIPill label="AI Risk Score" /><span style={{ fontSize: 24, fontWeight: 800, color: C.green }}>LOW</span></div>
          <div style={{ fontSize: 14, color: C.gray500, marginTop: 6 }}>Hatari ya muamala: Chini</div>
          <div style={{ marginTop: 24, padding: "16px 20px", background: C.white, borderRadius: 18, border: "1px solid " + C.gray100, width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.gray400, letterSpacing: 1.5, marginBottom: 12 }}>AI RISK ANALYSIS</div>
            {[{ label: "Amount Pattern", score: 92, color: C.green }, { label: "Location Trust", score: 88, color: C.green }, { label: "Time Anomaly", score: 95, color: C.green }, { label: "Counterparty History", score: 78, color: C.gold }].map((item, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{item.label}</span><span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.score}%</span></div>
                <div style={{ height: 5, background: C.gray100, borderRadius: 4 }}><div style={{ height: "100%", width: item.score + "%", background: item.color, borderRadius: 4, transition: "width 0.8s" }}/></div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowAlt(true)} style={{ marginTop: 16, padding: "10px 20px", background: C.redSoft, border: "1px solid " + C.red + "22", borderRadius: 12, fontSize: 12, color: C.red, cursor: "pointer", fontWeight: 600 }}>⚠ Preview "High Risk" state</button>
          <button onClick={onContinue} style={{ marginTop: 10, padding: "14px 32px", background: gradient.green, color: "#fff", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 24px " + C.green + "33" }}>Continue →</button>
        </>) : (<>
          <div style={{ width: 100, height: 100, borderRadius: 28, background: C.redSoft, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid " + C.red + "33", boxShadow: "0 8px 32px " + C.red + "22" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v5c0 5-3 9.5-7 11-4-1.5-7-6-7-11V6l7-4z" fill={C.redSoft} stroke={C.red} strokeWidth="2"/><path d="M12 8v4M12 15h.01" stroke={C.red} strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}><AIPill label="AI Risk Score" /><span style={{ fontSize: 24, fontWeight: 800, color: C.red }}>HIGH</span></div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.red, marginTop: 6 }}>Shughuli isiyo ya kawaida!</div>
          <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>Unusual activity detected — Transaction paused</div>
          <div style={{ marginTop: 20, padding: "16px", background: C.redSoft, borderRadius: 16, border: "1px solid " + C.red + "22", width: "100%" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 8 }}>⚠ Reasons flagged:</div>
            {["Unusual time (2:14 AM)", "Unknown counterparty", "Amount 5x above average"].map((r, i) => (<div key={i} style={{ fontSize: 12, color: C.gray600, padding: "4px 0" }}>• {r}</div>))}
          </div>
          <button onClick={() => setShowAlt(false)} style={{ marginTop: 20, padding: "12px 24px", background: C.white, border: "1px solid " + C.gray200, borderRadius: 14, fontSize: 13, color: C.navy, cursor: "pointer", fontWeight: 600 }}>← Back to "Low Risk"</button>
        </>)}
      </div>
      <style>{"@keyframes aSpin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
};

// ──────────── SCREEN 6: AUDIO RECEIPT ────────────

const AudioReceiptScreen = ({ onBack, onDone, amount }) => {
  const [activeTone, setActiveTone] = useState(-1);
  const [playing, setPlaying] = useState(true);
  const tones = [{ color: C.gold, label: "ID" }, { color: C.green, label: "AMT" }, { color: C.navy, label: "SIG" }];
  useEffect(() => { if (playing) { let i = 0; const iv = setInterval(() => { setActiveTone(i); i++; if (i > 3) { clearInterval(iv); setActiveTone(-1); setPlaying(false); } }, 500); return () => clearInterval(iv); } }, [playing]);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: gradient.navy, borderRadius: "0 0 28px 28px" }}><StatusBar /><AppHeader title="Stakabadhi ya Sauti" subtitle="Audio Receipt" onBack={onBack} /><div style={{ padding: "4px 24px 24px", textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 800, color: C.greenLight }}>✓ Malipo yamethibitishwa!</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Payment confirmed!</div></div></div>
      <div style={{ flex: 1, overflow: "auto", padding: "20px 20px 24px", background: C.bg }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {["Muuzaji (Seller)", "Mnunuzi (Buyer)"].map((label, side) => (
            <div key={side} style={{ flex: 1, padding: "18px 12px", background: C.white, borderRadius: 18, textAlign: "center", border: "1px solid " + C.gray100, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 12 }}>{label}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                {tones.map((t, i) => (<div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><div style={{ width: 30, height: 30, borderRadius: 10, background: activeTone >= i ? t.color : C.gray100, transition: "all 0.3s", transform: activeTone === i ? "scale(1.2)" : "scale(1)", boxShadow: activeTone === i ? "0 0 20px " + t.color + "55" : "none" }}/><span style={{ fontSize: 8, color: C.gray400, fontWeight: 600 }}>{t.label}</span></div>))}
              </div>
              <div style={{ fontSize: 9, color: playing ? C.gold : C.green, marginTop: 8, fontWeight: 600 }}>{playing ? "♪ Playing..." : "✓ Match"}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", background: C.navy + "08", borderRadius: 14, border: "1px solid " + C.navy + "12", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}><AIPill label="AI-Generated Audio Receipt" /><span style={{ fontSize: 10, color: C.gray500 }}>Unique 3-tone cryptographic signature</span></div>
        <div style={{ padding: "18px", background: C.white, borderRadius: 18, border: "1px solid " + C.gray100, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          {[{ sw: "Kiasi", en: "Amount", val: "TZS " + (amount ? parseInt(amount).toLocaleString() : "15,000"), bold: true }, { sw: "Kutoka", en: "From", val: "Juma M. (+255 765...)" }, { sw: "Kwenda", en: "To", val: "Amina H. (+255 712...)" }, { sw: "Wakati", en: "Time", val: "Leo 10:34" }, { sw: "ID", en: "Transaction", val: "STI-2026-0328-4A7F" }].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 4 ? "1px solid " + C.gray50 : "none" }}>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{item.sw}</div><div style={{ fontSize: 9, color: C.gray400 }}>{item.en}</div></div>
              <div style={{ fontSize: item.bold ? 18 : 13, fontWeight: item.bold ? 800 : 600, color: C.dark }}>{item.val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setPlaying(true)} style={{ flex: 1, padding: "14px", background: C.white, border: "1.5px solid " + C.navy + "22", borderRadius: 16, fontSize: 14, fontWeight: 700, cursor: "pointer", color: C.navy }}>🔊 Play again</button>
          <button onClick={onDone} style={{ flex: 1, padding: "14px", background: gradient.green, border: "none", borderRadius: 16, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#fff", boxShadow: "0 4px 16px " + C.green + "33" }}>Maliza ✓</button>
        </div>
      </div>
    </div>
  );
};

// ──────────── SCREEN 7: HISTORY ────────────

const HistoryScreen = ({ onBack }) => {
  const txs = [
    { amt: "+15,000", name: "Juma M.", time: "Leo 10:34", ok: true, type: "in" },
    { amt: "+8,500", name: "Fatuma K.", time: "Jana 14:32", ok: true, type: "in" },
    { amt: "-22,000", name: "Hassan A.", time: "Jana 09:15", ok: true, type: "out" },
    { amt: "+5,200", name: "Baraka S.", time: "25/03 16:45", ok: false, type: "in" },
    { amt: "+12,000", name: "Zainabu W.", time: "24/03 11:20", ok: true, type: "in" },
    { amt: "-45,000", name: "Namba isiyojulikana", time: "23/03 02:14", ok: false, type: "out" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: gradient.navy, borderRadius: "0 0 28px 28px" }}><StatusBar /><AppHeader title="Historia ya Muamala" subtitle="Transaction History" onBack={onBack} /></div>
      <div style={{ flex: 1, overflow: "auto", padding: "16px 20px 100px", background: C.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: C.redSoft, borderRadius: 14, border: "1px solid " + C.red + "22", marginBottom: 14 }}>
          <AIPill label="AI Flagged" /><span style={{ fontSize: 12, fontWeight: 600, color: C.red }}>2 suspicious transactions</span>
        </div>
        {txs.map((tx, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", marginBottom: 8, background: C.white, borderRadius: 16, border: "1px solid " + (tx.ok ? C.gray100 : C.red + "22"), boxShadow: "0 1px 4px rgba(0,0,0,0.02)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: tx.ok ? C.greenSoft : C.redSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: tx.ok ? C.green : C.red, fontWeight: 800 }}>{tx.ok ? "✓" : "!"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: tx.type === "in" ? C.green : C.navy }}>TZS {tx.amt}</div>
              <div style={{ fontSize: 12, color: C.dark, marginTop: 1 }}>{tx.name}</div>
              <div style={{ fontSize: 10, color: C.gray400, marginTop: 1 }}>{tx.time}</div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: C.gray50, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke={C.gray400} strokeWidth="2"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke={C.gray400} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="history" onNavigate={() => onBack()} />
    </div>
  );
};

// ──────────── SCREEN 8: OFFLINE ────────────

const OfflineScreen = ({ onBack }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ background: gradient.navy, borderRadius: "0 0 28px 28px" }}>
      <StatusBar />
      <div style={{ margin: "0 16px 8px", padding: "10px 16px", background: C.gold + "18", borderRadius: 12, border: "1px solid " + C.gold + "33", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 1l22 22" stroke={C.gold} strokeWidth="2" strokeLinecap="round"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke={C.gold} strokeWidth="2" strokeLinecap="round"/></svg>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>Hali ya nje ya mtandao</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Offline mode · GSM only</div></div>
      </div>
      <AppHeader title="Offline Mode" subtitle="Hali ya Nje ya Mtandao" onBack={onBack} />
    </div>
    <div style={{ flex: 1, overflow: "auto", padding: "16px 20px 24px", background: C.bg }}>
      <div style={{ padding: "18px", background: C.white, borderRadius: 20, border: "1px solid " + C.gray100, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><AIPill label="AI Services Status" size="md" /></div>
        {[{ icon: "🎤", sw: "Uthibitishaji wa sauti (GSM)", en: "Voice auth via GSM", ok: true }, { icon: "🔊", sw: "Stakabadhi za sauti", en: "Audio receipts (local)", ok: true }, { icon: "🛡️", sw: "AI Anomaly (cached)", en: "Cached ML model", ok: true }, { icon: "📶", sw: "Usawazishaji wa data", en: "Data sync", ok: false }].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 3 ? "1px solid " + C.gray50 : "none" }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{s.sw}</div><div style={{ fontSize: 10, color: C.gray400 }}>{s.en}</div></div>
            <div style={{ padding: "4px 10px", borderRadius: 8, background: s.ok ? C.greenSoft : C.redSoft, fontSize: 11, fontWeight: 700, color: s.ok ? C.green : C.red }}>{s.ok ? "Active" : "Paused"}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Queued Transactions</div>
      <div style={{ fontSize: 11, color: C.gray400, marginBottom: 12 }}>Will sync automatically when online</div>
      {[{ amt: "7,200", name: "Saidi B.", time: "10:52" }, { amt: "3,500", name: "Rehema J.", time: "11:05" }].map((tx, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 8, background: C.white, borderRadius: 16, border: "1.5px dashed " + C.gold + "55" }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: C.gold + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.gold} strokeWidth="2"/><path d="M12 7v5l3 3" stroke={C.gold} strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>TZS {tx.amt}</div><div style={{ fontSize: 12, color: C.dark }}>{tx.name} · {tx.time}</div></div>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.gold }}>Inasubiri</span>
        </div>
      ))}
    </div>
  </div>
);

// ──────────── MAIN ────────────

export default function SautiDemo() {
  const [screen, setScreen] = useState("home");
  const [amount, setAmount] = useState("");
  const goHome = () => setScreen("home");
  const handleNav = useCallback((id) => { if (id === "home") setScreen("home"); else if (id === "history") setScreen("history"); else if (id === "security") setScreen("offline"); }, []);
  const screens = [{ id: "home", label: "Home", icon: "🏠" }, { id: "receive", label: "Receive", icon: "💰" }, { id: "voiceauth", label: "Voice AI", icon: "🎤" }, { id: "verified", label: "Verified", icon: "✓" }, { id: "anomaly", label: "Anomaly AI", icon: "🛡️" }, { id: "receipt", label: "Receipt", icon: "🔊" }, { id: "history", label: "History", icon: "📋" }, { id: "offline", label: "Offline", icon: "📡" }];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(160deg, #E8E5DE 0%, #D5D2CB 100%)", padding: "12px 0", fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 500 }}>
        {screens.map(s => (<button key={s.id} onClick={() => setScreen(s.id)} style={{ padding: "5px 12px", fontSize: 11, fontWeight: 700, background: screen === s.id ? C.navy : "rgba(255,255,255,0.7)", color: screen === s.id ? C.gold : C.navy, border: "none", borderRadius: 8, cursor: "pointer", boxShadow: screen === s.id ? "0 2px 12px " + C.navy + "44" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}>{s.icon} {s.label}</button>))}
      </div>
      <div style={{ width: 375, height: 812, borderRadius: 44, overflow: "hidden", boxShadow: "0 30px 80px rgba(30,39,97,0.3), 0 0 0 1px rgba(0,0,0,0.1)", position: "relative", border: "10px solid #111", background: C.bg }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 150, height: 28, background: "#111", borderRadius: "0 0 20px 20px", zIndex: 100 }}/>
        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
          {screen === "home" && <HomeScreen onNavigate={handleNav} onReceive={() => setScreen("receive")} />}
          {screen === "receive" && <ReceiveScreen onBack={goHome} onConfirm={(a) => { setAmount(a); setScreen("voiceauth"); }} />}
          {screen === "voiceauth" && <VoiceAuthScreen onBack={() => setScreen("receive")} onVerified={() => setScreen("verified")} amount={amount} />}
          {screen === "verified" && <VerifiedScreen onContinue={() => setScreen("anomaly")} />}
          {screen === "anomaly" && <AnomalyScreen onContinue={() => setScreen("receipt")} />}
          {screen === "receipt" && <AudioReceiptScreen onBack={goHome} onDone={goHome} amount={amount} />}
          {screen === "history" && <HistoryScreen onBack={goHome} />}
          {screen === "offline" && <OfflineScreen onBack={goHome} />}
        </div>
      </div>
      <div style={{ marginTop: 14, textAlign: "center", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.gray500 }}>
        <span style={{ fontWeight: 800, color: C.navy, letterSpacing: 3, fontSize: 14 }}>SAUTI</span>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, display: "inline-block" }}/>
        <span>AI-Powered Voice Payments</span>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, display: "inline-block" }}/>
        <span style={{ color: C.gold, fontWeight: 600 }}>KSU FinTech 2026</span>
      </div>
    </div>
  );
}
