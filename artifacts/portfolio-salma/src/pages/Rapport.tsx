import { Link } from "wouter";
import { ClipboardList, Eye, Presentation, FileText, Building, MapPin, Users, Calendar, School, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

function KpiCard({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cur = 0;
    const iv = setInterval(() => {
      cur = Math.min(cur + 1, value);
      el.textContent = String(cur);
      if (cur >= value) clearInterval(iv);
    }, 60);
    return () => clearInterval(iv);
  }, [value]);
  return (
    <div className="bg-white border border-border rounded-xl p-7 text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
      <div className="w-12 h-12 rounded-full bg-[#f5e6b8] flex items-center justify-center mx-auto mb-4 text-gold">
        <Icon size={22} />
      </div>
      <div className="font-serif text-4xl font-bold text-gold mb-2"><span ref={ref}>0</span></div>
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
    </div>
  );
}

const CARDS = [
  { icon: ClipboardList, title: "Fiches de Préparation", desc: "Séances structurées selon les compétences du programme officiel, avec objectifs, déroulement et évaluation formative intégrée." },
  { icon: Eye, title: "Grilles d'Observation", desc: "Outils d'évaluation par compétences permettant une observation structurée des pratiques pédagogiques lors des séances." },
  { icon: Presentation, title: "Supports de Cours", desc: "Présentations interactives, tutoriels et ressources numériques développés pour faciliter l'apprentissage des élèves." },
  { icon: FileText, title: "Projet de Fin de Formation", desc: "Mémoire de recherche synthétisant l'ensemble du parcours de stage et proposant des axes d'amélioration pédagogique." },
];

export default function Rapport() {
  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-9">
        <h2 className="font-serif text-3xl font-bold mb-2">Rapport de Stage</h2>
        <p className="text-muted-foreground">Bilan de l'année de formation au Lycée Hommane El Fetouaki</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <KpiCard icon={ClipboardList} value={4} label="Fiches de préparation" />
        <KpiCard icon={Eye} value={3} label="Grilles d'observation" />
        <KpiCard icon={Presentation} value={3} label="Supports de cours" />
        <KpiCard icon={FileText} value={1} label="Projet de fin de formation" />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-8">
        {CARDS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white border border-border rounded-xl p-7 shadow-sm hover:-translate-y-1 hover:border-gold transition-all duration-200 group">
            <div className="w-12 h-12 bg-[#f5e6b8] rounded-xl flex items-center justify-center text-gold mb-4">
              <Icon size={22} />
            </div>
            <h3 className="font-semibold text-base mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{desc}</p>
            <Link href="/documents"
              className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:gap-3 transition-all">
              <ArrowRight size={14} /> Consulter
            </Link>
          </div>
        ))}
      </div>

      {/* Établissement block */}
      <div className="bg-[#0f0f1a] rounded-2xl p-8 text-[#e8e4d8]">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[rgba(184,134,11,0.15)]">
          <div className="w-14 h-14 bg-[rgba(184,134,11,0.15)] rounded-xl flex items-center justify-center text-gold flex-shrink-0">
            <Building size={28} />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold">Lycée Hommane El Fetouaki</h3>
            <p className="text-[#8a8599] text-sm">Établissement d'accueil du stage de formation initiale</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: MapPin, text: "Rabat — Académie AREF Rabat-Salé-Kénitra" },
            { icon: Users, text: "Secondaire Qualifiant — Section Informatique" },
            { icon: Calendar, text: "Année scolaire 2024–2025" },
            { icon: School, text: "Encadrement CRMEF Rabat" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-[#8a8599] text-sm">
              <Icon size={16} className="text-gold flex-shrink-0" /> {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
