import {
  BookOpen, Monitor, Users, ClipboardCheck, Lightbulb, Building, Laptop, ExternalLink,
} from "lucide-react";

const ICONS: Record<string, typeof BookOpen> = {
  BookOpen, Monitor, Users, ClipboardCheck, Lightbulb, Building, Laptop,
};

const productions = [
  {
    numero: "01",
    badge: "DIDACTIQUE",
    badgeColor: "#C084A0",
    icone: "BookOpen",
    titre: "Didactique & Planification",
    modules: "Planification des apprentissages · Didactique de l'informatique · Production didactique",
    productions: "Présentations · Travaux pratiques · Fiches pédagogiques, support de cours, fiche des évaluations",
    lien: "https://drive.google.com/drive/folders/1phUkUpPuLqF9grotDy_au-QCrzt4W4Qm?usp=sharing",
  },
  {
    numero: "02",
    badge: "DISCIPLINAIRE",
    badgeColor: "#9B5B7A",
    icone: "Monitor",
    titre: "Contenu Disciplinaire",
    modules: "Algorithmique & Programmation · Logiciels Bureautique · Réseaux · Architecture des Ordinateurs",
    productions: "Présentations · TPs · Exercices pratiques",
    lien: "https://drive.google.com/drive/folders/1JC6ykjocfsxuhusRMHYNmt871dr7cfTE?usp=sharing",
  },
  {
    numero: "03",
    badge: "GESTION",
    badgeColor: "#7B6FA0",
    icone: "Users",
    titre: "Gestion de Classe",
    modules: "Gestion des apprentissages 1 & 2 · Sciences de l'éducation",
    productions: "Présentations · micro-enseignement",
    lien: "https://drive.google.com/drive/folders/1jezt8fmqCzcjH9SEwt9Q85iPi-TMXURx?usp=sharing",
  },
  {
    numero: "04",
    badge: "ÉVALUATION",
    badgeColor: "#B07A5A",
    icone: "ClipboardCheck",
    titre: "Évaluation des Apprentissages",
    modules: "Évaluation des apprentissages · Gestion des apprentissages 2",
    productions: "Outils d'évaluation",
    lien: "https://drive.google.com/drive/folders/1phUkUpPuLqF9grotDy_au-QCrzt4W4Qm?usp=sharing",
  },
  {
    numero: "05",
    badge: "RÉFLEXIVITÉ",
    badgeColor: "#5A7A8A",
    icone: "Lightbulb",
    titre: "Réflexivité & Recherche-Action",
    modules: "Analyse des pratiques · Méthodologie de recherche-action",
    productions: "Projet de groupe · rapport de pff · Grilles d'observation",
    lien: "https://drive.google.com/drive/folders/1AChaD8fTr5qhC2Mn_Opb7yItfNcxn7h9?usp=sharing",
  },
  {
    numero: "06",
    badge: "INSTITUTIONNEL",
    badgeColor: "#6A8A6A",
    icone: "Building",
    titre: "Dimension Institutionnelle",
    modules: "Vie scolaire · Législation et éthique",
    productions: "Présentations",
    lien: "https://drive.google.com/drive/folders/1phUkUpPuLqF9grotDy_au-QCrzt4W4Qm?usp=sharing",
  },
  {
    numero: "07",
    badge: "TICE",
    badgeColor: "#C084A0",
    icone: "Laptop",
    titre: "Outils Numériques & TICE",
    modules: "TICE · Logiciels",
    productions: "Présentations · Supports numériques créés",
    lien: "https://drive.google.com/drive/folders/1wMJ-mHUVSuGVpk6X3AEDkem67zg2mnNP?usp=sharing",
  },
];

export default function Productions() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#3D2B35" }}>Productions de Formation</h2>
        <p className="text-slate-500">Présentations, travaux pratiques et productions réalisés durant la formation CRMEF · 2025–2026</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {productions.map(({ numero, badge, badgeColor, icone, titre, modules, productions: prods, lien }) => {
          const Icon = ICONS[icone] ?? BookOpen;
          const isPlaceholder = /^LIEN_0\d$/.test(lien);

          return (
            <div key={numero}
              className="relative bg-white rounded-2xl border border-[#F0D0E0] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C084A0"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#F0D0E0"; }}
            >
              <div className="p-6 pb-4 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl font-light leading-none" style={{ color: badgeColor, opacity: 0.2 }}>
                    {numero}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: badgeColor }}>
                    {badge}
                  </span>
                </div>

                <div className="flex flex-col items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#F5E6EE" }}>
                    <Icon size={20} style={{ color: badgeColor }} />
                  </div>
                  <h3 className="font-serif text-lg font-bold" style={{ color: "#2D1B25" }}>{titre}</h3>
                </div>

                <div className="border-t border-[#F0D0E0] pt-4 flex flex-col gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: "#C084A0" }}>Modules</p>
                    <p className="text-xs text-gray-500">{modules}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: "#9B5B7A" }}>Productions</p>
                    <p className="text-xs text-gray-500 italic">{prods}</p>
                  </div>
                </div>
              </div>

              {isPlaceholder ? (
                <button
                  disabled
                  className="w-full py-3 text-xs font-semibold flex items-center justify-center gap-1.5 bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  Documents à venir
                </button>
              ) : (
                <a
                  href={lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-t transition-colors"
                  style={{ borderColor: "#C084A0", color: "#C084A0" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5E6EE"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  Voir les documents <ExternalLink size={13} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
