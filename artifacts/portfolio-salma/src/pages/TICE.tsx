import { Gamepad2, Trophy, Presentation, Code, Video, Globe } from "lucide-react";

const TOOLS = [
  { icon: Gamepad2, name: "Kahoot!", color: "bg-orange-50 text-orange-700", desc: "Quiz interactifs pour la révision et l'évaluation formative. Favorise l'engagement et la compétition saine en classe.", tags: ["Quiz", "Gamification"] },
  { icon: Trophy, name: "Quizizz", color: "bg-purple-50 text-purple-700", desc: "Évaluations différenciées avec feedback immédiat. Permet un travail à rythme personnalisé adapté à chaque élève.", tags: ["Évaluation", "Différenciation"] },
  { icon: Presentation, name: "PowerPoint", color: "bg-orange-50 text-red-700", desc: "Conception de supports visuels dynamiques avec animations et infographies pour illustrer les concepts informatiques.", tags: ["Présentation", "Visuel"] },
  { icon: Code, name: "Replit IDE", color: "bg-green-50 text-green-700", desc: "Environnement de développement en ligne pour les séances de programmation Python. Accessible sans installation.", tags: ["Programmation", "Python"] },
  { icon: Video, name: "Vidéos Pédagogiques", color: "bg-red-50 text-red-700", desc: "Capsules vidéo et tutoriels pour l'apprentissage inversé. Supports disponibles en arabe et en français.", tags: ["Classe inversée", "Autonomie"] },
  { icon: Globe, name: "Google Classroom", color: "bg-blue-50 text-blue-700", desc: "Plateforme de gestion des cours, dépôt de devoirs et communication avec les élèves hors temps de classe.", tags: ["LMS", "Communication"] },
];

export default function TICE() {
  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-9">
        <h2 className="font-serif text-3xl font-bold mb-2">Intégration TICE</h2>
        <p className="text-muted-foreground">Technologies de l'Information et de la Communication pour l'Enseignement</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {TOOLS.map(({ icon: Icon, name, color, desc, tags }) => (
          <div key={name} className="bg-white border border-border rounded-xl p-6 text-center shadow-sm hover:-translate-y-1 hover:border-gold transition-all duration-200 group">
            <div className={`w-15 h-15 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`} style={{ width: 60, height: 60 }}>
              <Icon size={28} />
            </div>
            <h3 className="font-semibold text-base mb-2">{name}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed mb-4">{desc}</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {tags.map(t => (
                <span key={t} className="bg-[#f5e6b8] text-gold text-[10px] font-semibold px-2.5 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border border-l-4 border-l-gold rounded-xl p-7 shadow-sm">
        <h3 className="flex items-center gap-2 font-serif text-xl font-semibold mb-4">
          <span className="text-gold">⚡</span> Analyse Critique
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          L'intégration des TICE dans mon enseignement ne s'est pas limitée à la technicité. Elle a répondu à de véritables besoins pédagogiques : différenciation, motivation, feedback immédiat et développement de l'autonomie. Cependant, j'ai aussi appris à maîtriser les risques : dépendance aux outils, fracture numérique, ou encore séances trop centrées sur la technologie au détriment des apprentissages fondamentaux. <strong>L'outil ne remplace jamais la pédagogie ; il la potentialise.</strong>
        </p>
      </div>
    </div>
  );
}
