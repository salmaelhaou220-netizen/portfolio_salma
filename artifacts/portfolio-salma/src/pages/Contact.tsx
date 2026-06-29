import { useState } from "react";
import { Building2, School, Map, Calendar, Send, CheckCircle } from "lucide-react";

const CONTACT_INFO = [
  { icon: Building2, label: "Établissement de stage", value: "Lycée Hommane El Fetouaki, Rabat" },
  { icon: School,    label: "Formation",               value: "CRMEF Rabat · Informatique · Secondaire Qualifiant" },
  { icon: Map,       label: "Académie",                value: "AREF Rabat-Salé-Kénitra" },
  { icon: Calendar,  label: "Année scolaire",          value: "2025–2026" },
];

const inputCls = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all bg-white";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#3D2B35" }}>Contact</h2>
        <p className="text-slate-500">Pour toute question ou collaboration pédagogique</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Informations</h3>
          {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm"
              style={{ border: "1px solid #F0D0E0" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#F5E6EE" }}>
                <Icon size={18} style={{ color: "#C084A0" }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C084A0" }}>{label}</p>
                <p className="text-sm font-medium text-slate-700">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-lg mb-6">Envoyer un message</h3>
          {sent ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle size={36} className="text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-lg mb-2">Message envoyé !</h4>
                <p className="text-slate-500 text-sm">Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
              </div>
              <button onClick={() => setSent(false)} className="text-sm font-semibold hover:underline" style={{ color: "#C084A0" }}>
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nom complet</label>
                  <input type="text" placeholder="Votre nom" required className={inputCls}
                    onFocus={e => { e.currentTarget.style.borderColor = "#C084A0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(192,132,160,0.15)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</label>
                  <input type="email" placeholder="votre@email.com" required className={inputCls}
                    onFocus={e => { e.currentTarget.style.borderColor = "#C084A0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(192,132,160,0.15)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Objet</label>
                <input type="text" placeholder="Objet de votre message" className={inputCls}
                  onFocus={e => { e.currentTarget.style.borderColor = "#C084A0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(192,132,160,0.15)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Message</label>
                <textarea rows={5} placeholder="Votre message…" required className={inputCls} style={{ resize: "vertical" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#C084A0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(192,132,160,0.15)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <button type="submit"
                className="w-full py-3 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                style={{ background: "#C084A0" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#9B5B7A"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#C084A0"; }}
              >
                <Send size={15} /> Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
