import { useState, useEffect, useRef, useCallback } from "react";
import image1 from './image1.jpg';
import image2 from './image2.jpg';
import image3 from './image3.jpg';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  `}</style>
);

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:         #0b0e17;
    --bg2:        #111624;
    --bg3:        #181d2e;
    --gold:       #c9a84c;
    --gold2:      #e8c97b;
    --blue:       #3a7bd5;
    --text:       #e8eaf0;
    --muted:      #7a8099;
    --border:     rgba(201,168,76,0.18);
    --card-bg:    rgba(24,29,46,0.85);
    --ff-display: 'Playfair Display', Georgia, serif;
    --ff-body:    'DM Sans', sans-serif;
    --ff-mono:    'DM Mono', monospace;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--ff-body); font-size: 16px; line-height: 1.65; overflow-x: hidden; }
  ::selection { background: var(--gold); color: #000; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
  body::before {
    content:''; position:fixed; inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events:none; z-index:9999; opacity:.35;
  }

  /* ── NAV ── */
  .nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    padding:1.1rem 4rem;
    background:rgba(11,14,23,0.78); backdrop-filter:blur(18px);
    border-bottom:1px solid var(--border); transition:box-shadow .3s;
  }
  .nav-logo { font-family:var(--ff-display); font-size:1.35rem; font-weight:600; color:var(--gold); letter-spacing:.02em; }
  .nav-links { display:flex; gap:2.2rem; list-style:none; }
  .nav-links a {
    color:var(--muted); text-decoration:none; font-size:.85rem; font-weight:500;
    letter-spacing:.1em; text-transform:uppercase; transition:color .25s; position:relative;
  }
  .nav-links a::after { content:''; position:absolute; bottom:-3px; left:0; right:0; height:1px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .3s; }
  .nav-links a:hover { color:var(--gold); }
  .nav-links a:hover::after { transform:scaleX(1); }

  section { padding:7rem 4rem; max-width:1200px; margin:0 auto; }

  /* ── HERO ── */
  .hero-wrap {
    min-height:100vh; display:flex; flex-direction:column; justify-content:center;
    padding:0 4rem; position:relative; overflow:hidden;
  }
  .hero-slider-track { position:absolute; inset:0; z-index:0; }
  .hero-slide {
    position:absolute; inset:0;
    background-size:cover; background-position:center;
    opacity:0; transition:opacity 1.4s ease;
    filter:brightness(0.22) saturate(0.5);
  }
  .hero-slide.active { opacity:1; }
  .hero-slide.active .ks-inner { animation: kenburns 8s ease-in-out forwards; }
  .ks-inner { position:absolute; inset:-8%; background-size:cover; background-position:center; background-image:inherit; }
  @keyframes kenburns {
    0%   { transform:scale(1)    translateX(0%)   translateY(0%); }
    100% { transform:scale(1.12) translateX(-2%)  translateY(-1%); }
  }
  .hero-bg-overlay {
    position:absolute; inset:0; z-index:1;
    background:linear-gradient(135deg, rgba(11,14,23,0.80) 0%, rgba(11,14,23,0.40) 55%, rgba(201,168,76,0.06) 100%);
  }
  .hero-grid-line { position:absolute; top:0; bottom:0; width:1px; background:var(--border); z-index:2; }
  .hero-content { position:relative; z-index:3; max-width:1200px; margin:0 auto; width:100%; }

  .hero-eyebrow {
    font-family:var(--ff-mono); font-size:.78rem; letter-spacing:.22em; text-transform:uppercase;
    color:var(--gold); margin-bottom:1.4rem; display:flex; align-items:center; gap:.7rem;
  }
  .hero-eyebrow::before { content:''; display:inline-block; width:2.5rem; height:1px; background:var(--gold); }
  .hero-h1 { font-family:var(--ff-display); font-size:clamp(3.2rem,7vw,6.5rem); font-weight:800; line-height:1.05; letter-spacing:-.02em; color:var(--text); }
  .hero-h1 em { color:var(--gold); font-style:italic; }
  .hero-sub { font-size:clamp(1rem,2vw,1.2rem); color:var(--muted); max-width:540px; margin:1.4rem 0 2.8rem; font-weight:300; }
  .hero-cta-row { display:flex; gap:1rem; flex-wrap:wrap; }
  .btn-outline {
    display:inline-flex; align-items:center; gap:.5rem; padding:.75rem 2rem;
    background:transparent; color:var(--gold); font-weight:600; font-size:.9rem;
    letter-spacing:.06em; text-transform:uppercase; text-decoration:none;
    border:1px solid var(--gold); cursor:pointer; transition:background .25s, color .25s;
  }
  .btn-outline:hover { background:var(--gold); color:#0b0e17; }
  .hero-stats { display:flex; gap:3rem; margin-top:4.5rem; padding-top:2.5rem; border-top:1px solid var(--border); }
  .stat-num { font-family:var(--ff-display); font-size:2.4rem; font-weight:800; color:var(--gold); line-height:1; }
  .stat-label { font-size:.78rem; color:var(--muted); letter-spacing:.08em; margin-top:.3rem; }

  /* ── SLIDER (gallery + banner shared) ── */
  .img-slider {
    position:relative; width:100%; overflow:hidden;
    background:var(--bg);
  }
  .img-slider-track {
    display:flex; width:100%; height:100%;
    transition:none;
  }

  /* Each slide */
  .isl-slide {
    min-width:100%; height:100%; position:relative; overflow:hidden; flex-shrink:0;
  }
  .isl-slide img {
    width:100%; height:100%; object-fit:cover; display:block;
    filter:brightness(0.35) saturate(0.6);
    transform:scale(1);
    transition:transform 8s ease, filter .5s;
  }
  .isl-slide.is-active img {
    filter:brightness(0.42) saturate(0.75);
    animation:slKenBurns 8s ease-in-out forwards;
  }
  @keyframes slKenBurns {
    0%   { transform:scale(1)    translateX(0)    translateY(0); }
    100% { transform:scale(1.1)  translateX(-1.5%) translateY(-1%); }
  }

  /* slide enter/exit transitions via JS class */
  .isl-slide { opacity:0; transition:opacity 1s ease; position:absolute; top:0; left:0; width:100%; height:100%; }
  .isl-slide.is-prev { opacity:0; }
  .isl-slide.is-active { opacity:1; z-index:2; }

  /* Corner decoration on each slide */
  .isl-slide::before, .isl-slide::after {
    content:''; position:absolute; width:28px; height:28px; z-index:4; opacity:.65;
  }
  .isl-slide::before { top:16px; left:16px; border-top:2px solid var(--gold); border-left:2px solid var(--gold); }
  .isl-slide::after  { bottom:16px; right:16px; border-bottom:2px solid var(--gold); border-right:2px solid var(--gold); }

  /* Overlay for gallery variant */
  .isl-overlay-gallery {
    position:absolute; inset:0; z-index:3;
    background:linear-gradient(to top, rgba(11,14,23,0.92) 0%, rgba(11,14,23,0.1) 55%, transparent 100%);
    display:flex; flex-direction:column; justify-content:flex-end;
    padding:2.2rem 2.5rem;
  }
  .isl-label { font-family:var(--ff-mono); font-size:.7rem; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); margin-bottom:.3rem; }
  .isl-title { font-family:var(--ff-display); font-size:1.4rem; font-weight:700; color:var(--text); }
  .isl-num {
    position:absolute; top:14px; right:20px; z-index:4;
    font-family:var(--ff-display); font-size:3.5rem; font-weight:800;
    color:rgba(201,168,76,0.12); line-height:1; user-select:none;
  }

  /* Overlay for banner variant */
  .isl-overlay-banner {
    position:absolute; inset:0; z-index:3;
    background:linear-gradient(to right, rgba(11,14,23,0.88) 0%, rgba(11,14,23,0.22) 50%, rgba(11,14,23,0.88) 100%);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:.8rem; text-align:center;
  }
  .isl-banner-line { width:40px; height:1px; background:var(--gold); opacity:.7; }
  .isl-banner-quote {
    font-family:var(--ff-display); font-style:italic;
    font-size:clamp(1.25rem,2.6vw,1.95rem); color:var(--text);
    max-width:680px; padding:0 2rem; line-height:1.35;
    text-shadow:0 2px 24px rgba(0,0,0,.8);
    opacity:0; transform:translateY(12px);
    transition:opacity .7s ease .3s, transform .7s ease .3s;
  }
  .isl-banner-quote.vis { opacity:1; transform:translateY(0); }
  .isl-banner-quote em { color:var(--gold); font-style:italic; }
  .isl-banner-sub { font-family:var(--ff-mono); font-size:.68rem; letter-spacing:.18em; text-transform:uppercase; color:var(--gold); opacity:.75; }

  /* Arrow buttons */
  .slider-arrow {
    position:absolute; top:50%; transform:translateY(-50%); z-index:10;
    width:42px; height:42px;
    background:rgba(11,14,23,0.65); border:1px solid var(--border); color:var(--gold);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; font-size:1.1rem;
    transition:background .25s, border-color .25s;
    backdrop-filter:blur(8px);
  }
  .slider-arrow:hover { background:rgba(201,168,76,0.2); border-color:var(--gold); }
  .slider-arrow.left  { left:1.2rem; }
  .slider-arrow.right { right:1.2rem; }

  /* Dot indicators */
  .slider-dots { position:absolute; bottom:1.1rem; left:50%; transform:translateX(-50%); z-index:10; display:flex; gap:.55rem; }
  .slider-dot {
    width:7px; height:7px; border-radius:50%;
    background:rgba(201,168,76,0.3); border:1px solid rgba(201,168,76,0.5);
    cursor:pointer; transition:background .3s, transform .3s;
  }
  .slider-dot.active { background:var(--gold); transform:scale(1.35); }

  /* Progress bar */
  .slider-progress {
    position:absolute; bottom:0; left:0; height:2px; z-index:10;
    background:var(--gold); opacity:.7;
    transition:width linear;
  }

  /* ── SECTION LABELS ── */
  .section-label { font-family:var(--ff-mono); font-size:.75rem; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); margin-bottom:.8rem; display:flex; align-items:center; gap:.7rem; }
  .section-label::before { content:''; display:inline-block; width:1.5rem; height:1px; background:var(--gold); }
  .section-title { font-family:var(--ff-display); font-size:clamp(2rem,4vw,3rem); font-weight:800; line-height:1.1; color:var(--text); margin-bottom:3.5rem; }
  .section-title em { color:var(--gold); font-style:italic; }

  /* ── ABOUT ── */
  .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:start; }
  .about-text p { color:var(--muted); margin-bottom:1.1rem; font-size:.98rem; }
  .about-text p strong { color:var(--text); font-weight:600; }
  .about-tag-row { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:1.6rem; }
  .tag { font-family:var(--ff-mono); font-size:.72rem; padding:.3rem .75rem; background:rgba(201,168,76,0.1); border:1px solid var(--border); color:var(--gold); letter-spacing:.06em; }
  .exp-timeline { display:flex; flex-direction:column; }
  .exp-item { position:relative; padding:1.4rem 0 1.4rem 1.8rem; border-left:1px solid var(--border); }
  .exp-item::before { content:''; position:absolute; left:-4px; top:1.9rem; width:8px; height:8px; background:var(--gold); border-radius:50%; }
  .exp-period { font-family:var(--ff-mono); font-size:.72rem; color:var(--gold); letter-spacing:.08em; margin-bottom:.3rem; }
  .exp-role { font-weight:600; font-size:.98rem; color:var(--text); }
  .exp-company { font-size:.88rem; color:var(--muted); margin-bottom:.5rem; }
  .exp-badge { display:inline-block; font-family:var(--ff-mono); font-size:.65rem; padding:.2rem .6rem; background:rgba(58,123,213,0.15); border:1px solid rgba(58,123,213,0.3); color:#7aaff0; letter-spacing:.06em; }

  /* ── SKILLS ── */
  .skills-bg { background:var(--bg2); padding:7rem 0; }
  .skills-inner { max-width:1200px; margin:0 auto; padding:0 4rem; }
  .skills-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
  .skill-card { background:var(--card-bg); border:1px solid var(--border); padding:1.8rem; position:relative; overflow:hidden; transition:border-color .3s,transform .3s; }
  .skill-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--gold),transparent); transform:scaleX(0); transform-origin:left; transition:transform .4s; }
  .skill-card:hover { border-color:var(--gold); transform:translateY(-4px); }
  .skill-card:hover::before { transform:scaleX(1); }
  .skill-icon { font-size:1.8rem; margin-bottom:.9rem; }
  .skill-name { font-weight:600; font-size:.95rem; color:var(--text); margin-bottom:.4rem; }
  .skill-items { font-size:.82rem; color:var(--muted); line-height:1.7; }

  /* ── PROJECTS ── */
  .projects-grid { display:flex; flex-direction:column; gap:2.5rem; }
  .project-card { background:var(--card-bg); border:1px solid var(--border); padding:2.5rem; display:grid; grid-template-columns:1fr auto; gap:2rem; align-items:start; position:relative; overflow:hidden; transition:border-color .3s,transform .3s; }
  .project-card::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(201,168,76,0.04) 0%,transparent 60%); pointer-events:none; }
  .project-card:hover { border-color:rgba(201,168,76,0.5); transform:translateY(-3px); }
  .project-featured { font-family:var(--ff-mono); font-size:.65rem; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); margin-bottom:.6rem; }
  .project-title { font-family:var(--ff-display); font-size:1.55rem; font-weight:700; color:var(--text); margin-bottom:.8rem; }
  .project-desc { font-size:.9rem; color:var(--muted); line-height:1.7; margin-bottom:1.2rem; }
  .project-tech-row { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:1rem; }
  .tech-pill { font-family:var(--ff-mono); font-size:.68rem; padding:.25rem .7rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--muted); letter-spacing:.05em; }
  .project-number { font-family:var(--ff-display); font-size:5rem; font-weight:800; color:rgba(201,168,76,0.08); line-height:1; user-select:none; white-space:nowrap; }
  .highlight-item { font-size:.83rem; color:var(--muted); display:flex; align-items:flex-start; gap:.5rem; margin-bottom:.4rem; }
  .highlight-item::before { content:'▸'; color:var(--gold); flex-shrink:0; margin-top:.05rem; }

  /* ── UAT ── */
  .uat-strip { background:var(--bg3); border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:5rem 4rem; }
  .uat-inner { max-width:1200px; margin:0 auto; }
  .uat-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:start; }
  .uat-badge-row { display:flex; flex-wrap:wrap; gap:.8rem; margin-top:1.4rem; }
  .uat-badge { display:flex; align-items:center; gap:.5rem; padding:.6rem 1rem; background:rgba(58,123,213,0.1); border:1px solid rgba(58,123,213,0.25); font-size:.82rem; color:#7aaff0; font-weight:500; }
  .uat-points { display:flex; flex-direction:column; gap:1rem; }
  .uat-point { display:flex; gap:1rem; align-items:flex-start; padding:1.1rem 1.3rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-left:3px solid var(--gold); }
  .uat-point-icon { font-size:1.3rem; flex-shrink:0; margin-top:.1rem; }
  .uat-point-title { font-weight:600; font-size:.93rem; color:var(--text); margin-bottom:.2rem; }
  .uat-point-text { font-size:.83rem; color:var(--muted); line-height:1.6; }

  /* ── AWARDS ── */
  .awards-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1.2rem; }
  .award-card { background:var(--card-bg); border:1px solid var(--border); padding:1.6rem; text-align:center; transition:transform .3s,border-color .3s; }
  .award-card:hover { transform:translateY(-5px); border-color:var(--gold); }
  .award-icon { font-size:2rem; margin-bottom:.7rem; }
  .award-title { font-weight:700; font-size:.93rem; color:var(--gold); margin-bottom:.4rem; }
  .award-desc { font-size:.8rem; color:var(--muted); line-height:1.5; }

  /* ── CONTACT ── */
  .contact-bg { background:var(--bg2); padding:7rem 0; }
  .contact-inner { max-width:1200px; margin:0 auto; padding:0 4rem; }
  .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:start; }
  .contact-info p { color:var(--muted); font-size:.95rem; margin-bottom:2rem; }
  .contact-item { display:flex; align-items:center; gap:1rem; padding:1rem 1.2rem; background:rgba(255,255,255,0.03); border:1px solid var(--border); margin-bottom:.8rem; text-decoration:none; transition:border-color .25s,background .25s; }
  .contact-item:hover { border-color:var(--gold); background:rgba(201,168,76,0.06); }
  .contact-item-icon { font-size:1.1rem; flex-shrink:0; }
  .contact-item-text { font-size:.88rem; color:var(--text); word-break:break-all; }
  .contact-item-label { font-size:.7rem; color:var(--muted); letter-spacing:.06em; }
  .contact-highlight { background:linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04)); border:1px solid var(--border); padding:2.5rem; }
  .contact-highlight h3 { font-family:var(--ff-display); font-size:1.5rem; font-weight:700; color:var(--text); margin-bottom:1rem; }
  .contact-highlight p { font-size:.9rem; color:var(--muted); line-height:1.7; margin-bottom:1.5rem; }
  .lang-pill { font-family:var(--ff-mono); font-size:.72rem; padding:.3rem .8rem; background:rgba(201,168,76,0.15); border:1px solid var(--border); color:var(--gold); }

  /* ── FOOTER ── */
  .footer { border-top:1px solid var(--border); padding:2rem 4rem; display:flex; justify-content:space-between; align-items:center; background:var(--bg); }
  .footer-logo { font-family:var(--ff-display); color:var(--gold); font-size:1.1rem; }
  .footer-copy { font-size:.78rem; color:var(--muted); }

  /* ── ANIMATIONS ── */
  .fade-in { opacity:0; transform:translateY(28px); transition:opacity .7s ease,transform .7s ease; }
  .fade-in.visible { opacity:1; transform:translateY(0); }
  .cursor-dot { position:fixed; width:8px; height:8px; background:var(--gold); border-radius:50%; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); mix-blend-mode:difference; }

  /* ── MOBILE ── */
  @media (max-width:768px) {
    .nav { padding:1rem 1.5rem; }
    .nav-links { display:none; }
    section { padding:4rem 1.5rem; }
    .hero-wrap { padding:0 1.5rem; }
    .about-grid,.contact-grid,.uat-grid { grid-template-columns:1fr; gap:2.5rem; }
    .skills-grid { grid-template-columns:1fr 1fr; }
    .hero-stats { flex-wrap:wrap; gap:1.5rem; }
    .project-card { grid-template-columns:1fr; }
    .project-number { display:none; }
    .skills-inner,.contact-inner,.uat-inner { padding:0 1.5rem; }
    .footer { flex-direction:column; gap:.5rem; text-align:center; padding:1.5rem; }
    .uat-strip { padding:4rem 1.5rem; }
  }
`;

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const SLIDES = [
  { src: image1, num: "01", title: "Professional Journey",  label: "5+ Years · Wells Fargo EGS" },
  { src: image2, num: "02", title: "Cloud Development",     label: "MongoDB Atlas · Cloudinary" },
  { src: image3, num: "03", title: "Quality & Excellence",  label: "UAT · RPA · Zero Errors" },
];

const BANNER_SLIDES = [
  { src: image1, quote: '"Every decision carries a cost — <em>precision</em> is the discipline of making that cost worthwhile."', sub: "Financial Operations · Cloud Development · Quality Assurance" },
  { src: image2, quote: '"Five years of <em>zero critical errors</em> — not a record, a standard."', sub: "Wells Fargo EGS · Transaction Monitoring · Reconciliation" },
  { src: image3, quote: '"Excellence is not a destination — it is the standard I hold <em>every single day.</em>"', sub: "4+ Years · Zero Critical Errors · Wells Fargo EGS" },
];

const SKILLS = [
  { icon: "💰", name: "Fund Accounting & Reporting", items: "Financial Statement Preparation · Account Reconciliation · Reporting Support · Audit & Compliance" },
  { icon: "⚙️", name: "Transaction & Process Operations", items: "High-volume Transaction Processing · Break Investigation · SLA Management · SOP Optimization" },
  { icon: "📊", name: "Data Analysis & Excel", items: "Advanced Excel (Pivot Tables, VLOOKUP) · MIS Reporting · Exception Tracking · Data Interpretation" },
  { icon: "🔒", name: "Risk & Controls", items: "Internal Controls · Risk Management · Regulatory Compliance · US GAAP / IFRS (basic)" },
  { icon: "🤖", name: "Automation & Efficiency", items: "Automation Opportunity Identification · Workflow Standardization · RPA Support · Process Improvement" },
  { icon: "👥", name: "Leadership & Collaboration", items: "Team Leadership · Training & Mentoring · Stakeholder Communication · Global US/EMEA Teamwork" },
];

const AWARDS = [
  { icon: "🥇", title: "Gold Coin Award (2024)",        desc: "Excellence in transaction monitoring, fraud risk management, zero customer impact" },
  { icon: "💡", title: "Skill-Based Pay Award (2025)",  desc: "Supporting multiple teams, enhancing SOPs, impactful training initiatives" },
  { icon: "🔦", title: "Manager's Spotlight Award",     desc: "Sustained long-term error-free operations and consistently high performance" },
  { icon: "🪶", title: "First Feather Cap Award ×2",    desc: "Six consecutive months of zero errors in transaction monitoring & investigations" },
  { icon: "🎯", title: "Sustained Accuracy Record",     desc: "0 critical errors for 4+ years, ensuring compliance and minimizing financial risk" },
];

/* ─── HOOKS ─────────────────────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Counter({ end, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let n = 0; const step = Math.ceil(end / 50);
        const t = setInterval(() => { n = Math.min(n + step, end); setVal(n); if (n >= end) clearInterval(t); }, 28);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── GALLERY SLIDER ────────────────────────────────────────────────────────── */
// Auto-slides through image1/image2/image3 with Ken Burns + cross-fade
// Variant="gallery" shows bottom title overlay
// Variant="banner" shows centred quote overlay
function ImageSlider({ slides, height = "360px", variant = "gallery", interval = 4500 }) {
  const [cur, setCur] = useState(0);
  const [prog, setProg] = useState(0);
  const [paused, setPaused] = useState(false);
  const [quoteVis, setQuoteVis] = useState(true);
  const timerRef = useRef(null);
  const progRef  = useRef(null);
  const total = slides.length;

  const goTo = useCallback((idx) => {
    setQuoteVis(false);
    setTimeout(() => {
      setCur((idx + total) % total);
      setProg(0);
      setQuoteVis(true);
    }, 180);
  }, [total]);

  const next = useCallback(() => goTo(cur + 1), [cur, goTo]);
  const prev = useCallback(() => goTo(cur - 1), [cur, goTo]);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, interval);
    return () => clearTimeout(timerRef.current);
  }, [cur, paused, next, interval]);

  // Progress bar animation
  useEffect(() => {
    if (paused) return;
    setProg(0);
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min(((ts - start) / interval) * 100, 100);
      setProg(pct);
      if (pct < 100) progRef.current = requestAnimationFrame(step);
    };
    progRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(progRef.current);
  }, [cur, paused, interval]);

  return (
    <div
      className="img-slider fade-in"
      style={{ height }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div key={i} className={`isl-slide ${i === cur ? "is-active" : "is-prev"}`}>
          <img src={s.src} alt={s.title || s.sub || ""} loading="lazy" />
          <div className="isl-num">{s.num || `0${i + 1}`}</div>

          {variant === "gallery" && (
            <div className="isl-overlay-gallery">
              <div className="isl-label">{s.label}</div>
              <div className="isl-title">{s.title}</div>
            </div>
          )}

          {variant === "banner" && (
            <div className="isl-overlay-banner">
              <div className="isl-banner-line" />
              <div
                className={`isl-banner-quote ${i === cur && quoteVis ? "vis" : ""}`}
                dangerouslySetInnerHTML={{ __html: s.quote }}
              />
              <div className="isl-banner-sub">{s.sub}</div>
              <div className="isl-banner-line" />
            </div>
          )}
        </div>
      ))}

      {/* Arrows */}
      <button className="slider-arrow left"  onClick={prev} aria-label="Previous">&#8592;</button>
      <button className="slider-arrow right" onClick={next} aria-label="Next">&#8594;</button>

      {/* Dots */}
      <div className="slider-dots">
        {slides.map((_, i) => (
          <div key={i} className={`slider-dot ${i === cur ? "active" : ""}`} onClick={() => goTo(i)} />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="slider-progress" style={{ width: `${prog}%`, transitionDuration: "0s" }} />
      )}
    </div>
  );
}

/* ─── HERO SLIDER (bg only, no overlay cards) ──────────────────────────────── */
function HeroSlider() {
  const [cur, setCur] = useState(0);
  const total = SLIDES.length;
  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % total), 5500);
    return () => clearInterval(t);
  }, [total]);
  return (
    <div className="hero-slider-track">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hero-slide ${i === cur ? "active" : ""}`}
          style={{ backgroundImage: `url('${s.src}')`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      ))}
    </div>
  );
}

/* ─── APP ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [cursor,   setCursor]   = useState({ x: -100, y: -100 });
  useScrollReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <>
      <FontLink />
      <style>{css}</style>
      <div className="cursor-dot" style={{ left: cursor.x, top: cursor.y }} />

      {/* ── NAV ── */}
      <nav className="nav" style={{ boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,.5)" : "none" }}>
        <div className="nav-logo">MK<span style={{ color: "var(--muted)" }}>.</span>YM</div>
        <ul className="nav-links">
          {["About","Skills","Projects","Experience","Awards","Contact"].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
      </nav>

      {/* ── HERO (image1/2/3 auto-cycling bg) ── */}
      <div className="hero-wrap" id="about">
        <HeroSlider />
        <div className="hero-bg-overlay" />
        {[15, 40, 60, 85].map(l => <div key={l} className="hero-grid-line" style={{ left: `${l}%` }} />)}

        <div className="hero-content">
          <div className="hero-eyebrow fade-in">Senior Financial Operations Professional | IT Banking Operations</div>
          <h1 className="hero-h1 fade-in" style={{ transitionDelay: ".1s" }}>Manoj<br /><em>Kumar</em> YM</h1>
          <p className="hero-sub fade-in" style={{ transitionDelay: ".2s" }}>
            Senior Financial Operations Professional with ~5 years in banking and financial services, specializing in transaction processing, account reconciliation, and financial reporting support. Strong analytical, problem-solving, and technology skills with expertise in Excel and data-driven decision-making. Experienced in US/EMEA operational environments.
          </p>
          <div className="hero-cta-row fade-in" style={{ transitionDelay: ".3s" }}>
            <a href="#projects" className="btn-outline">View Projects ↓</a>
            <a href="#contact"  className="btn-outline">Get in Touch</a>
          </div>
          <div className="hero-stats fade-in" style={{ transitionDelay: ".45s" }}>
            {[
              { num: 5, suffix: "+", label: "Years Experience" },
              { num: 4, suffix: "+", label: "Years Zero Errors" },
              { num: 5, suffix: "",  label: "Awards Won" },
              { num: 1, suffix: "",  label: "Cloud Project" },
            ].map(({ num, suffix, label }) => (
              <div key={label}>
                <div className="stat-num"><Counter end={num} suffix={suffix} /></div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section>
        <div className="about-grid">
          <div className="about-text fade-in">
            <div className="section-label">About Me</div>
            <h2 className="section-title" style={{ fontSize: "2.2rem" }}>Finance & Operations <em>Leadership</em></h2>
            <p>Senior Financial Operations Professional with ~5 years of experience in banking and financial services. Specializing in transaction processing, account reconciliation, and financial reporting support. Demonstrates strong analytical, problem-solving, and technology skills with expertise in Excel and data-driven decision-making.</p>
            <p>Proven ability to lead teams, mentor peers, and drive process improvements while ensuring accuracy and adherence to strict deadlines. Experienced in global (US/EMEA) operational environments and in collaborating with Compliance, Technology, and Audit stakeholders.</p>
            <p>Also experienced in full-stack development and QA practices, building cloud-integrated finance tools while maintaining a quality-first mindset for financial operations and process automation.</p>
            <div className="about-tag-row">
              {["Chennai, Tamil Nadu","US/EMEA Shifts","English · Tamil · Telugu","MBA – Finance","SRM University"].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="fade-in" style={{ transitionDelay: ".15s" }}>
            <div className="section-label">Work History</div>
            <div className="exp-timeline">
              {[
                { period: "Feb 2025 – Present", role: "Senior Operations Processor",    company: "Wells Fargo – EGS", badge: "SME · SLA Lead" },
                { period: "Jul 2022 – Jan 2025", role: "Operations Processor",           company: "Wells Fargo – EGS", badge: "Reconciliation · MIS" },
                { period: "Apr 2021 – Jul 2022", role: "Associate Operations Processor", company: "Wells Fargo – EGS", badge: "Transaction Processing" },
              ].map(e => (
                <div className="exp-item" key={e.period}>
                  <div className="exp-period">{e.period}</div>
                  <div className="exp-role">{e.role}</div>
                  <div className="exp-company">{e.company}</div>
                  <span className="exp-badge">{e.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY SLIDER (image1 → image2 → image3 auto-slide) ── */}
      <ImageSlider slides={SLIDES} height="360px" variant="gallery" interval={4000} />

      {/* ── SKILLS ── */}
      <div className="skills-bg" id="skills">
        <div className="skills-inner">
          <div className="section-label fade-in">Expertise</div>
          <h2 className="section-title fade-in" style={{ transitionDelay: ".1s" }}>Skills & <em>Capabilities</em></h2>
          <p className="hero-sub fade-in" style={{ transitionDelay: ".15s", marginTop: ".5rem" }}>
            Vibe coder building websites with AI, plus UAT testing exposure in high-compliance banking operations.
          </p>
          <div className="skills-grid">
            {SKILLS.map((s, i) => (
              <div key={s.name} className="skill-card fade-in" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="skill-icon">{s.icon}</div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-items">{s.items}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BANNER SLIDER before Projects (rotating quotes) ── */}
      <ImageSlider slides={BANNER_SLIDES} height="380px" variant="banner" interval={5500} />

      {/* ── PROJECTS ── */}
      <section id="projects">
        <div className="section-label fade-in">Portfolio</div>
        <h2 className="section-title fade-in" style={{ transitionDelay: ".1s" }}>Featured <em>Projects</em></h2>

        <div className="projects-grid">
          <div className="project-card fade-in">
            <div>
              <div className="project-featured">Featured Project · Full-Stack Web Application</div>
              <h3 className="project-title">The Cost of Choices</h3>
              <p className="project-desc">
                A full-stack web application exploring the financial and emotional weight of everyday decisions.
                Built with cloud-native architecture using MongoDB Atlas for data persistence and Cloudinary for
                media management, presenting decision frameworks through immersive data visualizations.
              </p>
              <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                {["MongoDB Atlas","Cloudinary CDN"].map(b => (
                  <span key={b} style={{ fontFamily: "var(--ff-mono)", fontSize: ".68rem", padding: ".3rem .8rem", background: "rgba(58,123,213,0.15)", border: "1px solid rgba(58,123,213,0.3)", color: "#7aaff0", letterSpacing: ".05em" }}>☁ {b}</span>
                ))}
              </div>
              <div className="project-tech-row">
                {["React","Node.js","MongoDB Atlas","Cloudinary","Express.js","REST API","JWT Auth","Tailwind CSS"].map(t => (
                  <span key={t} className="tech-pill">{t}</span>
                ))}
              </div>
              <div style={{ marginTop: ".8rem" }}>
                {[
                  "Cloud-integrated backend with MongoDB Atlas for scalable, distributed data storage",
                  "Cloudinary integration for optimised media upload, transformation, and CDN delivery",
                  "Secure authentication with JWT tokens and protected API routes",
                  "Responsive UI with real-time data updates and interactive cost breakdown charts",
                  "RESTful API architecture with validation, error handling, and rate limiting",
                ].map(h => <div key={h} className="highlight-item">{h}</div>)}
              </div>
            </div>
            <div className="project-number">01</div>
          </div>

          <div className="project-card fade-in" style={{ transitionDelay: ".1s", opacity: .72 }}>
            <div>
              <div className="project-featured">In Development · Finance Tool</div>
              <h3 className="project-title" style={{ color: "var(--muted)" }}>Financial Reconciliation Dashboard</h3>
              <p className="project-desc">
                A data analytics dashboard for visualising reconciliation trends, break analysis, and SLA compliance metrics.
                Built with React, Python, and Power BI integration — leveraging 5 years of domain expertise.
              </p>
              <div className="project-tech-row">
                {["React","Python","Power BI","SQL","FastAPI","MongoDB"].map(t => <span key={t} className="tech-pill">{t}</span>)}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontFamily: "var(--ff-mono)", fontSize: ".72rem", padding: ".4rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted)", letterSpacing: ".08em", marginTop: ".8rem" }}>
                ⏳ Coming Soon
              </div>
            </div>
            <div className="project-number">02</div>
          </div>
        </div>
      </section>

      {/* ── UAT / RPA ── */}
      <div className="uat-strip" id="experience">
        <div className="uat-inner">
          <div className="uat-grid">
            <div className="fade-in">
              <div className="section-label">QA & Testing</div>
              <h2 className="section-title" style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
                UAT & <em>RPA Testing</em><br />Experience
              </h2>
              <p style={{ color: "var(--muted)", fontSize: ".93rem", lineHeight: 1.7, marginBottom: "1.4rem" }}>
                Beyond financial operations, I bring hands-on experience in <strong style={{ color: "var(--text)" }}>User Acceptance Testing (UAT)</strong> and contributing to test case preparation for <strong style={{ color: "var(--text)" }}>Robotic Process Automation (RPA)</strong> projects within a high-compliance banking environment.
              </p>
              <div className="uat-badge-row">
                {["UAT Execution","RPA Test Cases","Defect Logging","Process Validation","Regression Testing"].map(b => (
                  <div key={b} className="uat-badge"><span>✓</span> {b}</div>
                ))}
              </div>
            </div>
            <div className="uat-points fade-in" style={{ transitionDelay: ".15s" }}>
              {[
                { icon: "✅", title: "Transaction Review & Validation",   text: "Performed detailed review and validation of financial transactions and account balances, supporting accurate financial reporting and audit readiness." },
                { icon: "🧾", title: "Reconciliation & Investigation",      text: "Conducted reconciliation and investigation of discrepancies to ensure data integrity aligned with financial reporting standards." },
                { icon: "📊", title: "Financial Reporting Support",       text: "Supported preparation of financial data and reports used in internal and external audit reviews." },
                { icon: "💡", title: "SME, Coaching & Leadership",         text: "Acted as Subject Matter Expert (SME), providing training, coaching, and performance feedback to team members." },
                { icon: "⏱", title: "SLA & Workflow Management",        text: "Led workflow prioritization, assigned tasks, and ensured timely completion within strict SLA timelines." },
                { icon: "🤝", title: "Cross-functional Collaboration",     text: "Collaborated with Compliance, Technology, and Audit teams to resolve financial discrepancies and client issues." },
                { icon: "⚙️", title: "Automation & Process Improvements", text: "Identified automation opportunities and implemented process improvements, reducing manual effort and improving efficiency." },
                { icon: "🏆", title: "Awards & Recognition",              text: "Recognized with Skill-Based Pay Award (2025) for supporting multiple teams, enhancing SOPs, and delivering impactful training initiatives." },
              ].map(pt => (
                <div key={pt.title} className="uat-point">
                  <div className="uat-point-icon">{pt.icon}</div>
                  <div>
                    <div className="uat-point-title">{pt.title}</div>
                    <div className="uat-point-text">{pt.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BANNER SLIDER before Awards (same rotating images) ── */}
      <ImageSlider slides={[...BANNER_SLIDES].reverse()} height="340px" variant="banner" interval={5000} />

      {/* ── AWARDS ── */}
      <section id="awards">
        <div className="section-label fade-in">Recognition</div>
        <h2 className="section-title fade-in" style={{ transitionDelay: ".1s" }}>Awards & <em>Achievements</em></h2>
        <div className="awards-grid">
          {AWARDS.map((a, i) => (
            <div key={a.title} className="award-card fade-in" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="award-icon">{a.icon}</div>
              <div className="award-title">{a.title}</div>
              <div className="award-desc">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDUCATION & TECH SKILLS ── */}
      <section id="education" style={{ padding: "5rem 4rem" }}>
        <div className="section-label fade-in">Background</div>
        <h2 className="section-title fade-in" style={{ transitionDelay: ".1s" }}>Education & Technical Skills</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
          <div className="fade-in" style={{ transitionDelay: ".15s" }}>
            <h3 style={{ marginBottom: ".6rem" }}>Education</h3>
            <p><strong>MBA – Finance</strong> · SRM University (2023 – 2025)</p>
            <p><strong>B.Com – Corporate Secretaryship</strong> · Apollo Arts and Science College (2017 – 2020)</p>
          </div>
          <div className="fade-in" style={{ transitionDelay: ".2s" }}>
            <h3 style={{ marginBottom: ".6rem" }}>Technical Skills</h3>
            <p>Advanced Excel, MIS Reporting Tools, Transaction Monitoring Systems</p>
            <p>Data Analysis & Reporting Dashboards, Exception Tracking</p>
            <p>Currently learning SQL, Python, Power BI, Tableau (Data Analytics for Financial / Fraud Analysis)</p>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <div className="contact-bg" id="contact">
        <div className="contact-inner">
          <div className="section-label fade-in">Get in Touch</div>
          <h2 className="section-title fade-in" style={{ transitionDelay: ".1s" }}>Let's <em>Connect</em></h2>
          <div className="contact-grid">
            <div className="contact-info fade-in">
              <p>Open to finance technology roles, full-stack opportunities, and collaborations that bridge domain expertise with modern web development.</p>
              {[
                { icon: "📧", label: "Email",     text: "ymmanoj.kumar199@gmail.com",           href: "mailto:ymmanoj.kumar199@gmail.com" },
                { icon: "📞", label: "Phone",     text: "9043050190",                           href: "tel:9043050190" },
                { icon: "🔗", label: "LinkedIn",  text: "linkedin.com/in/manoj-ymk-4188b1296",  href: "https://www.linkedin.com/in/manoj-ymk-4188b1296" },
                { icon: "🌐", label: "Portfolio", text: "ymmanoj.github.io/ymkportfolio",        href: "https://ymmanoj.github.io/ymkportfolio/" },
                { icon: "📍", label: "Location",  text: "Chennai",                             href: "#" },
              ].map(c => (
                <a key={c.label} href={c.href} className="contact-item" target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  <span className="contact-item-icon">{c.icon}</span>
                  <div>
                    <div className="contact-item-label">{c.label}</div>
                    <div className="contact-item-text">{c.text}</div>
                  </div>
                </a>
              ))}
            </div>
            <div className="contact-highlight fade-in" style={{ transitionDelay: ".15s" }}>
              <h3>Why work with me?</h3>
              <p>I bring a rare combination of <strong>5+ years of banking domain expertise</strong>, a flawless accuracy record, and growing technical skills in full-stack development. Whether it's financial operations, process automation, or building cloud-integrated web applications — I deliver with precision.</p>
              <div style={{ marginBottom: "1.4rem" }}>
                {["✅  Zero critical errors for 4+ years","✅  Subject Matter Expert – Wells Fargo EGS","✅  Cloud-native full-stack development","✅  UAT & RPA test case experience","✅  US / EMEA operational environment"].map(item => (
                  <div key={item} style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".5rem" }}>{item}</div>
                ))}
              </div>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {["English","Tamil","Telugu"].map(l => <span key={l} className="lang-pill">{l}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">YMK</div>
        <div className="footer-copy">© 2025 Manoj Kumar YM · Built with React · Guduvanchery, Chennai</div>
        <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>
          <a href="https://ymmanoj.github.io/ymkportfolio/" style={{ color: "var(--gold)", textDecoration: "none" }} target="_blank" rel="noreferrer">ymkportfolio →</a>
        </div>
      </footer>
    </>
  );
}