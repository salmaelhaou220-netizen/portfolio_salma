import { useState } from "react";
import { Search, ChevronDown, Eye, Download, Pencil, Trash2, Plus, Loader2, Folder, HardDrive, X, Cloud, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocuments, type Doc } from "@/hooks/useDocuments";
import { useLocalDocs, type LocalDoc, formatFileSize, readFileAsDataUrl } from "@/hooks/useLocalDocs";
import { useAuth } from "@/hooks/useAuth";
import DocViewerModal from "@/components/DocViewerModal";
import DocFormModal from "@/components/DocFormModal";

const CAT_META: Record<string, { label: string; icon: string; color: string; bg: string; border: string }> = {
  fiches:      { label: "Fiches de Préparation",       icon: "📋", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  grilles:     { label: "Grilles d'Observation",        icon: "📊", color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  supports:    { label: "Supports de Cours",            icon: "📑", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  rapport:     { label: "Rapport de Stage",             icon: "📝", color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
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
  { key: "all",         label: "Tous" },
  { key: "fiches",      label: "Fiches" },
  { key: "grilles",     label: "Grilles" },
  { key: "supports",    label: "Supports" },
  { key: "rapport",     label: "Rapport de Stage" },
  { key: "pff",         label: "PFF" },
  { key: "productions", label: "Productions" },
];

type UnifiedDoc = (Doc & { isLocal?: false }) | LocalDoc;

function openDoc(doc: UnifiedDoc) {
  window.open(doc.path, "_blank", "noopener");
}

function downloadDoc(doc: UnifiedDoc) {
  const a = document.createElement("a");
  a.href = doc.path;
  a.download = (doc as LocalDoc).fileName ?? doc.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function DocRow({ doc, isAdmin, onView, onEdit, onDeleteLocal, onDeleteApi, onPublish, publishingId }: {
  doc: UnifiedDoc;
  isAdmin: boolean;
  onView: (d: UnifiedDoc) => void;
  onEdit: (d: Doc) => void;
  onDeleteLocal: (id: string) => void;
  onDeleteApi: (d: Doc) => void;
  onPublish: (d: LocalDoc) => void;
  publishingId: string | null;
}) {
  const badge = TYPE_BADGE[doc.type] ?? { label: doc.type.toUpperCase(), cls: "bg-slate-100 text-slate-600 border border-slate-200" };
  const isLocal = (doc as LocalDoc).isLocal === true;
  const isPublishing = publishingId === (doc as LocalDoc).id;

  return (
    <li className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors group">
      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex-shrink-0", badge.cls)}>
        {badge.label}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-slate-800 truncate">{doc.name}</span>
          {isLocal && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
              <HardDrive size={8} /> LOCAL
            </span>
          )}
          {!isLocal && doc.path?.startsWith("/api/uploads/") && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
              <Cloud size={8} /> SERVEUR
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {doc.description && <span className="text-xs text-slate-400 truncate">{doc.description}</span>}
          {isLocal && (doc as LocalDoc).fileSize > 0 && (
            <span className="text-[10px] text-slate-400 flex-shrink-0">{formatFileSize((doc as LocalDoc).fileSize)}</span>
          )}
        </div>
      </div>
      <span className="text-xs text-slate-400 flex-shrink-0 hidden sm:block">{doc.date}</span>
      <div className="flex gap-1.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
        {isLocal ? (
          <>
            <button onClick={() => openDoc(doc)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors">
              <Eye size={11} /> Voir
            </button>
            <button onClick={() => downloadDoc(doc)}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 transition-colors">
              <Download size={11} />
            </button>
            {isAdmin && (
              <button
                onClick={() => onPublish(doc as LocalDoc)}
                disabled={isPublishing}
                title="Publier sur le serveur"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-colors disabled:opacity-60"
              >
                {isPublishing
                  ? <span className="w-3 h-3 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                  : <Cloud size={11} />}
              </button>
            )}
            <button
              onClick={() => { if (confirm(`Supprimer "${doc.name}" du stockage local ?`)) onDeleteLocal((doc as LocalDoc).id); }}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-colors">
              <X size={11} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onView(doc)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors">
              <Eye size={11} /> Voir
            </button>
            <button onClick={() => downloadDoc(doc)}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 transition-colors">
              <Download size={11} />
            </button>
            {isAdmin && (
              <>
                <button onClick={() => onEdit(doc as Doc)}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-600 hover:text-white border border-slate-200 transition-colors">
                  <Pencil size={11} />
                </button>
                <button onClick={() => onDeleteApi(doc as Doc)}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-colors">
                  <Trash2 size={11} />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </li>
  );
}

export default function Documents() {
  const { docs, isLoading, deleteDoc, uploadDoc } = useDocuments();
  const { localDocs, deleteLocalDoc } = useLocalDocs();
  const { isAdmin } = useAuth();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [viewDoc, setViewDoc] = useState<Doc | null>(null);
  const [editDoc, setEditDoc] = useState<Doc | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formCat, setFormCat] = useState<string | undefined>();
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const toggleCat = (cat: string) => setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  const catKeys = filter === "all" ? Object.keys(CAT_META) : [filter].filter(k => CAT_META[k]);

  const allDocs: UnifiedDoc[] = [...(localDocs as UnifiedDoc[]), ...(docs as UnifiedDoc[])];
  const totalCount = allDocs.length;

  const filteredDocs = (cat: string) =>
    allDocs.filter(d =>
      d.category === cat &&
      (search === "" ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.description ?? "").toLowerCase().includes(search.toLowerCase()))
    );

  const handleDeleteApi = async (doc: Doc) => {
    if (!confirm(`Supprimer "${doc.name}" du serveur ? Cette action est irréversible.`)) return;
    await deleteDoc(doc.id);
  };

  const handlePublish = async (localDoc: LocalDoc) => {
    setPublishingId(localDoc.id);
    try {
      const res = await fetch(localDoc.fileData);
      const blob = await res.blob();
      const file = new File([blob], localDoc.fileName, { type: blob.type });
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", localDoc.category);
      fd.append("name", localDoc.name);
      fd.append("description", localDoc.description ?? "");
      fd.append("date", localDoc.date);
      fd.append("type", localDoc.type);
      await uploadDoc(fd);
      deleteLocalDoc(localDoc.id);
      setPublishedId(localDoc.id);
      setTimeout(() => setPublishedId(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la publication.");
    } finally {
      setPublishingId(null);
    }
  };

  const handleAdd = (cat: string) => { setFormCat(cat); setEditDoc(null); setFormOpen(true); };
  const handleEdit = (doc: Doc) => { setEditDoc(doc); setFormCat(undefined); setFormOpen(true); };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mb-1">Mes Documents</h2>
          <p className="text-slate-500 flex items-center gap-3">
            Ressources pédagogiques produites durant le stage
            {localDocs.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                <HardDrive size={9} /> {localDocs.length} local{localDocs.length > 1 ? "aux" : ""}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">{totalCount}</span>
          <span className="text-slate-500 text-sm">document{totalCount > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Success toast */}
      {publishedId && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 mb-5 shadow-sm animate-fade-in">
          <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium text-green-800">Document publié sur le serveur avec succès — accessible via l'URL publique !</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-1 w-full sm:w-auto shadow-sm">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un document…"
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400 text-slate-700"
          />
          {search && <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 flex-shrink-0"><X size={13} /></button>}
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                filter === key ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              )}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-5">
        <button
          onClick={() => { setFormCat(undefined); setEditDoc(null); setFormOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={14} /> Ajouter un document
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-blue-600" /></div>
      ) : (
        <div className="flex flex-col gap-4">
          {catKeys.map(cat => {
            const meta = CAT_META[cat];
            const catDocs = filteredDocs(cat);
            const localCount = catDocs.filter(d => (d as LocalDoc).isLocal).length;
            const serverCount = catDocs.filter(d => !(d as LocalDoc).isLocal && (d as Doc).path?.startsWith("/api/uploads/")).length;
            const isOpen = openCats[cat] ?? (filter !== "all" || search !== "");

            return (
              <div key={cat} className={cn("bg-white border rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md", meta.border)}>
                <div
                  className="flex items-center gap-3.5 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  onClick={() => toggleCat(cat)}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0", meta.bg)}>
                    {meta.icon}
                  </div>
                  <span className="flex-1 font-semibold text-sm text-slate-800">{meta.label}</span>
                  <div className="flex items-center gap-2">
                    {localCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        <HardDrive size={9} /> {localCount}
                      </span>
                    )}
                    {serverCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        <Cloud size={9} /> {serverCount}
                      </span>
                    )}
                  </div>
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
                        <Folder size={16} className="text-slate-300" />
                        Aucun document dans cette catégorie.
                        <button
                          onClick={() => { setFormCat(cat); setEditDoc(null); setFormOpen(true); }}
                          className="text-blue-600 text-xs font-semibold not-italic hover:underline ml-auto"
                        >
                          + Ajouter
                        </button>
                      </div>
                    ) : (
                      <ul>
                        {catDocs.map(doc => (
                          <DocRow
                            key={(doc as LocalDoc).isLocal ? (doc as LocalDoc).id : String((doc as Doc).id)}
                            doc={doc}
                            isAdmin={isAdmin}
                            onView={d => setViewDoc(d as Doc)}
                            onEdit={handleEdit}
                            onDeleteLocal={deleteLocalDoc}
                            onDeleteApi={handleDeleteApi}
                            onPublish={handlePublish}
                            publishingId={publishingId}
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
