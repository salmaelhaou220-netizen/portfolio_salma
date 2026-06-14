import { useState } from "react";
import { Building2, School, Map, Calendar, Send, CheckCircle } from "lucide-react";

const CONTACT_INFO = [
  { icon: Building2, label: "Établissement de stage", value: "Lycée Hommane El Fetouaki, Rabat" },
  { icon: School, label: "Formation", value: "CRMEF Rabat · Informatique · Secondaire Qualifiant" },
  { icon: Map, label: "Académie", value: "AREF Rabat-Salé-Kénitra" },
  { icon: Calendar, label: "Année scolaire", value: "2024–2025" },
];

const inputCls = "w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all bg-white";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-9">
        <h2 className="font-serif text-3xl font-bold mb-2">Contact</h2>
        <p className="text-muted-foreground">Pour toute question ou collaboration</p>
      </div>

      <div className="grid grid-cols-5 gap-8">
        {/* Info left */}
        <div className="col-span-2">
          <h3 className="font-serif text-xl font-semibold mb-6">Informations</h3>
          <div className="flex flex-col gap-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 bg-white border border-border rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-[#f5e6b8] rounded-xl flex items-center justify-center text-gold flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form right */}
        <div className="col-span-3 bg-white border border-border rounded-xl p-8 shadow-sm">
          <h3 className="font-serif text-xl font-semibold mb-6">Message</h3>
          {sent ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <CheckCircle size={52} className="text-green-500" />
              <div>
                <h4 className="font-semibold text-lg mb-2">Message envoyé !</h4>
                <p className="text-muted-foreground text-sm">Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Nom complet</label>
                  <input type="text" placeholder="Votre nom" required className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Email</label>
                  <input type="email" placeholder="votre@email.com" required className={inputCls} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Objet</label>
                <input type="text" placeholder="Objet de votre message" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Message</label>
                <textarea rows={5} placeholder="Votre message..." required className={inputCls} style={{ resize: "vertical" }} />
              </div>
              <button type="submit"
                className="w-full py-3 bg-gold hover:bg-[#d4a017] text-[#0f0f1a] font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                <Send size={15} /> Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
