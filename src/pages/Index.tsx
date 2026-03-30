import { useState, useEffect, useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Chart, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Tooltip, Filler, Legend,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler, Legend);

/* ── Reveal on scroll wrapper ── */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Section header helper ── */
function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-7 border-b border-rule pb-2.5">
      <span className="section-number-label">{number}</span>
      <h2 className="font-display text-[1.4rem] font-bold text-foreground">{title}</h2>
    </div>
  );
}

/* ── Nav sections ── */
const navSections = [
  { id: "theory", label: "Theory" },
  { id: "evidence", label: "Evidence" },
  { id: "comparison", label: "Comparison" },
  { id: "implications", label: "Implications" },
  { id: "realworld", label: "Real World" },
  { id: "solutions", label: "Solutions" },
];

/* ── Data ── */
const theoryCards = [
  { num: "01 · Economics", term: "Principal-Agent Theory", body: "Managers and employees don't always want the same thing. Incentives try to align them, but people don't respond as neatly as theory suggests.", tag: "Traditional Economics" },
  { num: "02 · Psychology", term: "The Crowding-Out Effect", body: "Big external rewards can weaken internal motivation. Once people focus only on the bonus, teamwork and loyalty start fading.", tag: "Behavioural Economics" },
  { num: "03 · Sociology", term: "Social Preferences", body: "People aren't just calculators. Fairness, belonging, and helping others matter too. Team bonuses support that instead of creating rivals.", tag: "Behavioural Economics" },
  { num: "04 · Design", term: "Choice Architecture", body: "The way choices are designed affects behaviour. Making training opt-out instead of opt-in quietly boosts participation without forcing anyone.", tag: "Thaler and Sunstein" },
];

const beforeItems = [
  "Rewards were tied only to individual output",
  "Sharing information helped your \"competition\"",
  "Good work became bonus-chasing",
  "Trust broke down fast",
];

const afterItems = [
  "Team bonuses aligned everyone's goals",
  "People started helping each other again",
  "Default training increased participation",
  "Morale improved because work felt healthier",
];

const solutions = [
  {
    number: "01", eyebrow: "Solution One", title: "A Game-Based Work System",
    paragraphs: [
      "Take what makes games engaging, like points, levels, and team challenges, and apply it to workplace recognition. The goal isn't to make work childish, but to make effort and collaboration visible.",
      "In most systems, quietly helping a teammate goes unnoticed. Here, it counts. People earn recognition for mentoring, sharing knowledge, and completing cross-team work.",
      "Rewards are transparent, frequent, and tied to behaviours the organisation actually wants. Most importantly, it stays cooperative by default.",
    ],
    sidebarLabel: "How it works in practice",
    points: ["Points for collaboration, knowledge-sharing, and team goals", "Contributions are visible across the organisation", "Teams level up together and unlock shared perks", "Monthly challenges keep things fresh", "No forced rankings. No zero-sum competition. Everyone can win."],
    tags: ["Social Preferences", "Choice Architecture", "Crowding-Out Fix", "Intrinsic Motivation"],
  },
  {
    number: "02", eyebrow: "Solution Two", title: "A Weekly Sports Hour for Team Building",
    paragraphs: [
      "One hour a week. Everyone stops work and plays together. It sounds simple, but it works because shared activity builds trust faster than most formal team-building ever does.",
      "When you only know coworkers through tasks, everything becomes transactional. A weekly sports session breaks that pattern and helps people relate more naturally.",
      "It also works as a subtle nudge. Put it in the calendar by default, and most people will show up. Over time, those informal bonds reduce friction and make cooperation feel normal.",
    ],
    sidebarLabel: "Why it actually works",
    points: ["Shared activity builds trust across departments", "Physical activity lowers stress", "People help coworkers they know personally", "A default calendar slot boosts participation", "Rotating sports and teams helps avoid cliques"],
    tags: ["Social Preferences", "Nudge Theory", "Status Quo Bias", "Reciprocity"],
  },
];

/* ══════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════ */
const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  // Navbar scroll tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      for (const s of [...navSections].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 120) { setActive(s.id); return; }
      }
      setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Chart
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    const labels = ["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10","Q11","Q12"];
    const makeDataset = (label: string, data: number[], color: string, dash?: number[]) => ({
      label, data, borderColor: color, backgroundColor: color.replace(")", ",0.1)").replace("rgb", "rgba"),
      fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2, ...(dash ? { borderDash: dash } : {}),
    });
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          makeDataset("Productivity", [50,62,70,78,82,80,75,68,60,58,65,72], "rgb(184,134,11)"),
          makeDataset("Cooperation", [80,75,68,55,42,35,30,28,32,40,55,65], "rgb(139,26,26)"),
          makeDataset("Morale", [70,65,60,50,40,35,32,30,35,45,55,62], "rgb(168,152,128)", [5,5]),
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#a89880", font: { family: "'Source Sans 3', sans-serif", size: 11 }, padding: 20 } },
          tooltip: { backgroundColor: "#1a1208" },
        },
        scales: {
          x: { ticks: { color: "#a89880" }, grid: { color: "rgba(168,152,128,0.15)" } },
          y: { ticks: { color: "#a89880" }, grid: { color: "rgba(168,152,128,0.15)" }, min: 20, max: 100 },
        },
      },
    });
    return () => { chartRef.current?.destroy(); };
  }, []);

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans-display ${scrolled ? "bg-primary/95 backdrop-blur-sm shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-[1100px] mx-auto px-8 flex items-center justify-between h-10">
          <span className="font-display text-sm font-bold text-cream tracking-tight">The Incentive Paradox</span>
          <div className="hidden md:flex items-center gap-6">
            {navSections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={`text-[0.65rem] font-semibold tracking-[0.15em] uppercase transition-colors ${active === s.id ? "text-accent" : "text-cream/70 hover:text-cream"}`}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="newspaper-wrapper">
        <div className="newspaper-page">

          {/* ── MASTHEAD ── */}
          <header className="border-b-4 border-double border-rule pt-2 text-center bg-background">
            <div className="font-sans-display text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-muted-foreground flex justify-between items-center px-8 py-1.5 border-b border-rule">
              <span>Organisational Economics</span><span>★ ★ ★</span><span>Case Study VI · Public Sector</span>
            </div>
            <h1 className="font-display text-[clamp(2.8rem,8vw,6rem)] font-black tracking-tight leading-none px-8 pt-4 pb-2 text-foreground">The Incentive Paradox</h1>
            <p className="font-display italic text-[clamp(0.9rem,2vw,1.15rem)] text-muted-foreground pb-3 tracking-wide">When paying more got less done, and how behavioural science helped fix it</p>
            <div className="h-[3px] bg-foreground" />
          </header>

          {/* ── HERO ── */}
          <section className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0 px-8 py-10 border-b-2 border-rule">
            <div className="pr-0 md:pr-8 mb-8 md:mb-0 md:border-r-2 md:border-rule">
              <span className="kicker-label mb-3 block">By the numbers</span>
              {[{ stat: "3", desc: "Phases of organisational change" }, { stat: "4", desc: "Core economic concepts at play" }, { stat: "↑↓", desc: "Productivity up. Cooperation down." }].map((item, i) => (
                <div key={i}>
                  <div className="font-display text-[3.5rem] font-black leading-none text-foreground mb-1">{item.stat}</div>
                  <p className="text-[0.82rem] text-muted-foreground leading-relaxed">{item.desc}</p>
                  {i < 2 && <hr className="my-5 border-t border-rule" />}
                </div>
              ))}
            </div>
            <div className="md:pl-8">
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-tight mb-4 text-foreground">A government agency rewarded individual output. Output rose. Then everything else fell apart.</h2>
              <p className="drop-cap text-[0.95rem] text-light-ink mb-3">Performance-based pay worked at first. Then people stopped helping each other, shared less, and morale dropped. Money matters, but so do fairness, trust, and meaningful work.</p>
            </div>
          </section>

          {/* ── THEORY CARDS ── */}
          <section id="theory" className="max-w-[1100px] mx-auto px-8 py-10 border-b-2 border-rule">
            <SectionHeader number="§ I · Theory" title="Four Ideas That Explain It" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-2 border-rule">
              {theoryCards.map((card, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div
                    className={`p-6 border-b sm:border-b-0 sm:border-r border-rule last:border-r-0 last:border-b-0 transition-colors duration-250 cursor-default ${hovered === i ? "bg-primary text-primary-foreground" : ""}`}
                    onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                  >
                    <span className={`font-sans-display text-[0.6rem] font-semibold tracking-[0.2em] uppercase mb-3 block transition-colors ${hovered === i ? "text-cream-dark" : "text-muted-foreground"}`}>{card.num}</span>
                    <div className={`font-display text-[1.1rem] font-bold mb-2.5 leading-tight transition-colors ${hovered === i ? "text-cream-dark" : "text-foreground"}`}>{card.term}</div>
                    <p className={`text-[0.82rem] leading-relaxed mb-4 transition-colors ${hovered === i ? "text-cream-dark/80" : "text-light-ink"}`}>{card.body}</p>
                    <span className={`inline-block font-sans-display text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-2 py-0.5 rounded-sm transition-colors ${hovered === i ? "bg-accent text-cream" : "bg-cream-dark text-muted-foreground"}`}>{card.tag}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── EVIDENCE CHART ── */}
          <section id="evidence" className="max-w-[1100px] mx-auto px-8 py-10 border-b-2 border-rule">
            <SectionHeader number="§ II · Evidence" title="What Happened Across Three Phases" />
            <Reveal>
              <div className="bg-primary border-2 border-rule p-8">
                <h3 className="font-display text-[1.1rem] font-bold text-cream mb-1">Productivity, Cooperation and Morale Over Time</h3>
                <p className="text-[0.8rem] text-cream-dark/60 italic mb-6">How productivity, cooperation, and morale changed over time. Hover for details.</p>
                <div className="relative h-[320px]"><canvas ref={canvasRef} /></div>
                <div className="flex justify-around mt-4">
                  {[{ phase: "Phase I", title: "Individual Bonuses Begin" }, { phase: "Phase II", title: "Teamwork Starts Collapsing" }, { phase: "Phase III", title: "Recovery Begins" }].map((p, i) => (
                    <div key={i} className="text-center flex-1">
                      <span className="font-sans-display text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-cream-dark/60">{p.phase}</span>
                      <div className="font-display text-[0.85rem] italic text-cream">{p.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── COMPARISON ── */}
          <section id="comparison" className="max-w-[1100px] mx-auto px-8 py-10 border-b-2 border-rule">
            <SectionHeader number="§ III · Comparison" title="Before and After the Behavioural Fix" />
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-rule">
                <div className="p-7 border-b md:border-b-0 md:border-r border-rule bg-cream-dark">
                  <div className="font-sans-display text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent mb-3 flex items-center gap-2">Before · Individual Pay Model<span className="flex-1 h-px bg-accent/30" /></div>
                  <h3 className="font-display text-[1.15rem] font-bold mb-4 leading-tight text-foreground">How the system went wrong</h3>
                  <ul className="flex flex-col gap-2.5">
                    {beforeItems.map((item, i) => <li key={i} className="text-[0.85rem] text-light-ink flex gap-2.5 items-start leading-relaxed"><span className="text-accent text-[0.8rem] mt-0.5 shrink-0">✕</span>{item}</li>)}
                  </ul>
                </div>
                <div className="p-7">
                  <div className="font-sans-display text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-green mb-3 flex items-center gap-2">After · The Behavioural Fix<span className="flex-1 h-px bg-green/30" /></div>
                  <h3 className="font-display text-[1.15rem] font-bold mb-4 leading-tight text-foreground">How things improved</h3>
                  <ul className="flex flex-col gap-2.5">
                    {afterItems.map((item, i) => <li key={i} className="text-[0.85rem] text-light-ink flex gap-2.5 items-start leading-relaxed"><span className="text-green text-[0.8rem] mt-0.5 shrink-0">✓</span>{item}</li>)}
                  </ul>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── IMPLICATIONS ── */}
          <section id="implications" className="max-w-[1100px] mx-auto px-8 py-10 border-b-2 border-rule">
            <SectionHeader number="§ IV · Governance and Welfare" title="What This Actually Means" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Reveal><div><h3 className="font-display text-[1.05rem] font-bold mb-3 pb-1.5 border-b border-rule text-foreground">People's Wellbeing</h3><p className="text-[0.88rem] text-light-ink leading-relaxed">Systems that only measure output slowly damage meaningful work. When trust drops, you get burnout, turnover, and lower-quality work.</p></div></Reveal>
              <Reveal delay={0.1}><div><h3 className="font-display text-[1.05rem] font-bold mb-3 pb-1.5 border-b border-rule text-foreground">Governance</h3><p className="text-[0.88rem] text-light-ink leading-relaxed">Nudges like smart defaults can improve both efficiency and wellbeing while still preserving freedom of choice.</p></div></Reveal>
              <Reveal className="md:col-span-2">
                <div className="border-y-[3px] border-rule py-6 text-center my-2">
                  <p className="font-display text-[clamp(1.1rem,2.5vw,1.5rem)] italic text-foreground leading-snug max-w-[700px] mx-auto">"The question is never whether to architect the choice environment. It already is. The question is whether to do it thoughtfully."</p>
                  <cite className="block font-sans-display text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground mt-3 not-italic">Thaler and Sunstein, Nudge (2008)</cite>
                </div>
              </Reveal>
              <Reveal><div><h3 className="font-display text-[1.05rem] font-bold mb-3 pb-1.5 border-b border-rule text-foreground">People Don't Think Like Economists</h3><p className="text-[0.88rem] text-light-ink leading-relaxed">Most employees follow defaults, copy colleagues, and act on instinct. Systems built for perfectly rational people will keep failing in messy real life.</p></div></Reveal>
              <Reveal delay={0.1}><div><h3 className="font-display text-[1.05rem] font-bold mb-3 pb-1.5 border-b border-rule text-foreground">Use Both Tools Together</h3><p className="text-[0.88rem] text-light-ink leading-relaxed">Financial incentives still matter, but they work best when paired with behavioural design. The goal is simple: make cooperation the easier choice.</p></div></Reveal>
            </div>
          </section>

          {/* ── REAL WORLD ── */}
          <section id="realworld" className="max-w-[1100px] mx-auto px-8 py-10 border-b-2 border-rule">
            <SectionHeader number="§ V · Real World" title="This Actually Happened at Microsoft" />
            <Reveal>
              <div className="border-2 border-rule overflow-hidden">
                <div className="bg-primary p-4 px-7 flex items-center gap-5 border-b-2 border-rule flex-wrap">
                  <span className="font-sans-display text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-accent">Big Tech Case</span>
                  <span className="font-display text-2xl font-black text-cream tracking-tight">Microsoft</span>
                  <span className="font-sans-display text-[0.7rem] font-semibold text-cream-dark/60 tracking-wider ml-auto">Stack Ranking Era · Early 2000s to 2013</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">
                  <div className="p-7">
                    <span className="font-sans-display text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-accent mb-2.5 block">What went wrong</span>
                    <h3 className="font-display text-base font-bold text-foreground mb-3 leading-tight">The system that made teammates compete</h3>
                    <p className="text-[0.85rem] text-light-ink leading-relaxed mb-3">For years, Microsoft ranked employees on a forced bell curve: top performers, average performers, and a bottom group that risked demotion or firing.</p>
                    <p className="text-[0.85rem] text-light-ink leading-relaxed mb-4">Because only a fixed number could rank at the top, talented coworkers became threats. People hoarded information and avoided strong teammates.</p>
                    <blockquote className="border-l-[3px] border-accent pl-3.5 my-4 italic text-[0.82rem] text-muted-foreground leading-relaxed">
                      "People responsible for features will openly sabotage other people's efforts. I learned to give the appearance of being courteous while withholding just enough to ensure colleagues didn't get ahead of me."
                      <footer className="mt-1 not-italic text-[0.7rem] text-muted-foreground/70">Former Microsoft developer, Vanity Fair</footer>
                    </blockquote>
                    <div className="flex flex-wrap gap-1.5 mt-4">{["Crowding-Out Effect", "Zero-Sum Competition", "Social Preferences Destroyed"].map((t) => <span key={t} className="newspaper-tag">{t}</span>)}</div>
                  </div>
                  <div className="hidden md:block bg-rule" />
                  <div className="p-7 bg-cream-dark">
                    <span className="font-sans-display text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-green mb-2.5 block">What they did about it</span>
                    <h3 className="font-display text-base font-bold text-foreground mb-3 leading-tight">Then Microsoft changed the system</h3>
                    <p className="text-[0.85rem] text-light-ink leading-relaxed mb-3">In 2013, Microsoft scrapped stack ranking and shifted toward continuous feedback, team-based goals, and a more collaborative culture.</p>
                    <p className="text-[0.85rem] text-light-ink leading-relaxed mb-3">Employee satisfaction rose, collaboration improved, and Microsoft's culture became far healthier while the business surged again.</p>
                    <p className="text-[0.85rem] text-light-ink leading-relaxed">It's a strong real-world version of the same pattern: individual incentives damaged cooperation, and collaborative systems helped restore it.</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">{["Team-Based Goals", "Continuous Feedback", "Choice Architecture"].map((t) => <span key={t} className="newspaper-tag">{t}</span>)}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── SOLUTIONS ── */}
          <section id="solutions" className="max-w-[1100px] mx-auto px-8 py-10 border-b-2 border-rule">
            <SectionHeader number="§ VI · Proposed Solutions" title="Two Fixes That Could Actually Work" />
            <p className="text-[0.92rem] text-light-ink leading-relaxed max-w-[720px] mb-10">So what do you actually do about it? These two ideas go beyond tweaking bonuses and focus on the real issue: people work better when they feel part of a team, not stuck in internal competition.</p>
            {solutions.map((sol, i) => (
              <Reveal key={i} className={i < solutions.length - 1 ? "mb-8" : ""}>
                <div className="border-2 border-rule overflow-hidden">
                  <div className="flex items-center gap-5 p-4 px-6 bg-primary border-b-2 border-rule">
                    <span className="font-display text-[2rem] font-black text-accent leading-none shrink-0">{sol.number}</span>
                    <div>
                      <span className="font-sans-display text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-cream-dark/60 block mb-0.5">{sol.eyebrow}</span>
                      <span className="font-display text-[1.25rem] font-bold text-cream leading-tight">{sol.title}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
                    <div className="p-6 border-b md:border-b-0 md:border-r border-rule">
                      {sol.paragraphs.map((p, j) => <p key={j} className="text-[0.88rem] text-light-ink leading-relaxed mb-3 last:mb-0">{p}</p>)}
                    </div>
                    <div className="p-6 bg-cream-dark flex flex-col gap-4">
                      <div>
                        <span className="font-sans-display text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2.5 block">{sol.sidebarLabel}</span>
                        <div className="flex flex-col gap-2">
                          {sol.points.map((pt, k) => (
                            <div key={k} className="flex items-start gap-2.5 text-[0.82rem] text-light-ink leading-snug">
                              <span className={`w-[7px] h-[7px] rounded-full shrink-0 mt-1.5 ${k % 2 === 0 ? "bg-accent" : "bg-green"}`} />
                              {pt}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-rule">
                        <span className="font-sans-display text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground block mb-1.5">Grounded in</span>
                        <div className="flex flex-wrap gap-1.5">{sol.tags.map((t) => <span key={t} className="newspaper-tag">{t}</span>)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </section>

          {/* ── FOOTER ── */}
          <footer className="bg-primary text-cream-dark text-center p-8 font-sans-display text-[0.75rem] tracking-wider">
            <strong className="block font-display text-[1.1rem] mb-2 italic text-cream">The Incentive Paradox</strong>
            Case Study 6 · Organisational Economics · Behavioural Economics · Choice Architecture
            <br /><span className="text-cream-dark/60">Real-world reference: Microsoft Stack Ranking (2000s–2013) · Solutions: Gamification and Sports Hour</span>
          </footer>

        </div>
      </div>
    </>
  );
};

export default Index;
