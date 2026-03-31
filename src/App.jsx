import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #e8ff00; border-radius: 2px; }

  .nav-link {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: 13px;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: #888; text-decoration: none;
    transition: color 0.2s; position: relative; cursor: pointer;
    background: none; border: none; padding: 0;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: -4px; left: 0;
    width: 0; height: 2px; background: #e8ff00; transition: width 0.3s ease;
  }
  .nav-link:hover, .nav-link.active { color: #f0ece4; }
  .nav-link:hover::after, .nav-link.active::after { width: 100%; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: #e8ff00; color: #0a0a0a;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 14px;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 14px 32px; text-decoration: none; border: none; cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%);
  }
  .btn-primary:hover { background: #f0ece4; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(232,255,0,0.3); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 10px;
    background: transparent; color: #f0ece4;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: 14px;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 13px 30px; text-decoration: none; border: 1.5px solid #444; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline:hover { border-color: #e8ff00; color: #e8ff00; transform: translateY(-2px); }

  .service-card {
    background: #111; border: 1px solid #222; padding: 28px;
    position: relative; overflow: hidden; transition: all 0.3s; cursor: pointer;
  }
  .service-card::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 3px; height: 0; background: #e8ff00; transition: height 0.4s ease;
  }
  .service-card:hover { border-color: #333; transform: translateY(-4px); background: #151515; }
  .service-card:hover::before { height: 100%; }

  .why-card { border: 1px solid #1e1e1e; background: #0f0f0f; padding: 32px 28px; transition: all 0.3s; }
  .why-card:hover { border-color: #e8ff00; background: #111; }

  .contact-input {
    width: 100%; background: #111; border: 1.5px solid #222;
    color: #f0ece4; font-family: 'Barlow', sans-serif; font-size: 15px;
    padding: 14px 18px; outline: none; transition: border-color 0.2s;
  }
  .contact-input::placeholder { color: #555; }
  .contact-input:focus { border-color: #e8ff00; }

  .tag {
    font-family: 'Barlow Condensed', sans-serif; font-size: 11px;
    font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase;
    color: #e8ff00; margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .tag::before { content: ''; width: 28px; height: 2px; background: #e8ff00; display: inline-block; }

  .marquee-track {
    display: flex; gap: 48px; animation: marquee 18s linear infinite; white-space: nowrap;
  }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .svc-detail-card {
    border: 1px solid #1e1e1e; background: #0d0d0d;
    transition: all 0.35s; position: relative; overflow: hidden; cursor: pointer;
  }
  .svc-detail-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; background: #e8ff00; transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s ease;
  }
  .svc-detail-card:hover { border-color: #333; background: #111; transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
  .svc-detail-card:hover::after { transform: scaleX(1); }

  .svc-hero-bg {
    background: radial-gradient(ellipse at 70% 50%, rgba(232,255,0,0.07) 0%, transparent 60%),
                linear-gradient(rgba(232,255,0,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(232,255,0,0.025) 1px, transparent 1px);
    background-size: auto, 60px 60px, 60px 60px;
  }

  .fade-in { animation: fadeUp 0.7s ease both; }
  .fade-in-2 { animation: fadeUp 0.7s ease 0.15s both; }
  .fade-in-3 { animation: fadeUp 0.7s ease 0.3s both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  .benefit-row:hover { background: #111 !important; }
  .other-svc-row:hover { color: #e8ff00; }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "strength-training", num: "01", icon: "🏋️",
    title: "Strength Training",
    tagline: "Build raw power. Lift heavier. Live stronger.",
    short: "Full equipment for compound and isolation exercises across all major muscle groups.",
    description: "Our strength training zone is the heart of AIM FITNESS GYM. Equipped with barbells, dumbbells, power racks, cable machines, and plate-loaded equipment — everything you need to get stronger week by week. Whether you follow a PPL split, StrongLifts, or your own program, we have what it takes.",
    benefits: ["Progressive overload tools", "Full barbell & dumbbell range", "Power racks & benches", "Cable & pulley machines", "Isolation & compound options", "Suitable for all experience levels"],
    ideal: "Anyone looking to build muscle, increase strength, or improve body composition.",
    sessions: "Any time — open gym format",
  },
  {
    id: "cardio", num: "02", icon: "🏃",
    title: "Cardio Workouts",
    tagline: "Burn it. Build endurance. Feel unstoppable.",
    short: "Treadmills, cycles, and cardio equipment to build endurance and burn calories.",
    description: "Our cardio zone features modern treadmills, upright and recumbent cycles, cross trainers, and more. Whether you prefer steady-state cardio, HIIT intervals, or a warm-up before lifting — our cardio equipment keeps you moving and burning.",
    benefits: ["Treadmills with incline control", "Upright & recumbent cycles", "Cross trainers / ellipticals", "Interval training friendly", "Heart rate monitoring", "Cool-down zone"],
    ideal: "Members focused on fat loss, cardiovascular health, or endurance improvement.",
    sessions: "Open anytime during gym hours",
  },
  {
    id: "weight-management", num: "03", icon: "⚖️",
    title: "Weight Management",
    tagline: "Smart training. Real results. Lasting change.",
    short: "Structured programs and guidance to help you reach and maintain your ideal weight.",
    description: "Weight management is a combination of resistance training, metabolic conditioning, and consistency. At AIM FITNESS, we guide members to combine smart workouts for effective fat loss or healthy weight gain, depending on your goal.",
    benefits: ["Fat loss programming", "Healthy weight gain support", "Metabolic conditioning", "Resistance + cardio combo", "Progress-focused approach", "Guidance from experienced staff"],
    ideal: "Members who want to lose fat, gain healthy weight, or maintain their physique.",
    sessions: "Flexible — self-paced or guided",
  },
  {
    id: "muscle-building", num: "04", icon: "💪",
    title: "Muscle Building",
    tagline: "Volume. Tension. Growth. Repeat.",
    short: "High-resistance equipment and progressive overload tools for serious muscle development.",
    description: "Hypertrophy training requires the right equipment and environment. Our gym provides everything needed for serious muscle building — from heavy compound lifts to high-rep isolation exercises, pre-exhaust techniques, and drop sets.",
    benefits: ["Heavy free weights & machines", "Dedicated dumbbell range", "Plate-loaded equipment", "Isolation machines for all groups", "Supportive training culture", "Space to train without rush"],
    ideal: "Anyone focused on bodybuilding, physique competition, or maximizing muscle size.",
    sessions: "Open gym — structure your own hypertrophy split",
  },
  {
    id: "general-fitness", num: "05", icon: "🎯",
    title: "General Fitness",
    tagline: "Stay active. Stay healthy. Stay consistent.",
    short: "A complete fitness experience for those focused on overall health and daily activity.",
    description: "Not everyone trains for aesthetics or competition — many members just want to feel better, move better, and be healthier. AIM FITNESS is a clean, welcoming space where you can work out at your own pace and build lifelong healthy habits.",
    benefits: ["Welcoming to all fitness levels", "Full equipment access", "No pressure environment", "Flexible workout structure", "Consistent community", "Easy to build a daily habit"],
    ideal: "Anyone who wants to be active, improve health, or feel better in daily life.",
    sessions: "Drop in any time — no fixed program required",
  },
  {
    id: "beginner-programs", num: "06", icon: "🔰",
    title: "Beginner Programs",
    tagline: "Your first rep. Your first win. We're with you.",
    short: "Step-by-step orientation for new members so you can start confidently and safely.",
    description: "Starting a gym routine can feel overwhelming. At AIM FITNESS, we make sure every new member gets a proper introduction to the equipment, understands basic form, and has a starting plan. Our experienced members and staff are always ready to help.",
    benefits: ["Equipment orientation", "Basic form guidance", "Beginner-friendly workout plans", "Zero intimidation policy", "Supportive community", "Gradual progression approach"],
    ideal: "First-time gym members or anyone returning after a long break.",
    sessions: "Orientation on joining — open gym thereafter",
  },
];

// ─── SHARED ───────────────────────────────────────────────────────────────────
function Navbar({ page, navigate, scrolled }) {
  const links = [
    { key: "home", label: "Home" },
    { key: "services", label: "Services" },
    { key: "home#about", label: "About" },
    { key: "home#why-us", label: "Why Us" },
    { key: "home#contact", label: "Contact" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #1a1a1a" : "none",
      transition: "all 0.4s",
    }}>
      <div onClick={() => navigate("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{ width: 8, height: 28, background: "#e8ff00", clipPath: "polygon(0 0, 60% 0, 100% 100%, 40% 100%)" }} />
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f0ece4" }}>
          AIM <span style={{ color: "#e8ff00" }}>FITNESS</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {links.map(({ key, label }) => (
          <button key={key} className={`nav-link ${page === key ? "active" : ""}`} onClick={() => navigate(key)}>{label}</button>
        ))}
        <a href="tel:8879451638" className="btn-primary" style={{ padding: "10px 22px", fontSize: 12 }}>Call Now</a>
      </div>
    </nav>
  );
}

function Marquee() {
  const items = ["Strength Training","Cardio Workouts","Muscle Building","Weight Management","Daily Fitness","Body Conditioning"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "#e8ff00", overflow: "hidden", padding: "14px 0" }}>
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <span key={i} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0a0a0a", display: "flex", alignItems: "center", gap: 48 }}>
            {t} <span style={{ opacity: 0.3, fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CTABand() {
  return (
    <div style={{ background: "#e8ff00", padding: "64px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
      <div>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,52px)", color: "#0a0a0a", textTransform: "uppercase", lineHeight: 1, marginBottom: 8 }}>Ready to Start Training?</p>
        <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 400, fontSize: 16, color: "#333" }}>Walk in, or call us to know about memberships.</p>
      </div>
      <a href="tel:8879451638" style={{ background: "#0a0a0a", color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "0.15em", textTransform: "uppercase", padding: "18px 40px", textDecoration: "none", clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 100%, 14px 100%)", whiteSpace: "nowrap" }}>
        📞 Call 8879451638
      </a>
    </div>
  );
}

function Footer({ navigate }) {
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid #1a1a1a", padding: "36px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <div onClick={() => navigate("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{ width: 6, height: 22, background: "#e8ff00", clipPath: "polygon(0 0, 60% 0, 100% 100%, 40% 100%)" }} />
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f0ece4" }}>AIM <span style={{ color: "#e8ff00" }}>FITNESS GYM</span></span>
      </div>
      <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 13, color: "#444" }}>Lokmanya Nagar, Thane West, Maharashtra 400606</p>
      <a href="tel:8879451638" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: "#e8ff00", textDecoration: "none", letterSpacing: "0.05em" }}>📞 8879451638</a>
    </footer>
  );
}

function Breadcrumb({ crumbs, navigate }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
      {crumbs.map((c, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {i < crumbs.length - 1
            ? <><span onClick={() => navigate(c.key)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: "#555", letterSpacing: "0.15em", cursor: "pointer", textTransform: "uppercase" }}>{c.label}</span><span style={{ color: "#333" }}>›</span></>
            : <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: "#e8ff00", letterSpacing: "0.15em", textTransform: "uppercase" }}>{c.label}</span>
          }
        </span>
      ))}
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.id]: true })); });
    }, { threshold: 0.12 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const r = (id) => (el) => { refs.current[id] = el; };
  const fi = (id) => ({ transition: "all 0.7s ease", opacity: visible[id] ? 1 : 0, transform: visible[id] ? "translateY(0)" : "translateY(28px)" });

  return (
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", background: "#0a0a0a", color: "#f0ece4" }}>

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 40px 100px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(232,255,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,255,0,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: "30%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle,rgba(232,255,0,0.07) 0%,transparent 70%)" }} />
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(100px,20vw,240px)", lineHeight: 0.85, letterSpacing: "-0.03em", color: "transparent", WebkitTextStroke: "1px rgba(232,255,0,0.12)", userSelect: "none", position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)" }}>GYM</div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }} className="fade-in">
          <div className="tag">Thane West · Lokmanya Nagar</div>
          <h1 style={{ 
  fontFamily: "'Barlow Condensed',sans-serif", 
  fontSize: "clamp(52px,10vw,120px)", 
  fontWeight: 900, 
  lineHeight: 0.9, 
  letterSpacing: "-0.02em", 
  textTransform: "uppercase", 
  marginBottom: 28,
  color: "#FFFFFF" // makes BUILT FOR & MADE FOR white
}}>
  BUILT FOR<br />
  <span style={{ color: "#D6FF00" }}>STRENGTH.</span><br />
  MADE FOR<br />
  <span style={{ WebkitTextStroke: "1px #FFFFFF", color: "transparent" }}>
    EVERYONE.
  </span>
</h1>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 18, lineHeight: 1.7, color: "#999", maxWidth: 520, marginBottom: 40 }}>
            AIM FITNESS GYM is Thane West's dedicated space for real training — from beginners taking their first step to regulars chasing their next goal.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="tel:8879451638" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              8879451638
            </a>
            <button onClick={() => navigate("services")} className="btn-outline">
              View Services <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid #1a1a1a", display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "rgba(10,10,10,0.7)", backdropFilter: "blur(8px)" }}>
          {[{ num: "100%", label: "Real Equipment" }, { num: "6 AM", label: "Opens Early" }, { num: "₹0", label: "Joining Fee*" }].map((s, i) => (
            <div key={i} style={{ padding: "20px 32px", borderRight: i < 2 ? "1px solid #1a1a1a" : "none", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, color: "#e8ff00" }}>{s.num}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Marquee />

      {/* ABOUT */}
      <section id="about" ref={r("about")} style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={fi("about")}>
            <div className="tag">About the Gym</div>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(40px,6vw,72px)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 28 }}>
              TRAIN<br />BETTER.<br /><span style={{ color: "#e8ff00" }}>STAY STRONG.</span>
            </h2>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: "#888", marginBottom: 18 }}>
              AIM FITNESS GYM is built for people who want a practical and motivating place to work on strength, endurance, body conditioning, and everyday fitness.
            </p>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: "#888", marginBottom: 36 }}>
              Whether you're starting your fitness journey or pushing your current limits, our gym gives you the right environment to stay active, disciplined, and goal-focused.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {[{ n: "500+", l: "Members" }, { n: "5+", l: "Years Active" }].map((s) => (
                <div key={s.l}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 48, color: "#e8ff00", letterSpacing: "-0.03em" }}>{s.n}</div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {SERVICES.map((s) => (
              <div key={s.id} className="service-card" onClick={() => navigate(`service/${s.id}`)}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, color: "#e8ff00", letterSpacing: "0.15em" }}>VIEW →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section id="services-section" ref={r("services")} style={{ background: "#0d0d0d", padding: "100px 40px", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div className="tag">Services</div>
              <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(36px,5vw,64px)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                WHAT WE<br /><span style={{ color: "#e8ff00" }}>OFFER</span>
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 15, color: "#666", maxWidth: 360, lineHeight: 1.7 }}>A full suite of fitness options tailored for all levels.</p>
              <button onClick={() => navigate("services")} className="btn-primary" style={{ clipPath: "none" }}>See All Services →</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#1a1a1a" }}>
            {SERVICES.map((s) => (
              <div key={s.id} style={{ background: "#0d0d0d", padding: "36px 32px", transition: "background 0.3s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#111"}
                onMouseLeave={e => e.currentTarget.style.background = "#0d0d0d"}
                onClick={() => navigate(`service/${s.id}`)}
              >
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 11, letterSpacing: "0.3em", color: "#e8ff00", marginBottom: 16 }}>{s.num}</div>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 16 }}>{s.short}</p>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, color: "#e8ff00", letterSpacing: "0.2em" }}>Learn More →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" ref={r("why")} style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="tag" style={{ justifyContent: "center" }}>Why Choose Us</div>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(36px,5vw,64px)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
              A LOCAL GYM WITH <span style={{ color: "#e8ff00" }}>REAL RESULTS</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {[
              { icon: "📍", title: "Prime Thane West Location", desc: "Right in front of TMC School in Lokmanya Nagar — easy commute, zero excuses." },
              { icon: "🔰", title: "Beginner Friendly", desc: "No intimidation. Our gym is welcoming to newcomers and supportive of every level." },
              { icon: "⚡", title: "High Energy Environment", desc: "A motivating atmosphere that keeps you pushing harder every single day." },
              { icon: "🎯", title: "Goal-Focused Training", desc: "Whether you want to lose weight, build muscle, or stay active — we support your specific aim." },
            ].map((c) => (
              <div key={c.title} className="why-card">
                <div style={{ fontSize: 36, marginBottom: 16 }}>{c.icon}</div>
                <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 15, color: "#666", lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand />

      {/* CONTACT */}
      <section id="contact" ref={r("contact")} style={{ padding: "100px 40px", background: "#080808" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <div className="tag">Contact</div>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(36px,5vw,60px)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 32 }}>
              COME FIND <span style={{ color: "#e8ff00" }}>US</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                { label: "Phone", value: "9594072062", link: "tel:9594072062", sub: "Call or WhatsApp for membership info" },
      { 
  label: "Email", 
  value: "rushirane07@gmail.com", 
  link: "mailto:rushirane07@gmail.com", 
  sub: "Send us an email for enquiries and support" 
},
                { label: "Address", value: "Lokmanya Nagar, Thane West", sub: "In front of TMC School, Pada No.2, Thane – 400606" },
                { label: "Area", value: "Thane West, Maharashtra", sub: "Serving the Lokmanya Nagar community" },
              ].map((item) => (
                <div key={item.label} style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: 24 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
                  {item.link
                    ? <a href={item.link} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 28, color: "#e8ff00", textDecoration: "none" }}>{item.value}</a>
                    : <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, color: "#f0ece4" }}>{item.value}</div>
                  }
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 14, color: "#555", marginTop: 4 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: "1px solid #1a1a1a", padding: 40 }}>
            <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 8 }}>Send a Message</h3>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 14, color: "#666", marginBottom: 32 }}>We'll get back to you about memberships or any queries.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="contact-input" type="text" placeholder="Your Name" />
              <input className="contact-input" type="tel" placeholder="Phone Number" />
              <select className="contact-input" defaultValue="">
                <option value="" disabled>I'm interested in...</option>
                <option>Monthly Membership</option>
                <option>Quarterly Membership</option>
                <option>Annual Membership</option>
                <option>Just visiting / Inquiry</option>
              </select>
              <textarea className="contact-input" placeholder="Any questions?" rows={4} style={{ resize: "none" }} />
              <button className="btn-primary" style={{ clipPath: "none", width: "100%", justifyContent: "center" }}>Send Enquiry →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── SERVICES LIST PAGE ───────────────────────────────────────────────────────
function ServicesPage({ navigate }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const TABLE = [
    { goal: "Power & Size", equip: "Barbells, Racks, Cables", best: "All levels" },
    { goal: "Endurance & Fat Burn", equip: "Treadmills, Cycles", best: "Weight loss, stamina" },
    { goal: "Body Composition", equip: "Full gym", best: "Fat loss / lean gain" },
    { goal: "Hypertrophy", equip: "Free weights, machines", best: "Intermediate–Advanced" },
    { goal: "Health & Activity", equip: "Full gym access", best: "Everyone" },
    { goal: "Foundation Skills", equip: "Full gym + guidance", best: "First-timers" },
  ];
  return (
    <div style={{ background: "#0a0a0a", color: "#f0ece4" }}>

      {/* Hero */}
      <section className="svc-hero-bg" style={{ padding: "140px 40px 80px", borderBottom: "1px solid #1a1a1a", position: "relative", overflow: "hidden" }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(80px,16vw,200px)", lineHeight: 0.85, color: "transparent", WebkitTextStroke: "1px rgba(232,255,0,0.08)", userSelect: "none", position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)" }}>SVC</div>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Breadcrumb crumbs={[{ key: "home", label: "Home" }, { label: "Services" }]} navigate={navigate} />
          <div className="tag fade-in">Our Offerings</div>
          <h1 className="fade-in" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(52px,9vw,100px)", lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 24 }}>
            ALL <span style={{ color: "#e8ff00" }}>SERVICES</span><br />AT AIM FITNESS
          </h1>
          <p className="fade-in-2" style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 18, color: "#888", maxWidth: 560, lineHeight: 1.7 }}>
            Six training disciplines under one roof in Lokmanya Nagar, Thane West. Every service is open to all members.
          </p>
        </div>
      </section>

      <Marquee />

      {/* Cards */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {SERVICES.map((s, i) => (
            <div key={s.id} className="svc-detail-card fade-in" style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => navigate(`service/${s.id}`)}
            >
              <div style={{ padding: "36px 32px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 11, letterSpacing: "0.3em", color: "#e8ff00" }}>{s.num}</span>
                  <span style={{ fontSize: 36 }}>{s.icon}</span>
                </div>
                <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontSize: 14, color: "#e8ff00", marginBottom: 14, letterSpacing: "0.03em" }}>{s.tagline}</p>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>{s.short}</p>
                <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 12, color: "#888", maxWidth: 160 }}>{s.ideal.split(".")[0]}</div>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 13, color: "#e8ff00", letterSpacing: "0.2em", whiteSpace: "nowrap" }}>DETAILS →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ background: "#0d0d0d", padding: "80px 40px", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="tag">Quick Comparison</div>
          <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(30px,4vw,52px)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 40 }}>
            FIND YOUR <span style={{ color: "#e8ff00" }}>BEST FIT</span>
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Barlow',sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e8ff00" }}>
                  {["Service", "Goal", "Equipment Used", "Best For", ""].map(h => (
                    <th key={h} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", textAlign: "left", padding: "14px 20px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #1a1a1a", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#111"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onClick={() => navigate(`service/${s.id}`)}
                  >
                    <td style={{ padding: "18px 20px", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, textTransform: "uppercase" }}>{s.icon} {s.title}</td>
                    <td style={{ padding: "18px 20px", fontSize: 14, color: "#888" }}>{TABLE[i].goal}</td>
                    <td style={{ padding: "18px 20px", fontSize: 14, color: "#888" }}>{TABLE[i].equip}</td>
                    <td style={{ padding: "18px 20px", fontSize: 14, color: "#888" }}>{TABLE[i].best}</td>
                    <td style={{ padding: "18px 20px" }}><span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 12, color: "#e8ff00", letterSpacing: "0.2em" }}>VIEW →</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  );
}

// ─── SERVICE DETAIL PAGE ──────────────────────────────────────────────────────
function ServiceDetailPage({ serviceId, navigate }) {
  const svc = SERVICES.find(s => s.id === serviceId);
  const others = SERVICES.filter(s => s.id !== serviceId);
  const related = others.slice(0, 3);
  useEffect(() => { window.scrollTo(0, 0); }, [serviceId]);

  if (!svc) return (
    <div style={{ padding: "200px 40px", textAlign: "center", color: "#666", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 32 }}>
      Not found. <span onClick={() => navigate("services")} style={{ color: "#e8ff00", cursor: "pointer" }}>← Back to Services</span>
    </div>
  );

  return (
    <div style={{ background: "#0a0a0a", color: "#f0ece4" }}>

      {/* Hero */}
      <section className="svc-hero-bg" style={{ padding: "140px 40px 80px", borderBottom: "1px solid #1a1a1a", position: "relative", overflow: "hidden" }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(80px,14vw,180px)", lineHeight: 0.85, color: "transparent", WebkitTextStroke: "1px rgba(232,255,0,0.07)", userSelect: "none", position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)" }}>{svc.num}</div>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Breadcrumb crumbs={[{ key: "home", label: "Home" }, { key: "services", label: "Services" }, { label: svc.title }]} navigate={navigate} />
          <span style={{ fontSize: 64, display: "block", marginBottom: 20 }} className="fade-in">{svc.icon}</span>
          <div className="tag fade-in">{svc.num} · AIM FITNESS</div>
          <h1 className="fade-in" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(48px,8vw,96px)", lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 20 }}>
            {svc.title.split(" ").map((word, i, arr) => (
              <span key={i}>{i === arr.length - 1 ? <span style={{ color: "#e8ff00" }}>{word}</span> : word + " "}</span>
            ))}
          </h1>
          <p className="fade-in-2" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontSize: 20, color: "#888", letterSpacing: "0.03em", marginBottom: 32 }}>{svc.tagline}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="tel:8879451638" className="btn-primary">Enquire Now</a>
            <button onClick={() => navigate("services")} className="btn-outline">← All Services</button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 64 }}>

          {/* Left */}
          <div>
            <div className="tag">About This Service</div>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(28px,3vw,44px)", lineHeight: 0.95, letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 24 }}>
              What is <span style={{ color: "#e8ff00" }}>{svc.title}?</span>
            </h2>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 17, color: "#888", lineHeight: 1.8, marginBottom: 48 }}>{svc.description}</p>

            <div className="tag">What You Get</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {svc.benefits.map(b => (
                <div key={b} className="benefit-row" style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, border: "1px solid #1a1a1a", background: "#0d0d0d", transition: "background 0.2s" }}>
                  <span style={{ color: "#e8ff00", fontWeight: 900, fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 400, fontSize: 15, color: "#ccc", lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ border: "1px solid #1a1a1a", padding: 32, marginBottom: 24, background: "#0d0d0d" }}>
              <div className="tag" style={{ marginBottom: 20 }}>Quick Info</div>
              {[
                { label: "Ideal For", value: svc.ideal },
                { label: "Sessions", value: svc.sessions },
                { label: "Location", value: "Lokmanya Nagar, Thane West" },
                { label: "Contact", value: "8879451638" },
              ].map(item => (
                <div key={item.label} style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 0" }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 400, fontSize: 14, color: "#ccc", lineHeight: 1.5 }}>{item.value}</div>
                </div>
              ))}
              <a href="tel:8879451638" className="btn-primary" style={{ marginTop: 24, width: "100%", justifyContent: "center", clipPath: "none" }}>📞 Call to Enroll</a>
            </div>

            {/* Other services nav */}
            <div style={{ border: "1px solid #1a1a1a", padding: 28, background: "#0d0d0d" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", color: "#555", textTransform: "uppercase", marginBottom: 20 }}>Other Services</div>
              {others.map(o => (
                <div key={o.id} className="other-svc-row" onClick={() => navigate(`service/${o.id}`)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #111", cursor: "pointer", transition: "color 0.2s", color: "#f0ece4" }}
                >
                  <span style={{ fontSize: 18 }}>{o.icon}</span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.05em", textTransform: "uppercase" }}>{o.title}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#e8ff00" }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section style={{ background: "#0d0d0d", padding: "80px 40px", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="tag">Explore More</div>
          <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 0.95, textTransform: "uppercase", marginBottom: 36 }}>
            OTHER <span style={{ color: "#e8ff00" }}>SERVICES</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {related.map(o => (
              <div key={o.id} className="svc-detail-card" style={{ padding: 28 }} onClick={() => navigate(`service/${o.id}`)}>
                <span style={{ fontSize: 32, display: "block", marginBottom: 14 }}>{o.icon}</span>
                <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, textTransform: "uppercase", marginBottom: 10 }}>{o.title}</h3>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>{o.short}</p>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 800, color: "#e8ff00", letterSpacing: "0.2em" }}>VIEW →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navigate = (target) => {
    if (target.startsWith("home#")) {
      const id = target.split("#")[1];
      setPage("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      setPage(target);
      window.scrollTo(0, 0);
    }
  };

  const serviceId = page.startsWith("service/") ? page.replace("service/", "") : null;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar page={page} navigate={navigate} scrolled={scrolled} />
      <div style={{ paddingTop: 0 }}>
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "services" && <ServicesPage navigate={navigate} />}
        {serviceId && <ServiceDetailPage serviceId={serviceId} navigate={navigate} />}
      </div>
      <Footer navigate={navigate} />
    </>
  );
}
