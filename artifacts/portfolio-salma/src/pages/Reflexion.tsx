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
  { competence: "Maîtrise disciplinaire",        stars: 4, level: "Bien",        cls: "bg-green-50 text-green-700 border border-green-200" },
  { competence: "Planification pédagogique",     stars: 4, level: "Bien",        cls: "bg-green-50 text-green-700 border border-green-200" },
  { competence: "Gestion de classe",             stars: 3, level: "Assez bien",  cls: "bg-orange-50 text-orange-700 border border-orange-200" },
  { competence: "Évaluation des apprentissages", stars: 4, level: "Bien",        cls: "bg-green-50 text-green-700 border border-green-200" },
  { competence: "Intégration des TICE",          stars: 5, level: "Excellent",   cls: "" },
  { competence: "Communication professionnelle", stars: 4, level: "Bien",        cls: "bg-green-50 text-green-700 border border-green-200" },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14}
          style={{ color: i < n ? "#C084A0" : "#e2e8f0", fill: i < n ? "#C084A0" : "#e2e8f0" }}
        />
      ))}
    </div>
  );
}

export default function Reflexion() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#3D2B35" }}>Analyse Réflexive</h2>
        <p className="text-slate-500">Retour critique sur la pratique pédagogique</p>
      </div>

      {/* Strengths & Axes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-green-100">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <ThumbsUp size={17} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Points Forts</h3>
          </div>
          <ul className="flex flex-col gap-2.5">
            {STRENGTHS.map(s => (
              <li key={s} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="mt-0.5 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold flex-shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: "1px solid #E8B4C8" }}>
          <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: "1px solid #F0D0E0" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#F5E6EE" }}>
              <TrendingUp size={17} style={{ color: "#C084A0" }} />
            </div>
            <h3 className="font-semibold text-slate-800">Axes d'Amélioration</h3>
          </div>
          <ul className="flex flex-col gap-2.5">
            {AXES.map(a => (
              <li key={a} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "#F5E6EE", color: "#C084A0" }}>→</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Journal */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F5E6EE" }}>
            <Notebook size={16} style={{ color: "#C084A0" }} />
          </div>
          <h3 className="font-serif text-xl font-semibold text-slate-800">Journal Réflexif</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {JOURNAL.map(({ date, title, text }) => (
            <div key={date} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
              style={{ borderLeft: "4px solid #C084A0" }}>
              <div className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-3"
                style={{ color: "#C084A0", background: "#F5E6EE" }}>{date}</div>
              <h4 className="font-semibold text-slate-800 text-sm mb-2">{title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Autoévaluation */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F5E6EE" }}>
            <Star size={16} style={{ color: "#C084A0" }} />
          </div>
          <h3 className="font-serif text-xl font-semibold text-slate-800">Autoévaluation CRMEF</h3>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "#2D1B25" }} className="text-white">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide">Compétence</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-center">Notation</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-center">Niveau</th>
              </tr>
            </thead>
            <tbody>
              {AUTOEVAL.map(({ competence, stars, level, cls }) => (
                <tr key={competence} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{competence}</td>
                  <td className="px-5 py-3.5 text-center"><Stars n={stars} /></td>
                  <td className="px-5 py-3.5 text-center">
                    {cls ? (
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${cls}`}>{level}</span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: "#F5E6EE", color: "#C084A0", border: "1px solid #E8B4C8" }}>{level}</span>
                    )}
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
