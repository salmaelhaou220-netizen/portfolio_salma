import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { GraduationCap, Award, Cloud, Monitor, FolderOpen, Quote } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";

function KpiCard({ icon: Icon, value, label, isText }: { icon: React.ElementType; value: number | string; label: string; isText?: boolean }) {
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
    <div className="bg-white border border-border rounded-xl p-7 text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
      <div className="w-12 h-12 rounded-full bg-[#f5e6b8] flex items-center justify-center mx-auto mb-4 text-gold">
        <Icon size={22} />
      </div>
      <div className="font-serif text-4xl font-bold text-gold mb-2 leading-none">
        {isText ? <span>{value}</span> : <span ref={ref}>0</span>}
      </div>
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
    </div>
  );
}

export default function Accueil() {
  const { docs } = useDocuments();

  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="relative bg-[#0f0f1a] rounded-2xl px-14 py-16 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(184,134,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,134,11,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-xl">
          <div className="flex flex-wrap gap-2.5 mb-6">
            {[
              { icon: GraduationCap, label: "CRMEF Rabat" },
              { icon: Award, label: "Stagiaire 2024–2025" },
              { icon: Cloud, label: "Master Cloud Computing" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-gold border border-[rgba(184,134,11,0.25)] bg-[rgba(184,134,11,0.1)]">
                <Icon size={12} /> {label}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-6xl font-bold text-[#e8e4d8] leading-tight mb-3">Salma</h1>
          <p className="font-serif text-2xl italic text-gold mb-4">Professeure Stagiaire en Informatique</p>
          <p className="text-[#8a8599] text-sm leading-relaxed mb-8">
            Lycée Hommane El Fetouaki · Secondaire Qualifiant · Académie Rabat-Salé-Kénitra
          </p>
          <Link href="/documents"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-[#d4a017] text-[#0f0f1a] font-semibold rounded-lg text-sm transition-colors">
            <FolderOpen size={16} /> Voir mes documents
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <KpiCard icon={Monitor} value={docs.length || 12} label="Documents produits" />
        <KpiCard icon={GraduationCap} value={4} label="Fiches de préparation" />
        <KpiCard icon={Award} value="M2" label="Niveau académique" isText />
        <KpiCard icon={Monitor} value={6} label="Outils TICE maîtrisés" />
      </div>

      {/* Quote */}
      <div className="bg-[#0f0f1a] rounded-2xl px-12 py-10 mb-8 border-l-4 border-gold relative">
        <Quote size={32} className="absolute top-5 left-6 text-gold opacity-30" />
        <blockquote>
          <p className="font-serif text-2xl italic text-[#e8e4d8] leading-relaxed mb-3">
            "Enseigner, c'est apprendre deux fois."
          </p>
          <cite className="text-gold text-sm not-italic font-medium">— Joseph Joubert</cite>
        </blockquote>
      </div>

      {/* About cards */}
      <div className="grid grid-cols-2 gap-5">
        {[
          { icon: "👤", title: "Profil", text: "Étudiante en Master 2 Génie Logiciel & Cloud Computing, passionnée par l'enseignement des sciences informatiques et la pédagogie active." },
          { icon: "🎯", title: "Mission", text: "Développer les compétences numériques des élèves du secondaire qualifiant en rendant l'informatique accessible, créative et engageante." },
          { icon: "💡", title: "Approche", text: "Pédagogie différenciée, intégration des TICE, apprentissage par projet et évaluation formative continue au cœur de chaque séance." },
          { icon: "🚀", title: "Ambition", text: "Devenir une enseignante-chercheuse, contribuer à la transformation numérique de l'éducation au Maroc et encadrer les générations futures." },
        ].map(({ icon, title, text }) => (
          <div key={title} className="bg-white border border-border rounded-xl p-7 shadow-sm hover:border-gold transition-all duration-200 hover:-translate-y-0.5">
            <div className="w-11 h-11 bg-[#f5e6b8] rounded-xl flex items-center justify-center text-xl mb-4">{icon}</div>
            <h3 className="font-serif text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
