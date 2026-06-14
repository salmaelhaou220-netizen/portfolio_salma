import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { GraduationCap, Award, Cloud, Monitor, FolderOpen, Quote, BookOpen, Target, Lightbulb, Rocket } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";

function KpiCard({ icon: Icon, value, label, color, bg, isText }: {
  icon: React.ElementType; value: number | string; label: string;
  color: string; bg: string; isText?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (isText || typeof value !== "number") return;
    const el = ref.current;
    if (!el) return;
    let current = 0;
    const step = Math.ceil(value / 40);
    const iv = setInterval(() => {
      current = Math.min(current + step, value);
      el.textContent = String(current);
      if (current >= value) clearInterval(iv);
    }, 30);
    return () => clearInterval(iv);
  }, [value, isText]);

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon size={22} className={color} />
      </div>
      <div className={`font-serif text-4xl font-bold mb-2 ${color}`}>
        {isText ? <span>{value}</span> : <span ref={ref}>0</span>}
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
    </div>
  );
}

export default function Accueil() {
  const { docs } = useDocuments();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Hero Banner — gradient bleu */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl px-12 py-14 mb-8 overflow-hidden shadow-lg">
        {/* Decoration circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 right-24 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative z-10 max-w-xl">
          <div className="flex flex-wrap gap-2.5 mb-6">
            {[
              { icon: GraduationCap, label: "CRMEF Rabat" },
              { icon: Award, label: "Stagiaire 2024–2025" },
              { icon: Cloud, label: "Master Cloud Computing" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90 bg-white/15 border border-white/20 backdrop-blur-sm">
                <Icon size={12} /> {label}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-2">Salma</h1>
          <p className="text-blue-100 text-xl font-medium mb-3">Professeure Stagiaire en Informatique</p>
          <p className="text-blue-200/80 text-sm leading-relaxed mb-8">
            Lycée Hommane El Fetouaki · Secondaire Qualifiant · Académie Rabat-Salé-Kénitra
          </p>
          <Link href="/documents"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg text-sm hover:bg-blue-50 transition-colors shadow-sm">
            <FolderOpen size={16} /> Voir mes documents
          </Link>
        </div>
      </div>

      {/* KPI Grid — 4 colonnes responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard icon={Monitor}       value={docs.length || 9}  label="Documents produits"    color="text-blue-600"   bg="bg-blue-50"   />
        <KpiCard icon={GraduationCap} value={4}                  label="Fiches de préparation" color="text-indigo-600" bg="bg-indigo-50"  />
        <KpiCard icon={Award}         value="M2"                 label="Niveau académique"     color="text-violet-600" bg="bg-violet-50" isText />
        <KpiCard icon={Monitor}       value={6}                  label="Outils TICE maîtrisés" color="text-sky-600"    bg="bg-sky-50"    />
      </div>

      {/* Citation */}
      <div className="bg-white border-l-4 border-blue-600 rounded-xl px-8 py-7 mb-8 shadow-sm flex items-start gap-5">
        <Quote size={28} className="text-blue-200 flex-shrink-0 mt-1" />
        <div>
          <p className="font-serif text-xl italic text-slate-700 leading-relaxed mb-2">
            "Enseigner, c'est apprendre deux fois."
          </p>
          <cite className="text-blue-600 text-sm not-italic font-semibold">— Joseph Joubert</cite>
        </div>
      </div>

      {/* About Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", title: "Profil", text: "Étudiante en Master 2 Génie Logiciel & Cloud Computing, passionnée par l'enseignement des sciences informatiques et la pédagogie active." },
          { icon: Target,   color: "text-indigo-600", bg: "bg-indigo-50", title: "Mission", text: "Développer les compétences numériques des élèves du secondaire qualifiant en rendant l'informatique accessible, créative et engageante." },
          { icon: Lightbulb, color: "text-violet-600", bg: "bg-violet-50", title: "Approche", text: "Pédagogie différenciée, intégration des TICE, apprentissage par projet et évaluation formative continue au cœur de chaque séance." },
          { icon: Rocket,   color: "text-sky-600", bg: "bg-sky-50", title: "Ambition", text: "Devenir une enseignante-chercheuse, contribuer à la transformation numérique de l'éducation au Maroc et encadrer les générations futures." },
        ].map(({ icon: Icon, color, bg, title, text }) => (
          <div key={title} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={20} className={color} />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-2">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
