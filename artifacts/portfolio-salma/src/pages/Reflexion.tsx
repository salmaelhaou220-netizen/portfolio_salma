import { ThumbsUp, TrendingUp, Notebook, Star } from "lucide-react";

const STRENGTHS = [
  "Maîtrise du contenu disciplinaire en informatique",
  "Intégration efficace des outils TICE dans les séances",
  "Capacité d'adaptation au profil des élèves",
  "Créativité dans la conception des supports pédagogiques",
  "Bonne gestion du temps de la séance",
];

const AXES = [
  "Renforcer les techniques de questionnement socratique",
  "Diversifier davantage les modalités d'évaluation",
  "Améliorer la différenciation pédagogique",
  "Développer les activités de travail collaboratif",
  "Approfondir la gestion des situations conflictuelles",
];

const JOURNAL = [
  { date: "Octobre 2024", title: "Première immersion en classe", text: "La prise de contact avec les élèves a révélé des niveaux très hétérogènes. J'ai ajusté mon approche en proposant des activités différenciées dès la deuxième séance, ce qui a amélioré la participation globale." },
  { date: "Décembre 2024", title: "Intégration de Kahoot en classe", text: "L'utilisation de Kahoot pour la révision des notions de base en algorithmique a été un véritable catalyseur de motivation. Les élèves les plus discrets ont activement participé, signe d'une dynamique inclusive." },
  { date: "Février 2025", title: "Projet de programmation en Python", text: "La mise en place d'un mini-projet collaboratif sur Replit a permis aux élèves de développer leur autonomie et leur esprit de résolution de problèmes. Une expérience riche, à reproduire et approfondir." },
  { date: "Avril 2025", title: "Bilan de mi-stage", text: "Après six mois, je mesure le chemin parcouru : de stagiaire observatrice à praticienne réflexive. Chaque défi rencontré a été une opportunité de croissance professionnelle et personnelle." },
];

const AUTOEVAL = [
  { competence: "Maîtrise disciplinaire", stars: 4, level: "Bien", cls: "bg-green-50 text-green-700" },
  { competence: "Planification pédagogique", stars: 4, level: "Bien", cls: "bg-green-50 text-green-700" },
  { competence: "Gestion de classe", stars: 3, level: "Assez bien", cls: "bg-orange-50 text-orange-700" },
  { competence: "Évaluation des apprentissages", stars: 4, level: "Bien", cls: "bg-green-50 text-green-700" },
  { competence: "Intégration des TICE", stars: 5, level: "Excellent", cls: "bg-[#f5e6b8] text-[#b8860b]" },
  { competence: "Communication professionnelle", stars: 4, level: "Bien", cls: "bg-green-50 text-green-700" },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} className={i < n ? "text-gold fill-gold" : "text-border fill-border"} />
      ))}
    </div>
  );
}

export default function Reflexion() {
  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-9">
        <h2 className="font-serif text-3xl font-bold mb-2">Analyse Réflexive</h2>
        <p className="text-muted-foreground">Retour critique sur la pratique pédagogique</p>
      </div>

      {/* Strengths & axes */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="bg-white border border-green-200 border-t-4 border-t-green-600 rounded-xl p-7 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-base mb-5">
            <ThumbsUp size={16} className="text-green-600" /> Points Forts
          </h3>
          <ul className="flex flex-col gap-2.5">
            {STRENGTHS.map(s => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 text-green-600 flex-shrink-0">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-[rgba(184,134,11,0.3)] border-t-4 border-t-gold rounded-xl p-7 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-base mb-5">
            <TrendingUp size={16} className="text-gold" /> Axes d'Amélioration
          </h3>
          <ul className="flex flex-col gap-2.5">
            {AXES.map(a => (
              <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 text-gold flex-shrink-0">→</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Journal */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 font-serif text-xl font-semibold mb-5">
          <Notebook size={18} className="text-gold" /> Journal Réflexif
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {JOURNAL.map(({ date, title, text }) => (
            <div key={date} className="bg-white border border-border border-l-4 border-l-gold rounded-xl p-6 shadow-sm">
              <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">{date}</div>
              <h4 className="font-semibold text-sm mb-2">{title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Autoévaluation table */}
      <div>
        <h3 className="flex items-center gap-2 font-serif text-xl font-semibold mb-5">
          <Star size={18} className="text-gold" /> Autoévaluation CRMEF
        </h3>
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0f0f1a] text-[#e8e4d8]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Compétence</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-center">Niveau</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-center">Évaluation</th>
              </tr>
            </thead>
            <tbody>
              {AUTOEVAL.map(({ competence, stars, level, cls }) => (
                <tr key={competence} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium">{competence}</td>
                  <td className="px-5 py-3.5 text-center"><Stars n={stars} /></td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${cls}`}>{level}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
