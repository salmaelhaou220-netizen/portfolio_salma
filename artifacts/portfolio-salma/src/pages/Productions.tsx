import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCTIONS = [
  { tag: "Cours", tagCls: "bg-blue-50 text-blue-700", icon: "🐍", title: "Séquence Python — Initiation", date: "Nov. 2024", desc: "Séquence pédagogique complète de 6 séances sur l'initiation à Python : variables, boucles, fonctions et mini-projets." },
  { tag: "Évaluation", tagCls: "bg-purple-50 text-purple-700", icon: "🎮", title: "Quiz Kahoot — Algorithmique", date: "Déc. 2024", desc: "Série de 5 quiz interactifs couvrant les notions fondamentales d'algorithmique du programme de 2ème année Bac." },
  { tag: "Projet", tagCls: "bg-green-50 text-green-700", icon: "💻", title: "Projet Collaboratif Replit", date: "Fév. 2025", desc: "Mini-projet de développement d'une calculatrice en Python réalisé en binômes sur Replit, avec présentation finale." },
  { tag: "Support", tagCls: "bg-orange-50 text-orange-700", icon: "📊", title: "Présentation — Réseaux Informatiques", date: "Jan. 2025", desc: "Support de cours animé sur les architectures réseau : modèle OSI, protocoles TCP/IP, illustration par schémas interactifs." },
  { tag: "Rapport", tagCls: "bg-[#f5e6b8] text-[#b8860b]", icon: "📄", title: "Projet de Fin de Formation (PFF)", date: "Mai 2025", desc: "Mémoire de recherche sur l'apport des TICE dans l'enseignement de l'informatique au secondaire qualifiant au Maroc." },
];

export default function Productions() {
  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-9">
        <h2 className="font-serif text-3xl font-bold mb-2">Productions Réalisées</h2>
        <p className="text-muted-foreground">Créations pédagogiques et réalisations numériques durant le stage</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {PRODUCTIONS.map(({ tag, tagCls, icon, title, date, desc }) => (
          <div key={title} className="bg-white border border-border rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:border-gold transition-all duration-200">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-4", tagCls)}>{tag}</span>
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="font-semibold text-sm leading-snug mb-2">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{desc}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar size={11} /> {date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
