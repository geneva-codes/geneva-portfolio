/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, type ReactNode, type WheelEvent, type PointerEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Cpu, 
  Database, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Code2, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Server,
  Workflow,
  AlertCircle,
  MonitorCheck,
  Package,
  GraduationCap,
  History,
  Send,
  MessageSquare,
  Moon,
  Sun,
  Menu,
  X,
  Download,
  Calendar,
  Star,
  Bot,
  Users,
  TrendingUp,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

// --- Particle Background ---
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; r: number; dx: number; dy: number }[] = [];
    const count = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const create = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.5,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(110, 231, 255, 0.3)';
      
      particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 - dist / 1000})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    resize();
    create();
    animate();
    window.addEventListener('resize', () => { resize(); create(); });
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- Modal Component ---
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

const ImageModal = ({ isOpen, onClose, image, title, caption }: { 
  isOpen: boolean; 
  onClose: () => void; 
  image: string; 
  title: string;
  caption: string;
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Reset zoom/pan whenever a new image is opened
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [image, isOpen]);

  const clampZoom = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  const zoomIn = () => setZoom((z) => {
    const next = clampZoom(z + ZOOM_STEP);
    if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
    return next;
  });

  const zoomOut = () => setZoom((z) => {
    const next = clampZoom(z - ZOOM_STEP);
    if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
    return next;
  });

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -ZOOM_STEP / 2 : ZOOM_STEP / 2;
    setZoom((z) => {
      const next = clampZoom(z + delta);
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleDoubleClick = () => {
    setZoom((z) => {
      if (z > MIN_ZOOM) {
        setPan({ x: 0, y: 0 });
        return MIN_ZOOM;
      }
      return clampZoom(MIN_ZOOM + ZOOM_STEP * 2);
    });
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (zoom <= MIN_ZOOM) return;
    isDragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging.current || zoom <= MIN_ZOOM) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-bg/95 backdrop-blur-2xl cursor-zoom-out"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-7xl w-full glass rounded-[32px] overflow-hidden shadow-2xl cursor-default"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-3 glass rounded-full hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 glass rounded-full p-1.5">
              <button
                onClick={zoomOut}
                disabled={zoom <= MIN_ZOOM}
                className="p-2.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold uppercase tracking-widest w-12 text-center select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoom >= MAX_ZOOM}
                className="p-2.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              {zoom > MIN_ZOOM && (
                <button
                  onClick={resetZoom}
                  className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row h-full">
              <div 
                ref={imgWrapRef}
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className={`lg:w-3/4 bg-black/40 flex items-center justify-center p-4 overflow-hidden select-none ${zoom > MIN_ZOOM ? (isDragging.current ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
                style={{ touchAction: 'none' }}
              >
                <img 
                  src={image} 
                  alt={title} 
                  draggable={false}
                  className="max-h-[80vh] w-full object-contain drop-shadow-2xl transition-transform duration-150 ease-out"
                  style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                />
              </div>
              <div className="lg:w-1/4 p-10 flex flex-col justify-center border-l border-white/5">
                <div className="mb-6 p-4 glass w-fit rounded-2xl shadow-xl">
                  <Workflow className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-3xl font-black mb-6 italic tracking-tight">{title}</h3>
                <p className="text-brand-muted text-lg leading-relaxed">{caption}</p>
                <p className="text-brand-muted/60 text-xs mt-6 uppercase tracking-widest font-bold">
                  Scroll or use +/− to zoom · Drag to pan · Double-click to reset
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Components ---
const SectionTitle = ({ subtitle, title, description }: { subtitle: string, title: string, description?: string }) => (
  <div className="mb-16 text-center reveal active">
    <span className="text-brand-primary font-bold uppercase tracking-wider text-sm block mb-3">{subtitle}</span>
    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">{title}</h2>
    {description && <p className="text-brand-muted max-w-2xl mx-auto text-lg leading-relaxed">{description}</p>}
  </div>
);

const NavLink = ({ href, children, active }: { href: string; children: ReactNode; active?: boolean }) => (
  <a 
    href={href} 
    className={`font-semibold transition-colors duration-200 relative group py-2
      ${active ? 'text-white' : 'text-brand-muted hover:text-white'}`}
  >
    {children}
    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-300
      ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} 
    />
  </a>
);

// --- Main App ---
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedImage, setSelectedImage] = useState<{ image: string; title: string; caption: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'ghl-projects', 'ghl-evidence', 'voice-ai', 'skills', 'projects', 'experience', 'education', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-brand-primary/30 selection:text-brand-primary">
      <ParticleBackground />

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-bg/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Terminal className="text-brand-bg w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">
              GENEVA<span className="text-brand-primary italic">.CODES</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="#home" active={activeSection === 'home'}>Home</NavLink>
            <NavLink href="#ghl-projects" active={activeSection === 'ghl-projects'}>GoHighLevel Systems</NavLink>
            <NavLink href="#voice-ai" active={activeSection === 'voice-ai'}>Voice AI Agents</NavLink>
            <NavLink href="#projects" active={activeSection === 'projects'}>Workflow Automation</NavLink>
            <NavLink href="#architecture" active={activeSection === 'architecture'}>Behind the Scenes</NavLink>
            <NavLink href="#skills" active={activeSection === 'skills'}>Capabilities</NavLink>
            <NavLink href="#experience" active={activeSection === 'experience'}>Professional Journey</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#contact" className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-brand-bg px-6 py-2.5 rounded-full font-bold shadow-xl hover:shadow-brand-primary/20 hover:scale-105 transition-all">
              Launch Workflow <Zap className="w-4 h-4" />
            </a>
            <button 
              className="md:hidden p-2 text-brand-muted hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-brand-bg pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-2xl font-bold italic">
              <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#ghl-projects" onClick={() => setMobileMenuOpen(false)}>GoHighLevel Systems</a>
              <a href="#voice-ai" onClick={() => setMobileMenuOpen(false)}>Voice AI Agents</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
              <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Technical Skills</a>
              <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Start Collaboration</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section id="home" className="container mx-auto px-6 py-20 min-h-[90vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-brand-primary/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Open for Collaboration</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                GENEVA <br />
                <span className="gradient-text">BAGONA</span>
              </h1>
              <p className="text-2xl md:text-3xl font-bold mb-8 text-white italic">
                AI Automation & Systems Integration Specialist
              </p>
              <p className="text-brand-muted text-lg leading-relaxed max-w-xl mb-10">
                Innovative and solutions-driven specialist building resilient, AI-powered automation architectures using <span className="text-white font-bold">n8n</span> and <span className="text-white font-bold">GoHighLevel</span>. 
                I bridge the gap between complex API integrations and practical business operations by designing reliable, logic-driven automation systems.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#projects" className="bg-white text-brand-bg px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-primary transition-colors shadow-2xl">
                  Strategic Projects <Layers className="w-5 h-5" />
                </a>
                <a href="#contact" className="glass px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
                  Contact Specialist <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="glass p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="font-mono text-sm space-y-4 text-brand-primary/90">
                  <p className="text-white whitespace-pre font-bold">// Enterprise Architecture Blueprint</p>
                  <p>const workflow = new n8n.Workflow(&apos;automation-engine&apos;);</p>
                  <p className="pl-4">workflow.on(&apos;incoming_webhook&apos;, async (data) =&gt; &#123;</p>
                  <p className="pl-8 text-brand-secondary">const sentiment = await OpenAI.analyze(data.lead);</p>
                  <p className="pl-8 text-brand-accent">if (sentiment.score &gt; 0.8) &#123;</p>
                  <p className="pl-12">await CRM.route(&apos;HOT_LEAD&apos;, data);</p>
                  <p className="pl-12">await Slack.alert(&apos;New High-Intent Opportunity!&apos;);</p>
                  <p className="pl-8">&#125; else &#123;</p>
                  <p className="pl-12">await EmailNurture.start(data.lead);</p>
                  <p className="pl-8">&#125;</p>
                  <p className="pl-4">&#125;);</p>
                  <p className="text-brand-muted pl-4">// Logic-driven efficiency verified.</p>
                </div>
                <div className="mt-8 flex gap-4">
                  <div className="flex-1 glass p-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-black text-brand-muted mb-1">Reliability-Focused Architecture</p>
                    <p className="text-2xl font-black">Designed</p>
                  </div>
                  <div className="flex-1 glass p-4 rounded-2xl bg-brand-primary/10">
                    <p className="text-[10px] uppercase font-black text-brand-primary mb-1">Data Integrity Controls</p>
                    <p className="text-2xl font-black">Validated</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-xl animate-bounce">
                <Cpu className="text-brand-primary w-8 h-8" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-xl animate-pulse">
                <Database className="text-brand-secondary w-8 h-8" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* GoHighLevel Automation Systems */}
        <section id="ghl-projects" className="py-24 container mx-auto px-6">
          <SectionTitle
            subtitle="GOHIGHLEVEL + n8n + OPENAI"
            title="GoHighLevel Automation Systems"
            description="10 production-pattern GHL systems built end-to-end over a 10-day intensive build sprint — CRM automation, AI scoring, and a fully bidirectional custom API integration."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-brand-primary" />,
                title: "AI-Powered Onboarding & Lead Nurture Ecosystem",
                subtitle: "FLAGSHIP · BIDIRECTIONAL API",
                desc: "A custom GHL ↔ n8n ↔ OpenAI integration: new opportunities trigger AI-driven enrichment and a personalized outreach draft, written straight back into the CRM via the API.",
                features: ["Webhook + REST API v2 Write-back", "OpenAI-Generated Outreach Drafts", "Safe JSON Escaping for Multi-line AI Text", "Zero-Downtime Token Scope Rotation"]
              },
              {
                icon: <Zap className="w-8 h-8 text-brand-secondary" />,
                title: "AI Lead Qualification System",
                subtitle: "AI SCORING · AUTO-ROUTING",
                desc: "Every new lead is scored 0-100 by AI the moment it comes in, then automatically routed to a Hot Lead or Nurture path with zero manual review.",
                features: ["GPT-4o-mini Lead Scoring", "Real-Time API Field Write-back", "Race-Condition-Safe Timing", "Hot/Nurture Auto-Tagging"]
              },
              {
                icon: <Calendar className="w-8 h-8 text-brand-accent" />,
                title: "Appointment Booking & No-Show Recovery",
                subtitle: "FULL LIFECYCLE AUTOMATION",
                desc: "End-to-end appointment lifecycle — booking, multi-stage reminders, and automatic no-show recovery that routes lost leads back into the sales pipeline.",
                features: ["Automated Multi-Stage Reminders", "No-Show Detection & Recovery", "Live Timing-Logic Verification", "Pipeline Stage Auto-Routing"]
              },
              {
                icon: <Star className="w-8 h-8 text-white" />,
                title: "Reputation Management Automation",
                subtitle: "SENTIMENT-BASED ROUTING",
                desc: "Post-sale review requests are routed by sentiment — 4-5 star responses go public, 1-3 star feedback is intercepted internally for private resolution.",
                features: ["Sentiment-Based If/Else Routing", "Public Reputation Protection", "Dual Pipeline & Status Triggers", "Survey-Driven Feedback Capture"]
              }
            ].map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl hover:bg-white/10 transition-all border-white/5 hover:border-brand-primary/30 flex flex-col group"
              >
                <div className="mb-6 p-4 glass rounded-2xl self-start group-hover:scale-110 transition-transform">{project.icon}</div>
                <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-2">{project.subtitle}</h4>
                <h3 className="text-xl font-bold mb-4">{project.title}</h3>
                <p className="text-brand-muted mb-6 flex-grow text-sm">{project.desc}</p>
                <ul className="space-y-3">
                  {project.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Additional Systems - Compact Grid */}
          <div className="glass rounded-3xl p-8 md:p-10">
            <h4 className="text-sm font-black text-brand-primary uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Additional Systems Delivered
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: <Users className="w-5 h-5 text-brand-primary" />, title: "Multi-Step Client Onboarding Automation", desc: "Auto-captures intake data and books kickoff calls with zero staff coordination." },
                { icon: <TrendingUp className="w-5 h-5 text-brand-secondary" />, title: "Automated Sales Pipeline Manager", desc: "Stale-opportunity alerts, AI-synced naming, and a live sales reporting dashboard." },
                { icon: <Phone className="w-5 h-5 text-brand-accent" />, title: "Missed Call Recovery Automation", desc: "Instant SMS text-back on missed calls, feeding straight into AI lead scoring." },
                { icon: <Server className="w-5 h-5 text-white" />, title: "SaaS Client Provisioning Workflow", desc: "Centralized custom-value config for fast, template-based client account setup." },
                { icon: <Bot className="w-5 h-5 text-brand-primary" />, title: "AI Customer Support Routing", desc: "Knowledge-base-grounded AI chat agent with human handover safeguards." },
                { icon: <MessageSquare className="w-5 h-5 text-brand-secondary" />, title: "Sales Follow-up Engine", desc: "3-tier, score-based nurture cadence with timezone-aware internal hot-lead alerts." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="p-3 glass rounded-xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                    <p className="text-brand-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GHL Systems - Screenshot Evidence */}
        <section id="ghl-evidence" className="py-24 container mx-auto px-6">
          <SectionTitle
            subtitle="LIVE SYSTEM PROOF"
            title="GoHighLevel — Screenshot Evidence"
            description="Real, verified screenshots from the live build — not mockups. Click any card to view full-size."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Bidirectional Integration — n8n Execution",
                caption: "Flagship Day 9 build: the full 4-node n8n chain (Webhook → Enrichment → OpenAI → HTTP Write-back) executing successfully.",
                icon: <Sparkles className="w-6 h-6 text-brand-primary" />,
                image: "/assets/ghl/day9-n8n-execution.png"
              },
              {
                title: "AI Outreach Draft — Written to CRM",
                caption: "The AI-generated outreach draft, written back into the GHL contact record via the REST API v2 — proof of the round trip.",
                icon: <CheckCircle2 className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/ghl/day9-ai-outreach-field.png"
              },
              {
                title: "AI Lead Scoring Workflow",
                caption: "The Lead Triage workflow canvas — webhook trigger, AI scoring, and Hot/Nurture routing logic.",
                icon: <Zap className="w-6 h-6 text-brand-accent" />,
                image: "/assets/ghl/day2-lead-triage-workflow.png"
              },
              {
                title: "AI Lead Scoring — n8n Execution",
                caption: "The n8n side of the Day 2 build: Webhook → OpenAI scoring → HTTP write-back, executing successfully end-to-end.",
                icon: <Sparkles className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/ghl/day2-n8n-execution.png"
              },
              {
                title: "Scored Contact Record",
                caption: "A contact record showing the populated ai_lead_score field and the auto-applied Hot Lead tag.",
                icon: <CheckCircle2 className="w-6 h-6 text-white" />,
                image: "/assets/ghl/day2-contact-scored.png"
              },
              {
                title: "Appointment Booking Calendar",
                caption: "The live client-facing booking calendar — 30-minute slots, Mon–Sat, with buffer times enforced.",
                icon: <Calendar className="w-6 h-6 text-brand-primary" />,
                image: "/assets/ghl/day4-booking-calendar.png"
              },
              {
                title: "No-Show Recovery Workflow",
                caption: "Automated no-show detection, re-engagement SMS, and pipeline stage routing back into active follow-up.",
                icon: <Workflow className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/ghl/day4-noshow-workflow.png"
              },
              {
                title: "Sentiment-Based Reputation Routing",
                caption: "The Reputation Management workflow — survey trigger, sentiment If/Else split, public vs. private routing.",
                icon: <Star className="w-6 h-6 text-brand-accent" />,
                image: "/assets/ghl/day7-reputation-workflow.png"
              },
              {
                title: "Weekly Sales Snapshot Dashboard",
                caption: "Live reporting dashboard — stage distribution, lead source breakdown, and opportunity status at a glance.",
                icon: <TrendingUp className="w-6 h-6 text-white" />,
                image: "/assets/ghl/day5-weekly-dashboard.png"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                onClick={() => setSelectedImage({ image: item.image, title: item.title, caption: item.caption })}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass group relative overflow-hidden rounded-[32px] aspect-[4/5] cursor-zoom-in hover:border-brand-primary/40 transition-all"
              >
                <div className="absolute inset-0 z-0 overflow-hidden bg-black/20">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent opacity-80" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end">
                  <div className="mb-3 w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary/20 transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-brand-muted text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Voice AI Agents — Cross-Platform Build */}
        <section id="voice-ai" className="py-24 container mx-auto px-6">
          <SectionTitle
            subtitle="ELEVENLABS + GOHIGHLEVEL NATIVE"
            title="Voice AI Agents — Built on Two Platforms"
            description="Same persona, same clinic, same appointment-coordinator role — built and tested natively on both platforms to produce a real, evidence-based comparison instead of a documentation-only one."
          />

          {/* Two-platform comparison cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl border-white/5 hover:border-brand-primary/30 transition-all flex flex-col"
            >
              <div className="mb-6 p-4 glass rounded-2xl self-start">
                <Bot className="w-8 h-8 text-brand-primary" />
              </div>
              <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-2">ELEVENLABS · EXTERNAL ORCHESTRATION</h4>
              <h3 className="text-2xl font-bold mb-4">"Maya" — ElevenLabs Voice Agent</h3>
              <p className="text-brand-muted mb-6 flex-grow">
                A conversational voice agent with a freeform system prompt, RAG-backed Knowledge Base, and a custom Server Tool that hands reschedule requests off to an n8n webhook for logging.
              </p>
              <ul className="space-y-3">
                {[
                  "Freeform prompt + dynamic variables ({{patient_name}}, {{appointment_date}})",
                  "Custom log_reschedule_request Server Tool → n8n webhook",
                  "Knowledge Base with clinic policies & FAQ",
                  "Outbound calling architecture validated (blocked only on phone number purchase)"
                ].map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-3xl border-white/5 hover:border-brand-secondary/30 transition-all flex flex-col"
            >
              <div className="mb-6 p-4 glass rounded-2xl self-start">
                <Phone className="w-8 h-8 text-brand-secondary" />
              </div>
              <h4 className="text-xs font-black text-brand-secondary uppercase tracking-widest mb-2">GOHIGHLEVEL · NATIVE PLATFORM ACTIONS</h4>
              <h3 className="text-2xl font-bold mb-4">"Maya" — GHL Native Voice Agent</h3>
              <p className="text-brand-muted mb-6 flex-grow">
                The same persona rebuilt inside GHL's structured prompt schema, using the native Appointment Booking action to read and write directly to a real GHL calendar — no external webhook layer required.
              </p>
              <ul className="space-y-3">
                {[
                  "Structured prompt schema with GHL's fixed section headers",
                  "Native Appointment Booking action — real calendar read/write",
                  "Reused & extended existing Knowledge Base (added no-show policy)",
                  "Live-tested: booking, reschedule, and cancellation — all verified against real records"
                ].map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-brand-secondary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* What building both taught me */}
          <div className="glass rounded-3xl p-8 md:p-10 mb-12">
            <h4 className="text-sm font-black text-brand-accent uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> What Building Both Platforms Surfaced
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <AlertCircle className="w-5 h-5 text-red-400" />,
                  title: "Found & fixed a real security gap",
                  desc: "The GHL agent disclosed real appointment details to an unverified caller. Rewrote the identity-confirmation rule to require a name-check before sharing any detail — then verified the fix with an adversarial retest."
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5 text-brand-primary" />,
                  title: "Closed a documented architecture gap",
                  desc: "The ElevenLabs build only ever logged a simulated reschedule. The GHL native Appointment Booking action closed that gap for real — a live test call wrote an actual appointment to the calendar and triggered a real confirmation email."
                },
                {
                  icon: <Server className="w-5 h-5 text-brand-secondary" />,
                  title: "Traced an unrelated production bug",
                  desc: "A live confirmation email had literal unfilled placeholders ([Clinic Address], [Phone Number]). Traced it to hardcoded text in a workflow's Email action and fixed it with reusable GHL Custom Values instead of patching the symptom."
                },
                {
                  icon: <MonitorCheck className="w-5 h-5 text-white" />,
                  title: "Verified outcomes, not the AI's claims",
                  desc: "Every action tested — booking, reschedule, cancellation — was cross-checked against the actual GHL Appointments record, not just the agent's spoken confirmation that it was 'done.'"
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="p-3 glass rounded-xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                    <p className="text-brand-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshot Evidence */}
          <div className="mb-4 text-center">
            <span className="text-brand-secondary font-bold uppercase tracking-wider text-xs">LIVE SYSTEM PROOF</span>
            <h3 className="text-2xl font-bold mt-2">Voice AI — Screenshot Evidence</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              {
                title: "ElevenLabs — Agent System Prompt",
                caption: "Maya's full system prompt: role, goals, reschedule handling rules, and the instruction to call the log_reschedule_request tool.",
                icon: <Terminal className="w-6 h-6 text-brand-primary" />,
                image: "/assets/voice-ai/eleven-system-prompt.png"
              },
              {
                title: "ElevenLabs — Dynamic Variables",
                caption: "patient_name, appointment_date, and appointment_time wired as dynamic variables, populated per-call from real contact data.",
                icon: <Zap className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/voice-ai/eleven-dynamic-variables.png"
              },
              {
                title: "ElevenLabs — Knowledge Base",
                caption: "The RAG-backed Knowledge Base document: clinic hours, rescheduling policy, no-show policy, and cancellation rules Maya grounds her answers in.",
                icon: <Layers className="w-6 h-6 text-brand-accent" />,
                image: "/assets/voice-ai/eleven-knowledge-base.png"
              },
              {
                title: "ElevenLabs — Reschedule Tool Config",
                caption: "The log_reschedule_request Server Tool: structured parameters (patient_name, new_date, new_time, reason) sent to the n8n webhook.",
                icon: <Bot className="w-6 h-6 text-brand-primary" />,
                image: "/assets/voice-ai/eleven-reschedule-tool.png"
              },
              {
                title: "ElevenLabs — Live Reschedule Call",
                caption: "A real conversation transcript: patient requests a reschedule, agent confirms the new date/time, and the log_reschedule_request tool fires successfully — visible right in the transcript.",
                icon: <MessageSquare className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/voice-ai/eleven-reschedule-conversation.png"
              },
              {
                title: "ElevenLabs — Call Analytics",
                caption: "Per-call observability: AI-generated summary, LLM/TTS latency breakdown per turn, and production environment metadata — not just a transcript, a monitored system.",
                icon: <MonitorCheck className="w-6 h-6 text-brand-accent" />,
                image: "/assets/voice-ai/eleven-conversation-analytics.png"
              },
              {
                title: "n8n — Outbound Call Architecture",
                caption: "The annotated Voice Outbound Call Trigger workflow: no-show detected → call details formatted → request sent to ElevenLabs' voice API.",
                icon: <Workflow className="w-6 h-6 text-brand-accent" />,
                image: "/assets/voice-ai/eleven-n8n-outbound-architecture.png"
              },
              {
                title: "n8n — The Architecture Gap, Documented",
                caption: "The Voice Reschedule Handler workflow, annotated with its own limitation: confirms in-conversation only, doesn't yet write to the GHL calendar — the exact gap the GHL native build closed.",
                icon: <AlertCircle className="w-6 h-6 text-brand-primary" />,
                image: "/assets/voice-ai/eleven-n8n-reschedule-gap.png"
              },
              {
                title: "GHL Native — Structured Prompt",
                caption: "Maya rebuilt inside GHL's fixed-schema prompt editor: Agent Role, Handling Rules, and a Structured Call Flow Script.",
                icon: <Terminal className="w-6 h-6 text-brand-accent" />,
                image: "/assets/voice-ai/ghl-structured-prompt.png"
              },
              {
                title: "Knowledge Base — Reused & Extended",
                caption: "The existing Loopline Clinic Knowledge Base attached to the native agent, with usage instructions for when to pull from it.",
                icon: <Layers className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/voice-ai/ghl-knowledge-base-attached.png"
              },
              {
                title: "Knowledge Base — The Actual Content",
                caption: "The 9 FAQ entries Maya grounds her answers in — clinic hours, pricing, no-show policy, insurance, walk-ins — shared across the lead-qualification bot and the voice agent.",
                icon: <MessageSquare className="w-6 h-6 text-brand-accent" />,
                image: "/assets/voice-ai/ghl-knowledge-base-faq-content.png"
              },
              {
                title: "Agent Behavior — Tuned, Not Default",
                caption: "Response speed, interruption sensitivity, and LLM temperature tuned by hand — including Taglish hold-phrases ('wait lang') for natural pauses.",
                icon: <Zap className="w-6 h-6 text-brand-primary" />,
                image: "/assets/voice-ai/ghl-agent-behavior-tuning.png"
              },
              {
                title: "GHL Native — Appointment Booking Action",
                caption: "The native Appointment Booking action, bound to the real 'Clinic Appointment Booking' calendar — no external webhook needed.",
                icon: <Calendar className="w-6 h-6 text-brand-primary" />,
                image: "/assets/voice-ai/ghl-appointment-booking-config.png"
              },
              {
                title: "The Live Booking Call",
                caption: "A full end-to-end test call: identity check, availability lookup, slot selection, phone/email capture and confirmation — the exact call that produced the calendar record and email below.",
                icon: <Bot className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/voice-ai/ghl-live-booking-call.png"
              },
              {
                title: "Real Calendar Write-Back",
                caption: "The GHL Appointments detail view showing that same appointment booked live by the voice agent — Source: 'Voice ai.'",
                icon: <CheckCircle2 className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/voice-ai/ghl-real-appointment-booked.png"
              },
              {
                title: "The Bug, Before the Fix",
                caption: "The confirmation email as first built — literal unfilled placeholders ([Clinic Address], [Phone Number]) going out to real patients.",
                icon: <AlertCircle className="w-6 h-6 text-red-400" />,
                image: "/assets/voice-ai/ghl-bug-before-fix.png"
              },
              {
                title: "The Fix — Merge Tags In the Template",
                caption: "The Email action editor showing {{custom_values.clinic_address}} and {{custom_values.clinic_phone}} inserted directly into the message body.",
                icon: <Server className="w-6 h-6 text-brand-primary" />,
                image: "/assets/voice-ai/ghl-email-fix-template.png"
              },
              {
                title: "Custom Values — The Fix",
                caption: "clinic_address and clinic_phone created as reusable GHL Custom Values, replacing hardcoded placeholder text in the email template.",
                icon: <Server className="w-6 h-6 text-brand-accent" />,
                image: "/assets/voice-ai/ghl-custom-values.png"
              },
              {
                title: "Confirmation Email — Fixed",
                caption: "The same email after the Custom Values fix — real address and phone number, no placeholder text.",
                icon: <CheckCircle2 className="w-6 h-6 text-white" />,
                image: "/assets/voice-ai/ghl-confirmation-email-fixed.png"
              },
              {
                title: "Identity Verification Fix",
                caption: "The rewritten Structured Call Flow Script — the agent now opens every call with a name-check before sharing any appointment detail.",
                icon: <AlertCircle className="w-6 h-6 text-brand-primary" />,
                image: "/assets/voice-ai/ghl-identity-verification-fix.png"
              },
              {
                title: "Outbound Calling — Compliance Gate",
                caption: "A native outbound call attempt, blocked by GHL's own KYC/disclosure compliance gate — the platform's equivalent honesty check to ElevenLabs' phone-number requirement.",
                icon: <AlertCircle className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/voice-ai/ghl-outbound-compliance-gate.png"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                onClick={() => setSelectedImage({ image: item.image, title: item.title, caption: item.caption })}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass group relative overflow-hidden rounded-[32px] aspect-[4/5] cursor-zoom-in hover:border-brand-primary/40 transition-all"
              >
                <div className="absolute inset-0 z-0 overflow-hidden bg-black/20">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent opacity-80" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end">
                  <div className="mb-3 w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary/20 transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-brand-muted text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Workflow Automation Projects */}
        <section id="projects" className="py-24 bg-white/2 overflow-hidden">
          <div className="container mx-auto px-6">
            <SectionTitle 
              subtitle="n8n ARCHITECTURE" 
              title="Enterprise Automation Projects" 
              description="Designing resilient workflow systems with AI-assisted routing, validation, state checks, and structured error handling."
            />

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-brand-primary" />,
                  title: "Enterprise Lead Automation System",
                  subtitle: "AI-Powered CRM Engine",
                  desc: "Architected an AI-assisted lead automation engine that ingests leads via Webhooks and performs real-time AI intent analysis.",
                  features: ["AI Intent Scoring", "Dynamic CRM Routing", "Fallback Degradation Pathways", "State-Checking Logic"]
                },
                {
                  icon: <MonitorCheck className="w-8 h-8 text-brand-secondary" />,
                  title: "Intelligent Reply Detection System",
                  subtitle: "Gmail IMAP Monitoring",
                  desc: "Dual-layered inbox monitor triggered by Gmail IMAP to halt sequences and verify sender identity using probabilistic AI fallback.",
                  features: ["Deterministic UI Search", "Probabilistic AI Fallback", "CRM Hygiene Maintenance", "Sequence Auto-Halt"]
                },
                {
                  icon: <AlertCircle className="w-8 h-8 text-brand-accent" />,
                  title: "Global Error Handling Microservice",
                  subtitle: "System-Wide Monitoring",
                  desc: "Centralized monitoring service that captures node failures, timeouts, and payload errors across all active workflows.",
                  features: ["Proactive Diagnostics", "Real-time Slack Alerts", "Payload Error Capturing", "Centralized Error Monitoring"]
                }
              ].map((project, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-8 rounded-3xl hover:bg-white/10 transition-all border-white/5 hover:border-brand-primary/30 flex flex-col group"
                >
                  <div className="mb-6 p-4 glass rounded-2xl self-start group-hover:scale-110 transition-transform">{project.icon}</div>
                  <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-2">{project.subtitle}</h4>
                  <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                  <p className="text-brand-muted mb-6 flex-grow">{project.desc}</p>
                  <ul className="space-y-3">
                    {project.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                        <CheckCircle2 className="w-4 h-4 text-brand-primary" /> {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Architecture Deep Dive */}
        <section id="architecture" className="py-24 container mx-auto px-6">
          <SectionTitle 
            subtitle="BEHIND THE SCENES" 
            title="Technical Architecture" 
            description="A detailed look into the workflow logic, AI integrations, validation controls, and error-handling patterns behind my automation systems. Click any card to expand screenshot details."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "AI Prompt Engineering",
                caption: "Prompt Engineering: Structuring LLM instructions for precise sentiment and intent classification.",
                icon: <MessageSquare className="w-6 h-6 text-brand-primary" />,
                image: "/assets/architecture/prompt-engineering.png"
              },
              {
                title: "Google Sheets Fail-Safe",
                caption: "Data Integrity Controls: Real-time monitoring of database write operations with critical state-checking logic.",
                icon: <Database className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/architecture/sheets-integration.png"
              },
              {
                title: "Global Error Handler",
                caption: "Centralized Error Monitoring: A dedicated handler catching payload errors and triggering Slack diagnostics.",
                icon: <AlertCircle className="w-6 h-6 text-brand-accent" />,
                image: "/assets/architecture/error-handler.png"
              },
              {
                title: "Logic-Driven Routing",
                caption: "Dynamic Workflows: AI-assisted fallback paths that handle diverse lead scenarios while preserving deterministic routing logic.",
                icon: <Workflow className="w-6 h-6 text-brand-primary" />,
                image: "/assets/architecture/logic-routing.png"
              },
              {
                title: "AI Identity Verifier",
                caption: "Sender Validation: Intent-based verification to confirm authentic engagement and halt sequences.",
                icon: <CheckCircle2 className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/architecture/identity-verifier.png"
              },
              {
                title: "Lead Automation Orchestration",
                caption: "System Architecture: Comprehensive overview of the lead-ingestion and nurturing automation engine.",
                icon: <Layers className="w-6 h-6 text-white" />,
                image: "/assets/architecture/orchestration-Lead-Automation-System-(AI-Powered).png"
              },
              {
                title: "Reply Detection Engine",
                caption: "Intelligence Engine: Dual-layered monitor triggered by Gmail IMAP to verify sender identity.",
                icon: <MonitorCheck className="w-6 h-6 text-brand-secondary" />,
                image: "/assets/architecture/orchestration-Reply-Detection-System.png"
              },
              {
                title: "System-Wide Monitor",
                caption: "Global Observability: Centralized service monitoring for node failures and timeouts across workflows.",
                icon: <Zap className="w-6 h-6 text-brand-accent" />,
                image: "/assets/architecture/orchestration-System-Wide-Error-Handler.png"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                onClick={() => setSelectedImage({ image: item.image, title: item.title, caption: item.caption })}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass group relative overflow-hidden rounded-[32px] aspect-[4/5] cursor-zoom-in hover:border-brand-primary/40 transition-all"
              >
                {/* Image Container */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-black/20">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent opacity-80" />
                </div>
                
                {/* Content Banner */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end">
                  <div className="mb-3 w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary/20 transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-brand-primary transition-colors leading-tight">{item.title}</h3>
                  <p className="text-[11px] text-brand-muted leading-relaxed line-clamp-2">{item.caption}</p>
                </div>

                {/* Hover UI */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="glass p-2 rounded-full">
                    <ExternalLink className="w-4 h-4 text-brand-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 glass rounded-3xl p-8 border-brand-accent/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h4 className="text-2xl font-black mb-4 italic">RELIABILITY-FOCUSED AUTOMATION</h4>
                <p className="text-brand-muted leading-relaxed">
                  These screenshots represent active components from my automation builds. The systems combine deterministic workflow logic with AI-assisted analysis, data validation, state checks, and centralized error monitoring to create workflows that are easier to verify, troubleshoot, and maintain.
                </p>
              </div>
              <div className="flex gap-4">
                 <div className="text-center px-6 py-4 glass rounded-[20px]">
                    <div className="text-brand-primary font-black text-3xl">Validated</div>
                    <div className="text-[10px] uppercase font-black text-brand-muted">Integrity Controls</div>
                 </div>
                 <div className="text-center px-6 py-4 glass rounded-[20px]">
                    <div className="text-brand-secondary font-black text-3xl">LIVE</div>
                    <div className="text-[10px] uppercase font-black text-brand-muted">Monitoring</div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Foundation (C++) */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="glass rounded-[40px] overflow-hidden p-12 lg:flex gap-16 items-center">
              <div className="lg:w-1/2">
                <SectionTitle 
                  subtitle="Engineering Foundation" 
                  title="Systems Programming in C++" 
                  description="Leveraging core software engineering principles to build robust, logic-driven inventory and management software."
                />
                <div className="space-y-8">
                  {[
                    {
                      label: "Pharmacy & Inventory Management",
                      desc: "Engineered logic-driven stock tracking with persistent file storage (ifstream/ofstream) and receipt generation."
                    },
                    {
                      label: "Data Management Systems",
                      desc: "Implemented automated stock deduction and low-stock alert systems ensuring accuracy in high-stakes environments."
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0">
                        <Package className="text-brand-secondary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-1">{item.label}</h4>
                        <p className="text-brand-muted">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 mt-12 lg:mt-0 grid grid-cols-2 gap-4">
                <div className="glass rounded-3xl aspect-square flex flex-col items-center justify-center p-6 text-center">
                  <Code2 className="w-10 h-10 text-brand-primary mb-4" />
                  <span className="text-xs uppercase font-black tracking-widest">Logic Flow</span>
                </div>
                <div className="glass rounded-3xl aspect-square flex flex-col items-center justify-center p-6 text-center bg-white/5">
                  <Server className="text-brand-secondary w-10 h-10 mb-4" />
                  <span className="text-xs uppercase font-black tracking-widest">Data Persistence</span>
                </div>
                <div className="glass rounded-3xl aspect-square flex flex-col items-center justify-center p-6 text-center bg-white/5">
                  <Workflow className="text-brand-accent w-10 h-10 mb-4" />
                  <span className="text-xs uppercase font-black tracking-widest">Optimization</span>
                </div>
                <div className="glass rounded-3xl aspect-square flex flex-col items-center justify-center p-6 text-center">
                  <Cpu className="text-brand-primary w-10 h-10 mb-4" />
                  <span className="text-xs uppercase font-black tracking-widest">Systems Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Capabilities */}
        <section id="skills" className="py-24 container mx-auto px-6">
          <SectionTitle 
            subtitle="THE TECH STACK" 
            title="Core Competencies" 
            description="Expertise across automation platforms, system integration, and foundational software engineering."
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Automation", skills: ["n8n (Advanced)", "Zapier", "Make", "Microservices"], color: "brand-primary" },
              { title: "GoHighLevel / CRM", skills: ["Workflow Builder", "Conversation AI Agents", "Pipelines & Custom Fields", "Account Snapshots"], color: "brand-accent" },
              { title: "Integration", skills: ["REST APIs", "Webhooks", "JSON Parsing", "Slack/G-Suite"], color: "brand-secondary" },
              { title: "Artificial Intelligence", skills: ["OpenAI API", "Intent Scoring", "Sentiment Analysis", "Verification"], color: "brand-accent" },
              { title: "Engineering", skills: ["C++ Programming", "System Logic", "File Handling", "Architecture"], color: "white" }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl group"
              >
                <h4 className="font-black text-xs uppercase text-brand-muted tracking-[0.2em] mb-6">{cat.title}</h4>
                <ul className="space-y-4">
                  {cat.skills.map((skill, j) => (
                    <li key={j} className="flex items-center gap-3 font-bold group-hover:translate-x-1 transition-transform">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${cat.color}`} />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience & Education */}
        <section id="experience" className="py-24 bg-white/2">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20">
              {/* Experience */}
              <div>
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                    <History className="text-brand-primary" />
                   </div>
                   <h3 className="text-3xl font-black italic">PROFESSIONAL HISTORY</h3>
                </div>
                <div className="space-y-12 relative border-l border-white/10 pl-10 pr-4">
                   {[
                    {
                      company: "Coron District Hospital",
                      role: "Pharmacy Assistant (Data & Inventory Focus)",
                      period: "2021 – 2023",
                      points: [
                        "Maintained highly accurate digital inventory records of medicines.",
                        "Organized expiration schedules ensuring zero data discrepancies.",
                        "Developed strong attention to detail in high-stakes environments."
                      ]
                    },
                    {
                      company: "Mitzumi Philippines Inc.",
                      role: "Production Operator (QA Focus)",
                      period: "2011",
                      points: [
                        "Executed operational workflows with focus on high accuracy and efficiency.",
                        "Maintained systematic consistency in a time-sensitive production setting."
                      ]
                    }
                   ].map((job, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[54px] top-0 w-7 h-7 rounded-full bg-brand-bg border-4 border-brand-primary shadow-[0_0_15px_rgba(110,231,255,0.4)]" />
                      <div className="glass p-6 rounded-3xl">
                        <span className="text-brand-primary font-black text-xs uppercase tracking-widest">{job.period}</span>
                        <h4 className="text-xl font-bold mt-1">{job.role}</h4>
                        <p className="text-brand-muted font-bold mb-4">{job.company}</p>
                        <ul className="space-y-2">
                          {job.points.map((p, j) => (
                            <li key={j} className="text-sm text-brand-muted leading-relaxed">• {p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                   ))}
                </div>
              </div>

              {/* Education */}
              <div id="education">
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                    <GraduationCap className="text-brand-secondary" />
                   </div>
                   <h3 className="text-3xl font-black italic">EDUCATION</h3>
                </div>
                <div className="glass p-8 rounded-[40px] border-brand-secondary/20">
                  <span className="text-brand-secondary font-black text-xs uppercase tracking-widest mb-4 block">Major Foundation</span>
                  <h4 className="text-2xl font-black mb-2">Bachelor of Science in Computer Engineering</h4>
                  <p className="text-brand-muted font-bold mb-6">University of Perpetual Help System Dalta</p>
                  <p className="text-lg leading-relaxed text-brand-muted">
                    Built a robust technical foundation in systems logic, algorithm design, and software programming during 4 years of undergraduate studies. 
                    Specialized in C++ systems engineering which now powers my advanced logic-driven workflow designs.
                  </p>
                  <div className="mt-8 flex gap-3 flex-wrap">
                    <span className="glass px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Algorithm Design</span>
                    <span className="glass px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">System Logic</span>
                    <span className="glass px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">File Handling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Selector */}
        <section id="contact" className="py-24 container mx-auto px-6">
          <div className="glass rounded-[50px] p-12 lg:p-20 relative overflow-hidden text-center max-w-5xl mx-auto">
            <div className="relative z-10">
              <SectionTitle 
                subtitle="LET&apos;S CONNECT" 
                title="Scale Your Operations Today" 
                description="Looking for an automation partner to build your next-generation workflow architecture? I am available for strategic projects and long-term collaboration."
              />
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <a href="mailto:genevabagona16@gmail.com" className="glass p-8 rounded-3xl hover:bg-brand-primary group transition-all">
                  <Mail className="w-10 h-10 mx-auto mb-4 group-hover:text-brand-bg transition-colors" />
                  <h4 className="font-bold group-hover:text-brand-bg uppercase text-xs tracking-widest mb-2">Email Me</h4>
                  <p className="text-sm font-semibold truncate group-hover:text-brand-bg text-brand-muted">genevabagona16@gmail.com</p>
                </a>
                <a href="tel:+639502280777" className="glass p-8 rounded-3xl hover:bg-brand-secondary group transition-all">
                  <Phone className="w-10 h-10 mx-auto mb-4 group-hover:text-brand-bg transition-colors" />
                  <h4 className="font-bold group-hover:text-brand-bg uppercase text-xs tracking-widest mb-2">Call Subject</h4>
                  <p className="text-sm font-semibold group-hover:text-brand-bg text-brand-muted">+63 950 228 0777</p>
                </a>
                <div className="glass p-8 rounded-3xl">
                  <MapPin className="w-10 h-10 mx-auto mb-4 text-brand-accent" />
                  <h4 className="font-bold uppercase text-xs tracking-widest mb-2">Base of Operations</h4>
                  <p className="text-sm font-semibold text-brand-muted">Coron, Palawan, Philippines</p>
                </div>
              </div>

              <div className="mt-16 flex justify-center gap-8">
                <a href="https://www.linkedin.com/public-profile/settings?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact-info%3Bjcehz%2BadQP%2B4VvAj%2FsgXgg%3D%3D" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-2xl hover:scale-110 transition-transform"><Linkedin /></a>
                <a href="https://github.com/geneva-codes" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-2xl hover:scale-110 transition-transform"><Github /></a>
                <a href="#" className="p-4 glass rounded-2xl hover:scale-110 transition-transform"><ExternalLink /></a>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[120px]" />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-brand-primary" />
             </div>
             <span className="font-black italic text-sm tracking-widest">GENEVA.CODES</span>
          </div>
          <p className="text-brand-muted text-sm font-bold">
            © 2026 Geneva G. Bagona. Designed for <span className="text-white">Zero Data Loss</span>.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-black uppercase tracking-widest text-brand-primary hover:text-white transition-colors"
          >
            Back to Top
          </button>
        </div>
      </footer>

      {/* Popups & Modals */}
      <ImageModal 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage?.image || ''}
        title={selectedImage?.title || ''}
        caption={selectedImage?.caption || ''}
      />
    </div>
  );
}

