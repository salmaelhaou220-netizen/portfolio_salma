import { useState } from "react";
import { Search, ChevronDown, Eye, Download, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocuments, type Doc } from "@/hooks/useDocuments";
import { useAuth } from "@/hooks/useAuth";
import DocViewerModal from "@/components/DocViewerModal";
import DocFormModal from "@/components/DocFormModal";

const CAT_META: Record<string, { label: string; color: string; bg: string }> = {
  fiches:      { label: "Fiches de Préparation",       color: "text-orange-700", bg: "bg-orange-50" },
  grilles:     { label: "Grilles d'Observation",        color: "text-green-700",  bg: "bg-green-50"  },
  supports:    { label: "Supports de Cours",            color: "text-blue-700",   bg: "bg-blue-50"   },
  pff:         { label: "Projet de Fin de Formation",   color: "text-purple-700", bg: "bg-purple-50" },
  productions: { label: "Autres Productions",           color: "text-rose-700",   bg: "bg-rose-50"   },
};

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  pdf: { label: "PDF", cls: "bg-red-50 text-red-700" },
  doc: { label: "DOC", cls: "bg-blue-50 text-blue-700" },
  ppt: { label: "PPT", cls: "bg-orange-50 text-orange-700" },
  img: { label: "IMG", cls: "bg-green-50 text-green-700" },
};

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "fiches", label: "Fiches" },
  { key: "grilles", label: "Grilles" },
  { key: "supports", label: "Supports" },
  { key: "pff", label: "PFF" },
  { key: "productions", label: "Productions" },
];

function DocRow({ doc, isAdmin, onView, onEdit, onDelete }: {
  doc: Doc; isAdmin: boolean;
  onView: (doc: Doc) => void;
  onEdit: (doc: Doc) => void;
  onDelete: (doc: Doc) => void;
}) {
  const badge = TYPE_BADGE[doc.type] ?? { label: doc.type.toUpperCase(), cls: "bg-muted text-muted-foreground" };
  return (
    <li className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex-shrink-0", badge.cls)}>{badge.label}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{doc.name}</div>
        {doc.description && <div className="text-xs text-muted-foreground truncate">{doc.description}</div>}
      </div>
      <span className="text-xs text-muted-foreground flex-shrink-0 hidden sm:block">{doc.date}</span>
      <div className="flex gap-1.5 flex-shrink-0">
        <button onClick={() => onView(doc)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#f5e6b8] text-gold hover:bg-gold hover:text-[#0f0f1a] border border-[rgba(184,134,11,0.2)] transition-colors">
          <Eye size={12} /> Voir
        </button>
        <button onClick={() => { const a = document.createElement("a"); a.href = doc.path; a.download = doc.name; a.click(); }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-50 text-green-700 hover:bg-green-700 hover:text-white border border-green-200/60 transition-colors">
          <Download size={12} />
        </button>
        {isAdmin && (
          <>
            <button onClick={() => onEdit(doc)}
              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white border border-blue-200/60 transition-colors">
              <Pencil size={12} />
            </button>
            <button onClick={() => onDelete(doc)}
              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-700 hover:text-white border border-red-200/60 transition-colors">
              <Trash2 size={12} />
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

  const handleAdd = (cat: string) => {
    setFormCat(cat);
    setEditDoc(null);
    setFormOpen(true);
  };

  const handleEdit = (doc: Doc) => {
    setEditDoc(doc);
    setFormCat(undefined);
    setFormOpen(true);
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-9">
        <h2 className="font-serif text-3xl font-bold mb-2">Mes Documents</h2>
        <p className="text-muted-foreground">Ressources pédagogiques produites durant le stage</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 mb-7">
        <div className="flex items-center gap-2.5 bg-white border border-border rounded-lg px-4 py-2.5 flex-1 min-w-[200px]">
          <Search size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un document..."
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
                filter === key
                  ? "bg-gold text-[#0f0f1a] border-gold font-semibold"
                  : "bg-white text-muted-foreground border-border hover:border-gold hover:text-gold"
              )}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          <Loader2 size={32} className="animate-spin text-gold" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {catKeys.map(cat => {
            const meta = CAT_META[cat];
            const catDocs = filteredDocs(cat);
            const isOpen = openCats[cat] ?? (filter !== "all" || search !== "");
            return (
              <div key={cat} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div
                  className="flex items-center gap-3.5 px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors select-none"
                  onClick={() => toggleCat(cat)}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0", meta.bg, meta.color)}>
                    📁
                  </div>
                  <span className="flex-1 font-semibold text-sm">{meta.label}</span>
                  <span className="text-xs text-muted-foreground">{catDocs.length} fichier{catDocs.length !== 1 ? "s" : ""}</span>
                  {isAdmin && (
                    <button
                      onClick={e => { e.stopPropagation(); handleAdd(cat); }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gold text-[#0f0f1a] text-xs font-bold rounded-full hover:bg-[#d4a017] transition-colors"
                    >
                      <Plus size={11} /> Ajouter
                    </button>
                  )}
                  <ChevronDown size={16} className={cn("text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </div>
                {isOpen && (
                  <div className="border-t border-border">
                    {catDocs.length === 0 ? (
                      <div className="px-5 py-5 text-sm text-muted-foreground italic">Aucun document dans cette catégorie.</div>
                    ) : (
                      <ul>
                        {catDocs.map(doc => (
                          <DocRow key={doc.id} doc={doc} isAdmin={isAdmin}
                            onView={setViewDoc}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
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
        open={formOpen}
        doc={editDoc}
        defaultCategory={formCat}
        onClose={() => { setFormOpen(false); setEditDoc(null); setFormCat(undefined); }}
      />
    </div>
  );
}
