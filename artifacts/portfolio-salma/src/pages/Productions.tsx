import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCTIONS = [
  { tag: "Cours",      tagCls: "bg-blue-50 text-blue-700 border border-blue-200",     icon: "🐍", title: "Séquence Python — Initiation",       date: "Nov. 2024", desc: "Séquence pédagogique complète de 6 séances sur l'initiation à Python : variables, boucles, fonctions et mini-projets." },
  { tag: "Évaluation", tagCls: "bg-purple-50 text-purple-700 border border-purple-200",icon: "🎮", title: "Quiz Kahoot — Algorithmique",          date: "Déc. 2024", desc: "Série de 5 quiz interactifs couvrant les notions fondamentales d'algorithmique du programme de 2ème année Bac." },
  { tag: "Projet",     tagCls: "bg-green-50 text-green-700 border border-green-200",   icon: "💻", title: "Projet Collaboratif Replit",           date: "Fév. 2025", desc: "Mini-projet de développement d'une calculatrice en Python réalisé en binômes sur Replit, avec présentation finale." },
  { tag: "Support",    tagCls: "bg-orange-50 text-orange-700 border border-orange-200",icon: "📊", title: "Présentation — Réseaux Informatiques", date: "Jan. 2025", desc: "Support de cours animé sur les architectures réseau : modèle OSI, protocoles TCP/IP, illustration par schémas interactifs." },
  { tag: "Rapport",    tagCls: "bg-indigo-50 text-indigo-700 border border-indigo-200",icon: "📄", title: "Projet de Fin de Formation (PFF)",     date: "Mai 2025", desc: "Mémoire de recherche sur l'apport des TICE dans l'enseignement de l'informatique au secondaire qualifiant au Maroc." },
];

export default function Productions() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-1">Productions Réalisées</h2>
        <p className="text-slate-500">Créations pédagogiques et réalisations numériques durant le stage</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRODUCTIONS.map(({ tag, tagCls, icon, title, date, desc }) => (
          <div key={title} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-200">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg inline-block mb-4", tagCls)}>{tag}</span>
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2">{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{desc}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar size={11} className="text-blue-400" /> {date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
