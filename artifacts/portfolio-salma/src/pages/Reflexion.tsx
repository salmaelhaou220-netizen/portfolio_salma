import { ThumbsUp, TrendingUp, Notebook, Star, Sparkles, Eye, Lightbulb } from "lucide-react";

const JOURNAL_ICONS = { Sparkles, Eye, TrendingUp, Lightbulb } as const;

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
  {
    date: "Février 2026",
    periode: "16 fév. – 28 fév.",
    icone: "Sparkles",
    titre: "Le choc de la réalité",
    texte: "Ma première entrée dans la classe a été un véritable révélateur. Entre la théorie apprise au CRMEF et la réalité d'une classe de 37 élèves, l'écart était immédiat. J'ai compris dès ce premier jour que l'observation n'est pas passive — c'est déjà un acte pédagogique.",
    theme: "Écart théorie / pratique",
    couleur: "#C084A0",
  },
  {
    date: "Mars 2026",
    periode: "02 mars – 04 avr.",
    icone: "Eye",
    titre: "L'observation croisée",
    texte: "Observer mes pairs m'a autant appris qu'observer les élèves. Chaque collègue avait sa façon d'entrer en relation avec la classe, de gérer le temps, de réagir à l'imprévu. J'ai commencé à construire ma propre vision de l'enseignement — non pas par imitation, mais par choix réfléchi.",
    theme: "Identité professionnelle",
    couleur: "#9B5B7A",
  },
  {
    date: "Avril 2026",
    periode: "09 avr. – 02 mai",
    icone: "TrendingUp",
    titre: "Monter en autonomie",
    texte: "En avril, j'ai commencé à me sentir enseignante — pas encore stagiaire qui observe, mais professeure qui prend des décisions. Gérer le rythme d'une séance, adapter une explication, jongler entre le français et le darija pour rejoindre tous les élèves : chaque cours m'a rendue un peu plus à l'aise dans ce rôle.",
    theme: "Autonomie · Différenciation",
    couleur: "#7B6FA0",
  },
  {
    date: "Mai 2026",
    periode: "11 mai – 23 mai",
    icone: "Lightbulb",
    titre: "Le CC3 comme miroir",
    texte: "Le Contrôle Continu N°3 du 18 mai a été un moment de vérité — autant pour les élèves que pour moi. Corriger les copies m'a permis de mesurer ce qui avait réellement été compris, et ce que je n'avais pas su transmettre clairement. L'évaluation n'est pas une fin, c'est un point de départ pour progresser ensemble.",
    theme: "Évaluation · Réflexivité",
    couleur: "#B07A5A",
  },
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
          {JOURNAL.map(({ date, periode, icone, titre, texte, theme, couleur }) => {
            const Icon = JOURNAL_ICONS[icone as keyof typeof JOURNAL_ICONS] ?? Sparkles;
            return (
              <div key={date} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
                style={{ borderLeft: `4px solid ${couleur}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
                    style={{ color: couleur, background: `${couleur}1A` }}>
                    <Icon size={12} /> {date}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{periode}</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm mb-2">{titre}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{texte}</p>
                <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${couleur}1A`, color: couleur }}>{theme}</span>
              </div>
            );
          })}
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
