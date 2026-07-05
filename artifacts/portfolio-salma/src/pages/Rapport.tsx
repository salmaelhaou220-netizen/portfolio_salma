import { useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  MapPin, Eye, BookOpen, AlertTriangle, Lightbulb, Award,
  Users, Calendar, School, Building, ClipboardList, MonitorSmartphone,
  RotateCcw, BarChart2, Handshake, ArrowRight, FileText, Presentation,
  UserCheck, Monitor,
} from "lucide-react";

const STEPS = [
  { num: "01", icon: MapPin,          title: "Contexte & Établissement",           bg: "from-[#F5E6EE] to-white", accent: "#C084A0" },
  { num: "02", icon: Eye,             title: "Phase d'observation & Prise en main", bg: "from-[#F5E6EE] to-white", accent: "#C084A0" },
  { num: "03", icon: BookOpen,        title: "Mes Séances d'Enseignement",          bg: "from-[#F5E6EE] to-white", accent: "#C084A0" },
  { num: "04", icon: AlertTriangle,   title: "Défis & Difficultés",                 bg: "from-[#FFF4E6] to-white", accent: "#D97706" },
  { num: "05", icon: Lightbulb,       title: "Apprentissages & Réflexion",          bg: "from-[#EDFDF4] to-white", accent: "#059669" },
  { num: "06", icon: Award,           title: "Compétences Développées",             bg: "from-[#F5E6EE] to-white", accent: "#C084A0" },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function TimelineCard({
  num, icon: Icon, title, bg, accent, delay, children,
}: {
  num: string; icon: React.ElementType; title: string;
  bg: string; accent: string; delay: number; children: React.ReactNode;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="relative flex gap-6 mb-10"
      style={{ opacity: 0, transform: "translateY(16px)", transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}
    >
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10"
          style={{ background: accent, boxShadow: `0 0 0 4px ${accent}22` }}
        >
          {num}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden mb-2"
        style={{ border: "1px solid #F0D0E0" }}>
        <div className={`flex items-center gap-4 px-6 py-4 bg-gradient-to-r ${bg}`}
          style={{ borderBottom: "1px solid #F0D0E0" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${accent}18` }}>
            <Icon size={18} style={{ color: accent }} />
          </div>
          <h3 className="font-serif text-lg font-bold" style={{ color: "#2D1B25" }}>{title}</h3>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function DocLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link href={href}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
      style={{ background: "rgba(192,132,160,0.1)", color: "#9B5B7A", border: "1px solid rgba(192,132,160,0.25)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(192,132,160,0.2)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(192,132,160,0.1)"; }}
    >
      <Icon size={13} /> {label} <ArrowRight size={11} />
    </Link>
  );
}

function SeanceCard({ color, title, classe, methode, posture }: {
  color: string; title: string; classe: string; methode: string; posture: string;
}) {
  return (
    <div className="rounded-xl p-4 mb-3 last:mb-0"
      style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-semibold text-sm" style={{ color: "#3D2B35" }}>{title}</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: `${color}20`, color }}>{classe}</span>
      </div>
      <p className="text-xs text-slate-500 mb-2">{methode}</p>
      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: "rgba(192,132,160,0.12)", color: "#9B5B7A" }}>
        Posture : {posture}
      </span>
    </div>
  );
}

const STEPPER = [
  { n: "01", label: "Contexte" },
  { n: "02", label: "Observation" },
  { n: "03", label: "Séances" },
  { n: "04", label: "Défis" },
  { n: "05", label: "Réflexion" },
  { n: "06", label: "Compétences" },
];

const COMPETENCES = [
  { icon: ClipboardList,    label: "Conception de fiches de préparation" },
  { icon: Users,            label: "Gestion de classe" },
  { icon: MonitorSmartphone, label: "Intégration des TICE" },
  { icon: RotateCcw,        label: "Pédagogie différenciée" },
  { icon: BarChart2,        label: "Évaluation formative & sommative" },
  { icon: Handshake,        label: "Collaboration tuteur & CRMEF" },
];

export default function Rapport() {
  return (
    <div className="p-8 max-w-4xl mx-auto">

      {/* En-tête */}
      <div className="rounded-3xl px-10 py-10 mb-8 text-center"
        style={{ background: "linear-gradient(135deg, #F5E6EE 0%, #FDF8FA 100%)", border: "1px solid #E8B4C8" }}>
        <span className="inline-block text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(192,132,160,0.15)", color: "#9B5B7A", border: "1px solid rgba(192,132,160,0.3)" }}>
          <MapPin size={11} className="inline mr-1" />Lycée Hommane El Fetouaki · Rabat
        </span>
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#2D1B25" }}>Mon Parcours de Stage</h1>
        <p className="text-sm font-medium" style={{ color: "#9B7A8A" }}>
          Année scolaire 2025–2026 · CRMEF Rabat
        </p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl px-6 py-4 mb-10 flex flex-wrap items-center justify-between gap-2"
        style={{ border: "1px solid #F0D0E0", boxShadow: "0 2px 12px rgba(192,132,160,0.08)" }}>
        {STEPPER.map((s, i) => (
          <div key={s.n} className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: "#C084A0" }}>{s.n}</div>
            <span className="text-xs font-medium hidden sm:block" style={{ color: "#9B7A8A" }}>{s.label}</span>
            {i < STEPPER.length - 1 && (
              <div className="hidden sm:block ml-1.5 w-6 h-0.5 rounded" style={{ background: "#E8B4C8" }} />
            )}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute top-5 bottom-5 left-5 w-0.5 rounded-full"
          style={{ background: "linear-gradient(to bottom, #C084A0, #E8B4C8)" }} />

        {/* Step 1 — Contexte */}
        <TimelineCard {...STEPS[0]} delay={0}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { icon: Building,   text: "Lycée Qualifiant Hommane El Fetouaki, Rabat" },
              { icon: Calendar,   text: "février 2026 – Juin 2026" },
              { icon: Users,      text: "~36 élèves par classe" },
              { icon: School,     text: "Encadrement CRMEF Rabat–Salé–Kénitra" },
              { icon: UserCheck,  text: "Tuteur : M. BOUZIDI Abdelmajid" },
              { icon: Monitor,    text: "Matière : Informatique" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5" style={{ color: "#5A3D4A" }}>
                <Icon size={15} style={{ color: "#C084A0", flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(192,132,160,0.15)", color: "#9B5B7A", border: "1px solid rgba(192,132,160,0.25)" }}>
              Enseignement Secondaire Qualifiant · Informatique
            </span>
            <DocLink href="/documents?cat=rapport" icon={FileText} label="Rapport de Stage" />
          </div>
        </TimelineCard>

        {/* Step 2 — Observation */}
        <TimelineCard {...STEPS[1]} delay={80}>
          <div className="space-y-2 text-sm mb-4" style={{ color: "#5A3D4A" }}>
            {[
              "Observation des classes, analyse du niveau des élèves",
              "Découverte du programme officiel (Word, Excel, Algorithme et Programmation)",
              "Prise de contact avec le tuteur de stage",
              "Premier contact avec les élèves",
            ].map(item => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C084A0" }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(192,132,160,0.12)", color: "#9B5B7A" }}>
              Semaines 1–4
            </span>
            <DocLink href="/documents?cat=grilles" icon={FileText} label="Grilles d'observation" />
          </div>
        </TimelineCard>

        {/* Step 3 — Séances */}
        <TimelineCard {...STEPS[2]} delay={160}>
          <SeanceCard
            color="#7C3AED"
            title="Séance 1 — Mise en forme de texte avec Word"
            classe="TSCF 1 & TSCF 3"
            methode="Mise en situation, accroche avec un document mal formaté"
            posture="expert"
          />
          <SeanceCard
            color="#2563EB"
            title="Séance 2 — Introduction à Excel : interface et saisie"
            classe="TSCF 3"
            methode="Apprentissage par découverte guidée"
            posture="guide"
          />
          <SeanceCard
            color="#059669"
            title="Séance 3 — Formules Excel de base : SOMME, MOYENNE"
            classe="TSCF 3"
            methode="Résolution de problèmes concrets"
            posture="facilitateur"
          />
          <SeanceCard
            color="#C084A0"
            title="Évaluation sommative — Word + Excel"
            classe="TSCF 1 & TSCF 3"
            methode="Évaluation des acquis de fin de cycle"
            posture="expert"
          />
          <div className="flex items-center gap-3 flex-wrap mt-4 pt-4" style={{ borderTop: "1px solid #F0D0E0" }}>
            <DocLink href="/documents?cat=fiches"    icon={ClipboardList} label="Fiches de préparation" />
            <DocLink href="/documents?cat=supports"  icon={Presentation}  label="Supports de cours" />
          </div>
        </TimelineCard>

        {/* Step 4 — Difficultés */}
        <TimelineCard {...STEPS[3]} delay={240}>
          <div className="space-y-2.5">
            {[
              "Gestion du temps en classe : activités plus longues que prévu",
              "Élèves absents des postes informatiques (pas tous devant un PC)",
              "Hétérogénéité du niveau entre élèves",
              "Adapter l'explication en arabe dialectal et français simultanément",
            ].map(item => (
              <div key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "#92400E" }}>
                <span className="text-base leading-none flex-shrink-0">⚠️</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </TimelineCard>

        {/* Step 5 — Réflexion */}
        <TimelineCard {...STEPS[4]} delay={320}>
          <div className="space-y-2">
            {[
              "L'écart entre la planification et la réalité de la classe",
              "L'importance de la flexibilité pédagogique",
              "Développement de ma posture d'enseignante : guide, expert, facilitateur",
              "La valeur de l'évaluation formative continue",
            ].map(item => (
              <div key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "#065F46" }}>
                <Lightbulb size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#059669" }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </TimelineCard>

        {/* Step 6 — Compétences */}
        <TimelineCard {...STEPS[5]} delay={400}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COMPETENCES.map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex flex-col items-center text-center gap-2 rounded-xl p-3"
                style={{ background: "rgba(192,132,160,0.08)", border: "1px solid rgba(192,132,160,0.18)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(192,132,160,0.15)" }}>
                  <Icon size={16} style={{ color: "#C084A0" }} />
                </div>
                <span className="text-xs font-medium leading-tight" style={{ color: "#3D2B35" }}>{label}</span>
              </div>
            ))}
          </div>
        </TimelineCard>
      </div>
    </div>
  );
}
