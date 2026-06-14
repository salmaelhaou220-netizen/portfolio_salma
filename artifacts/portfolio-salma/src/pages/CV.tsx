import { useEffect, useRef } from "react";
import { Code, BookOpen, Languages, CalendarDays, Building } from "lucide-react";

function SkillBar({ label, pct, color = "bg-blue-600" }: { label: string; pct: number; color?: string }) {
  const fillRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const t = setTimeout(() => { el.style.width = `${pct}%`; }, 100);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1.5 text-slate-700">
        <span>{label}</span>
        <span className="text-blue-600 font-semibold">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div ref={fillRef} className={`h-full ${color} rounded-full skill-bar-fill`} style={{ width: 0 }} />
      </div>
    </div>
  );
}

const TECH_SKILLS = [
  { label: "Python & Algorithmique", pct: 85 },
  { label: "HTML / CSS / JavaScript", pct: 80 },
  { label: "Cloud Computing (AWS / Azure)", pct: 70 },
  { label: "Bases de données (SQL)", pct: 75 },
  { label: "Réseaux & Systèmes", pct: 65 },
  { label: "Replit IDE & Outils Dev", pct: 78 },
];

const PED_SKILLS = [
  { label: "Conception de séquences", pct: 88, color: "bg-indigo-500" },
  { label: "Gestion de classe", pct: 80, color: "bg-indigo-500" },
  { label: "Évaluation formative", pct: 82, color: "bg-indigo-500" },
  { label: "Intégration TICE", pct: 90, color: "bg-indigo-500" },
];

const LANGS = [
  { name: "Arabe", dots: 5, level: "Natif" },
  { name: "Français", dots: 4, level: "B2" },
  { name: "Anglais", dots: 3, level: "B1" },
];

const TIMELINE = [
  { year: "2025–2026", title: "CRMEF Rabat", desc: "Formation initiale en Sciences de l'Éducation — Informatique Secondaire Qualifiant" },
  { year: "2023–En cours", title: "Master 2 — Génie Logiciel & Cloud Computing", desc: "Spécialisation en architectures cloud, conteneurisation et développement logiciel avancé" },
  { year: "2022–2023", title: "Licence en Informatique", desc: "Bases théoriques et pratiques en algorithmique, programmation et réseaux" },
  { year: "2020–2022", title: "BTS — Développement des Systèmes d'Information", desc: "Développement web, bases de données et gestion des systèmes d'information" },
  { year: "2020", title: "Baccalauréat Sciences Mathématiques", desc: "Mention Bien" },
];

const STAGE_INFO = [
  ["Établissement", "Lycée Hommane El Fetouaki"],
  ["Ville", "Rabat"],
  ["Niveau", "Secondaire Qualifiant"],
  ["Matière", "Informatique"],
  ["Formation", "CRMEF Rabat"],
  ["Académie", "AREF Rabat-Salé-Kénitra"],
];

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-slate-800 font-semibold text-base mb-5">
      <Icon size={17} className="text-blue-600" /> {children}
    </h3>
  );
}

export default function CV() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-1">CV & Parcours</h2>
        <p className="text-slate-500">Formation académique, compétences et expériences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left */}
        <div className="flex flex-col gap-8">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <SectionTitle icon={Code}>Compétences Techniques</SectionTitle>
            <div className="flex flex-col gap-4">
              {TECH_SKILLS.map(s => <SkillBar key={s.label} {...s} />)}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <SectionTitle icon={BookOpen}>Compétences Pédagogiques</SectionTitle>
            <div className="flex flex-col gap-4">
              {PED_SKILLS.map(s => <SkillBar key={s.label} {...s} />)}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <SectionTitle icon={Languages}>Langues</SectionTitle>
            <div className="flex flex-col gap-3.5">
              {LANGS.map(({ name, dots, level }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700 w-16">{name}</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < dots ? "bg-blue-600" : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-8">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <SectionTitle icon={CalendarDays}>Parcours Académique</SectionTitle>
            <div className="relative pl-6">
              <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-blue-100" />
              {TIMELINE.map(({ year, title, desc }, i) => (
                <div key={year} className={i < TIMELINE.length - 1 ? "pb-7" : ""}>
                  <div className="absolute -left-[22px] mt-0.5">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">{year}</div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">{title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <SectionTitle icon={Building}>Informations de Stage</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {STAGE_INFO.map(([label, val]) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{label}</div>
                  <div className="text-sm font-medium text-slate-800">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
