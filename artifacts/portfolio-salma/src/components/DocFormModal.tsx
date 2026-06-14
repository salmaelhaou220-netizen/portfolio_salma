import { useState, useEffect } from "react";
import { FilePlus, X } from "lucide-react";
import { useDocuments, type Doc } from "@/hooks/useDocuments";

interface Props {
  open: boolean;
  doc?: Doc | null;
  defaultCategory?: string;
  onClose: () => void;
}

const CATEGORIES = [
  { value: "fiches", label: "Fiches de Préparation" },
  { value: "grilles", label: "Grilles d'Observation" },
  { value: "supports", label: "Supports de Cours" },
  { value: "pff", label: "Projet de Fin de Formation" },
  { value: "productions", label: "Autres Productions" },
];

const TYPES = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "DOC / DOCX" },
  { value: "ppt", label: "PPT / PPTX" },
  { value: "img", label: "Image (JPG, PNG)" },
];

export default function DocFormModal({ open, doc, defaultCategory, onClose }: Props) {
  const { createDoc, updateDoc, createPending, updatePending } = useDocuments();
  const [form, setForm] = useState({
    category: defaultCategory ?? "fiches",
    name: "",
    description: "",
    date: "",
    type: "pdf",
    path: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (doc) {
      setForm({ category: doc.category, name: doc.name, description: doc.description, date: doc.date, type: doc.type, path: doc.path });
    } else {
      setForm({ category: defaultCategory ?? "fiches", name: "", description: "", date: "", type: "pdf", path: "" });
    }
    setError("");
  }, [doc, defaultCategory, open]);

  if (!open) return null;

  const pending = createPending || updatePending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (doc) {
        await updateDoc({ id: doc.id, ...form });
      } else {
        await createDoc(form);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const inputCls = "w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all bg-white";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="flex items-center gap-3 px-6 py-5 bg-[#0f0f1a]">
          <div className="w-10 h-10 rounded-lg bg-[rgba(184,134,11,0.15)] flex items-center justify-center text-gold flex-shrink-0">
            <FilePlus size={20} />
          </div>
          <h3 className="flex-1 font-semibold text-[#e8e4d8] text-base">
            {doc ? "Modifier le document" : "Ajouter un document"}
          </h3>
          <button onClick={onClose} className="text-[#8a8599] hover:text-[#e8e4d8] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Catégorie</label>
              <select value={form.category} onChange={set("category")} className={inputCls}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Type</label>
              <select value={form.type} onChange={set("type")} className={inputCls}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Nom du fichier</label>
            <input value={form.name} onChange={set("name")} placeholder="ex : Fiche_Python.pdf" required className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Description</label>
            <input value={form.description} onChange={set("description")} placeholder="Description courte du document" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Date</label>
              <input value={form.date} onChange={set("date")} placeholder="ex : Nov. 2024" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Chemin fichier</label>
              <input value={form.path} onChange={set("path")} placeholder="docs/fiches/Fiche.pdf" required className={inputCls} />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 bg-gold hover:bg-[#d4a017] text-[#0f0f1a] font-semibold rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
