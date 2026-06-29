import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { GraduationCap, Award, Cloud, Monitor, FolderOpen, Quote, BookOpen, Target, Lightbulb, Rocket, Camera } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuth } from "@/hooks/useAuth";

function KpiCard({ icon: Icon, value, label, isText }: {
  icon: React.ElementType; value: number | string; label: string; isText?: boolean;
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
    <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:-translate-y-0.5 transition-all duration-200"
      style={{ border: "1px solid #F0D0E0", boxShadow: "0 2px 8px rgba(192,132,160,0.08)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(192,132,160,0.2)"; (e.currentTarget as HTMLElement).style.borderColor = "#C084A0"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(192,132,160,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "#F0D0E0"; }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F5E6EE" }}>
        <Icon size={22} style={{ color: "#C084A0" }} />
      </div>
      <div className="font-serif text-4xl font-bold mb-2" style={{ color: "#C084A0" }}>
        {isText ? <span>{value}</span> : <span ref={ref}>0</span>}
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
    </div>
  );
}

export default function Accueil() {
  const { docs } = useDocuments();
  const { isAdmin } = useAuth();
  const [photoError, setPhotoError] = useState(false);
  const [photoKey, setPhotoKey] = useState(0);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const res = await fetch("/api/photo", { method: "POST", credentials: "include", body: fd });
      if (res.ok) { setPhotoError(false); setPhotoKey(k => k + 1); }
    } catch { }
    e.target.value = "";
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Hero — deux colonnes, rose pastel */}
      <div className="relative rounded-3xl overflow-hidden mb-8"
        style={{
          background: "linear-gradient(135deg, #F5E6EE 0%, #EDD5E5 50%, #F0D6E8 100%)",
          border: "1px solid #E8B4C8",
          boxShadow: "0 8px 40px rgba(192,132,160,0.15)",
        }}
      >
        {/* Blobs décoratifs */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none" style={{ background: "rgba(232,180,200,0.25)" }} />
        <div className="absolute -bottom-6 right-32 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(192,132,160,0.12)" }} />
        <div className="absolute top-4 left-1/2 w-14 h-14 rounded-full pointer-events-none" style={{ background: "rgba(232,180,200,0.3)" }} />
        <div className="absolute bottom-4 left-8 w-10 h-10 rounded-full pointer-events-none" style={{ background: "rgba(192,132,160,0.15)" }} />

        <div className="relative z-10 flex items-center gap-8 px-10 py-12">
          {/* Colonne gauche — 60% */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2.5 mb-6">
              {[
                { icon: GraduationCap, label: "CRMEF Rabat" },
                { icon: Award,         label: "Stagiaire 2025–2026" },
                { icon: Cloud,         label: "Master Cloud Computing" },
              ].map(({ icon: Icon, label }) => (
                <span key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
                  style={{ background: "rgba(192,132,160,0.15)", border: "1px solid rgba(192,132,160,0.3)", color: "#3D2B35" }}
                >
                  <Icon size={12} style={{ color: "#C084A0" }} /> {label}
                </span>
              ))}
            </div>

            <h1 className="font-serif text-5xl font-bold leading-tight mb-2" style={{ color: "#2D1B25" }}>EL HAOU SALMA</h1>
            <p className="text-xl font-medium mb-3" style={{ color: "#C084A0" }}>Enseignante Stagiaire en Informatique</p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "#9B7A8A" }}>
              Lycée Hommane El Fetouaki · Secondaire Qualifiant · Académie Rabat-Salé-Kénitra
            </p>
            <Link href="/documents"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
              style={{ background: "#C084A0" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#9B5B7A"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#C084A0"; }}
            >
              <FolderOpen size={16} /> Voir mes documents
            </Link>
          </div>

          {/* Colonne droite — 40% — photo */}
          <div className="hidden md:flex flex-col items-center gap-3 flex-shrink-0">
            <div className="relative group">
              {photoError ? (
                <div className="w-48 h-48 rounded-full flex items-center justify-center text-white font-bold text-7xl font-serif select-none"
                  style={{ background: "linear-gradient(135deg,#C084A0,#9B5B7A)", outline: "4px solid #E8B4C8", outlineOffset: "4px" }}>
                  S
                </div>
              ) : (
                <img
                  key={photoKey}
                  src={`/photo-salma.jpg?v=${photoKey}`}
                  alt="EL HAOU SALMA"
                  className="w-48 h-48 rounded-full object-cover"
                  style={{ outline: "4px solid #E8B4C8", outlineOffset: "4px" }}
                  onError={() => setPhotoError(true)}
                />
              )}
              {isAdmin && (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  title="Changer la photo"
                  className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(45,27,37,0.6)" }}
                >
                  <Camera size={28} className="text-white" />
                  <span className="text-white text-[10px] font-semibold">Changer</span>
                </button>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <p className="text-xs text-center font-medium" style={{ color: "#C084A0" }}>✨ Bienvenue sur mon portfolio</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard icon={Monitor}       value={docs.length || 9} label="Documents produits"    />
        <KpiCard icon={GraduationCap} value={4}                label="Fiches de préparation" />
        <KpiCard icon={Award}         value="M2"               label="Niveau académique"      isText />
        <KpiCard icon={Monitor}       value={6}                label="Outils TICE maîtrisés"  />
      </div>

      {/* Citation */}
      <div className="bg-white rounded-xl px-8 py-7 mb-8 shadow-sm flex items-start gap-5"
        style={{ borderLeft: "4px solid #C084A0", border: "1px solid #F0D0E0", borderLeftWidth: "4px", borderLeftColor: "#C084A0" }}
      >
        <Quote size={28} className="flex-shrink-0 mt-1" style={{ color: "#F0D0E0" }} />
        <div>
          <p className="font-serif text-xl italic leading-relaxed mb-2" style={{ color: "#3D2B35" }}>
            "Enseigner, c'est apprendre deux fois."
          </p>
          <cite className="text-sm not-italic font-semibold" style={{ color: "#C084A0" }}>— Joseph Joubert</cite>
        </div>
      </div>

      {/* About Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { icon: BookOpen,  title: "Profil",    text: "Étudiante en Master 2 Génie Logiciel & Cloud Computing, passionnée par l'enseignement des sciences informatiques et la pédagogie active." },
          { icon: Target,    title: "Mission",   text: "Développer les compétences numériques des élèves du secondaire qualifiant en rendant l'informatique accessible, créative et engageante." },
          { icon: Lightbulb, title: "Approche",  text: "Pédagogie différenciée, intégration des TICE, apprentissage par projet et évaluation formative continue au cœur de chaque séance." },
          { icon: Rocket,    title: "Ambition",  text: "Devenir une enseignante-chercheuse, contribuer à la transformation numérique de l'éducation au Maroc et encadrer les générations futures." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title}
            className="bg-white rounded-xl p-6 shadow-sm transition-all duration-200"
            style={{ border: "1px solid #F0D0E0" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C084A0"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(192,132,160,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#F0D0E0"; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#F5E6EE" }}>
              <Icon size={20} style={{ color: "#C084A0" }} />
            </div>
            <h3 className="font-semibold text-base mb-2" style={{ color: "#3D2B35" }}>{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
