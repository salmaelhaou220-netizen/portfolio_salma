import { Gamepad2, Trophy, Presentation, Code, Video, Globe, Zap } from "lucide-react";

const TOOLS = [
  { icon: Gamepad2,     name: "Kahoot!",             color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", desc: "Quiz interactifs pour la révision et l'évaluation formative. Favorise l'engagement et la compétition saine en classe.",          tags: ["Quiz", "Gamification"] },
  { icon: Trophy,       name: "Quizizz",             color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", desc: "Évaluations différenciées avec feedback immédiat. Permet un travail à rythme personnalisé adapté à chaque élève.",                 tags: ["Évaluation", "Différenciation"] },
  { icon: Presentation, name: "PowerPoint",          color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100",    desc: "Conception de supports visuels dynamiques avec animations et infographies pour illustrer les concepts informatiques.",                tags: ["Présentation", "Visuel"] },
  { icon: Code,         name: "Replit IDE",           color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100",  desc: "Environnement de développement en ligne pour les séances de programmation Python. Accessible sans installation.",                    tags: ["Programmation", "Python"] },
  { icon: Video,        name: "Vidéos Pédagogiques", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100",   desc: "Capsules vidéo et tutoriels pour l'apprentissage inversé. Supports disponibles en arabe et en français.",                          tags: ["Classe inversée", "Autonomie"] },
  { icon: Globe,        name: "Google Classroom",    color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", desc: "Plateforme de gestion des cours, dépôt de devoirs et communication avec les élèves hors temps de classe.",                         tags: ["LMS", "Communication"] },
];

export default function TICE() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#3D2B35" }}>Intégration TICE</h2>
        <p className="text-slate-500">Technologies de l'Information et de la Communication pour l'Enseignement</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {TOOLS.map(({ icon: Icon, name, color, bg, border, desc, tags }) => (
          <div key={name} className={`bg-white border ${border} rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={24} className={color} />
            </div>
            <h3 className="font-semibold text-slate-800 text-base mb-2">{name}</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">{desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <span key={t} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Analyse critique — gradient rose */}
      <div className="rounded-2xl p-8 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #C084A0 0%, #9B5B7A 100%)" }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold mb-3">Analyse Critique</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
              L'intégration des TICE dans mon enseignement ne s'est pas limitée à la technicité. Elle a répondu à de véritables besoins pédagogiques : différenciation, motivation, feedback immédiat et développement de l'autonomie. Cependant, j'ai aussi appris à maîtriser les risques : dépendance aux outils, fracture numérique, ou encore séances trop centrées sur la technologie au détriment des apprentissages fondamentaux.{" "}
              <strong className="text-white">L'outil ne remplace jamais la pédagogie ; il la potentialise.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
