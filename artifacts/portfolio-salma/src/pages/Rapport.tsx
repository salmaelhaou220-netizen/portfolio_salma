import { Link } from "wouter";
import {
  ClipboardList, Eye, Presentation, FileText,
  Building, MapPin, Users, Calendar, School, ArrowRight,
} from "lucide-react";
import { useEffect, useRef } from "react";

function StatCard({ icon: Icon, value, label, color, bg }: {
  icon: React.ElementType; value: number; label: string; color: string; bg: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cur = 0;
    const iv = setInterval(() => {
      cur = Math.min(cur + 1, value);
      el.textContent = String(cur);
      if (cur >= value) clearInterval(iv);
    }, 80);
    return () => clearInterval(iv);
  }, [value]);
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
        <Icon size={22} className={color} />
      </div>
      <div className={`font-serif text-4xl font-bold mb-1 ${color}`}>
        <span ref={ref}>0</span>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
    </div>
  );
}

const CARDS = [
  {
    key: "fiches",
    icon: ClipboardList,
    title: "Fiches de Préparation",
    desc: "Séances structurées selon les compétences du programme officiel, avec objectifs, déroulement et évaluation formative intégrée.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    filter: "fiches",
  },
  {
    key: "grilles",
    icon: Eye,
    title: "Grilles d'Observation",
    desc: "Outils d'évaluation par compétences permettant une observation structurée des pratiques pédagogiques lors des séances.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    filter: "grilles",
  },
  {
    key: "supports",
    icon: Presentation,
    title: "Supports de Cours",
    desc: "Présentations interactives, tutoriels et ressources numériques développés pour faciliter l'apprentissage des élèves.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    filter: "supports",
  },
  {
    key: "rapport",
    icon: FileText,
    title: "Rapport de Stage",
    desc: "Document de synthèse de l'ensemble du parcours de stage, rédigé selon les exigences du CRMEF Rabat et soumis en fin de formation.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    filter: "rapport",
  },
];

export default function Rapport() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-1">
          Rapport de Stage — CRMEF Rabat
        </h2>
        <p className="text-slate-500">
          Bilan de l'année de formation au Lycée Hommane El Fetouaki · 2024–2025
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={ClipboardList} value={4} label="Fiches de préparation" color="text-blue-600"   bg="bg-blue-50"   />
        <StatCard icon={Eye}           value={3} label="Grilles d'observation"  color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard icon={Presentation}  value={3} label="Supports de cours"      color="text-violet-600" bg="bg-violet-50" />
        <StatCard icon={FileText}      value={1} label="Rapport de Stage"        color="text-amber-600"  bg="bg-amber-50"  />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {CARDS.map(({ key, icon: Icon, title, desc, color, bg, filter }) => (
          <div
            key={key}
            className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={22} className={color} />
            </div>
            <h3 className="font-semibold text-slate-800 text-base mb-2">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{desc}</p>
            <Link
              href={`/documents?cat=${filter}`}
              className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:gap-3 transition-all"
            >
              <ArrowRight size={14} /> Consulter dans Mes Documents
            </Link>
          </div>
        ))}
      </div>

      {/* Établissement */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/15">
          <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building size={26} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-white">Lycée Hommane El Fetouaki</h3>
            <p className="text-blue-200 text-sm">Établissement d'accueil du stage de formation initiale</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: MapPin,    text: "Rabat — Académie AREF Rabat-Salé-Kénitra" },
            { icon: Users,     text: "Secondaire Qualifiant — Section Informatique" },
            { icon: Calendar,  text: "Année scolaire 2024–2025" },
            { icon: School,    text: "Encadrement CRMEF Rabat" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-blue-100 text-sm">
              <Icon size={15} className="text-blue-300 flex-shrink-0" /> {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
