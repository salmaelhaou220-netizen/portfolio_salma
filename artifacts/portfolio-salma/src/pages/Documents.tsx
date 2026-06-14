import { useState } from "react";
import { Search, ChevronDown, Eye, Download, Pencil, Trash2, Plus, Loader2, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocuments, type Doc } from "@/hooks/useDocuments";
import { useAuth } from "@/hooks/useAuth";
import DocViewerModal from "@/components/DocViewerModal";
import DocFormModal from "@/components/DocFormModal";

const CAT_META: Record<string, { label: string; icon: string; color: string; bg: string; border: string }> = {
  fiches:      { label: "Fiches de Préparation",       icon: "📋", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  grilles:     { label: "Grilles d'Observation",        icon: "📊", color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  supports:    { label: "Supports de Cours",            icon: "📑", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  pff:         { label: "Projet de Fin de Formation",   icon: "📄", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  productions: { label: "Autres Productions",           icon: "✨", color: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-200" },
};

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  pdf: { label: "PDF", cls: "bg-red-50 text-red-700 border border-red-200" },
  doc: { label: "DOC", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  ppt: { label: "PPT", cls: "bg-orange-50 text-orange-700 border border-orange-200" },
  img: { label: "IMG", cls: "bg-green-50 text-green-700 border border-green-200" },
};

const FILTERS = [
  { key: "all",        label: "Tous les documents" },
  { key: "fiches",     label: "Fiches" },
  { key: "grilles",    label: "Grilles" },
  { key: "supports",   label: "Supports" },
  { key: "pff",        label: "PFF" },
  { key: "productions",label: "Productions" },
];

function DocRow({ doc, isAdmin, onView, onEdit, onDelete }: {
  doc: Doc; isAdmin: boolean;
  onView: (d: Doc) => void; onEdit: (d: Doc) => void; onDelete: (d: Doc) => void;
}) {
  const badge = TYPE_BADGE[doc.type] ?? { label: doc.type.toUpperCase(), cls: "bg-slate-100 text-slate-600 border border-slate-200" };
  return (
    <li className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex-shrink-0", badge.cls)}>{badge.label}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-800 truncate">{doc.name}</div>
        {doc.description && <div className="text-xs text-slate-400 truncate mt-0.5">{doc.description}</div>}
      </div>
      <span className="text-xs text-slate-400 flex-shrink-0 hidden sm:block">{doc.date}</span>
      <div className="flex gap-1.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onView(doc)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors">
          <Eye size={11} /> Voir
        </button>
        <button onClick={() => { const a = document.createElement("a"); a.href = doc.path; a.download = doc.name; a.click(); }}
          className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 transition-colors">
          <Download size={11} />
        </button>
        {isAdmin && (
          <>
            <button onClick={() => onEdit(doc)}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-600 hover:text-white border border-slate-200 transition-colors">
              <Pencil size={11} />
            </button>
            <button onClick={() => onDelete(doc)}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-colors">
              <Trash2 size={11} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default function Documents() {
  const { docs, isLoading, deleteDoc } = useDocuments();
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [viewDoc, setViewDoc] = useState<Doc | null>(null);
  const [editDoc, setEditDoc] = useState<Doc | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formCat, setFormCat] = useState<string | undefined>();

  const toggleCat = (cat: string) => setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  const catKeys = filter === "all" ? Object.keys(CAT_META) : [filter].filter(k => CAT_META[k]);

  const filteredDocs = (cat: string) =>
    docs.filter(d => d.category === cat && (search === "" || d.name.toLowerCase().includes(search.toLowerCase())));

  const handleDelete = async (doc: Doc) => {
    if (!confirm(`Supprimer "${doc.name}" ? Cette action est irréversible.`)) return;
    await deleteDoc(doc.id);
  };

  const handleAdd = (cat: string) => { setFormCat(cat); setEditDoc(null); setFormOpen(true); };
  const handleEdit = (doc: Doc) => { setEditDoc(doc); setFormCat(undefined); setFormOpen(true); };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-1">Mes Documents</h2>
        <p className="text-slate-500">Ressources pédagogiques produites durant le stage</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-1 w-full sm:w-auto shadow-sm">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un document…"
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400 text-slate-700"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                filter === key
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              )}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {catKeys.map(cat => {
            const meta = CAT_META[cat];
            const catDocs = filteredDocs(cat);
            const isOpen = openCats[cat] ?? (filter !== "all" || search !== "");
            return (
              <div key={cat} className={cn("bg-white border rounded-xl overflow-hidden shadow-sm", meta.border)}>
                <div
                  className="flex items-center gap-3.5 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  onClick={() => toggleCat(cat)}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0", meta.bg)}>
                    {meta.icon}
                  </div>
                  <span className={cn("flex-1 font-semibold text-sm text-slate-800")}>{meta.label}</span>
                  <span className="text-xs text-slate-400 font-medium">{catDocs.length} fichier{catDocs.length !== 1 ? "s" : ""}</span>
                  {isAdmin && (
                    <button
                      onClick={e => { e.stopPropagation(); handleAdd(cat); }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={11} /> Ajouter
                    </button>
                  )}
                  <ChevronDown size={16} className={cn("text-slate-400 transition-transform flex-shrink-0", isOpen && "rotate-180")} />
                </div>
                {isOpen && (
                  <div className="border-t border-slate-100">
                    {catDocs.length === 0 ? (
                      <div className="flex items-center gap-3 px-5 py-6 text-sm text-slate-400 italic">
                        <Folder size={16} className="text-slate-300" /> Aucun document dans cette catégorie.
                      </div>
                    ) : (
                      <ul>
                        {catDocs.map(doc => (
                          <DocRow key={doc.id} doc={doc} isAdmin={isAdmin}
                            onView={setViewDoc} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <DocViewerModal doc={viewDoc} onClose={() => setViewDoc(null)} />
      <DocFormModal
        open={formOpen} doc={editDoc} defaultCategory={formCat}
        onClose={() => { setFormOpen(false); setEditDoc(null); setFormCat(undefined); }}
      />
    </div>
  );
}
