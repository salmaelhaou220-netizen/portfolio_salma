import { useState, useEffect, useRef } from "react";
import { FilePlus, X, Upload, File, CheckCircle, AlertCircle, HardDrive } from "lucide-react";
import { useDocuments, type Doc } from "@/hooks/useDocuments";
import { useLocalDocs, readFileAsDataUrl, guessDocType, formatFileSize } from "@/hooks/useLocalDocs";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  doc?: Doc | null;
  defaultCategory?: string;
  onClose: () => void;
}

const CATEGORIES = [
  { value: "fiches",      label: "Fiches de Préparation" },
  { value: "grilles",     label: "Grilles d'Observation" },
  { value: "supports",    label: "Supports de Cours" },
  { value: "pff",         label: "Projet de Fin de Formation" },
  { value: "productions", label: "Autres Productions" },
];

const TYPES = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "DOC / DOCX" },
  { value: "ppt", label: "PPT / PPTX" },
  { value: "img", label: "Image (JPG, PNG)" },
];

const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.svg";

export default function DocFormModal({ open, doc, defaultCategory, onClose }: Props) {
  const { createDoc, updateDoc, createPending, updatePending } = useDocuments();
  const { addLocalDoc, MAX_FILE_BYTES } = useLocalDocs();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    category: defaultCategory ?? "fiches",
    name: "",
    description: "",
    date: "",
    type: "pdf",
    path: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (doc) {
      setForm({ category: doc.category, name: doc.name, description: doc.description, date: doc.date, type: doc.type, path: doc.path });
      setUploadMode("url");
    } else {
      setForm({ category: defaultCategory ?? "fiches", name: "", description: "", date: "", type: "pdf", path: "" });
      setUploadMode("file");
    }
    setSelectedFile(null);
    setError("");
    setIsProcessing(false);
  }, [doc, defaultCategory, open]);

  if (!open) return null;

  const pending = createPending || updatePending || isProcessing;

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      setError(`Fichier trop volumineux (max 5 Mo). Taille : ${formatFileSize(file.size)}`);
      return;
    }
    setError("");
    setSelectedFile(file);
    const detectedType = guessDocType(file);
    const today = new Date().toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    setForm(f => ({
      ...f,
      name: f.name || file.name.replace(/\.[^/.]+$/, ""),
      type: detectedType,
      date: f.date || today,
    }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Le nom du document est obligatoire."); return; }

    setIsProcessing(true);
    try {
      if (doc) {
        await updateDoc({ id: doc.id, ...form });
      } else if (selectedFile) {
        const dataUrl = await readFileAsDataUrl(selectedFile);
        const today = form.date || new Date().toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
        addLocalDoc(
          { category: form.category, name: form.name, description: form.description, date: today, type: form.type },
          selectedFile,
          dataUrl
        );
      } else {
        if (!form.path.trim()) { setError("Veuillez sélectionner un fichier ou saisir un chemin."); setIsProcessing(false); return; }
        await createDoc(form);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsProcessing(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white";
  const labelCls = "text-[10px] font-bold text-slate-500 uppercase tracking-widest";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <FilePlus size={20} className="text-blue-600" />
          </div>
          <h3 className="flex-1 font-semibold text-slate-800 text-base">
            {doc ? "Modifier le document" : "Ajouter un document"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Upload mode toggle (only for new docs) */}
          {!doc && (
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setUploadMode("file"); setSelectedFile(null); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all",
                  uploadMode === "file"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Upload size={13} /> Uploader un fichier
              </button>
              <button
                type="button"
                onClick={() => { setUploadMode("url"); setSelectedFile(null); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all",
                  uploadMode === "url"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <HardDrive size={13} /> Chemin du fichier
              </button>
            </div>
          )}

          {/* File drop zone */}
          {!doc && uploadMode === "file" && (
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : selectedFile
                    ? "border-green-400 bg-green-50"
                    : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT}
                onChange={handleFileInputChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 truncate max-w-[260px]">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatFileSize(selectedFile.size)} · {guessDocType(selectedFile).toUpperCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setSelectedFile(null); setForm(f => ({ ...f, name: "" })); }}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors underline"
                  >
                    Changer de fichier
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Upload size={22} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Glissez votre fichier ici</p>
                    <p className="text-xs text-slate-400 mt-1">ou <span className="text-blue-600 font-semibold">cliquez pour parcourir</span></p>
                    <p className="text-[10px] text-slate-400 mt-2">PDF, DOC, PPT, JPG · Max 5 Mo</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* URL / path field */}
          {(uploadMode === "url" || doc) && (
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Chemin ou URL du fichier</label>
              <input value={form.path} onChange={set("path")} placeholder="docs/fiches/Fiche.pdf" className={inputCls} />
            </div>
          )}

          {/* Info notice for local storage */}
          {!doc && uploadMode === "file" && selectedFile && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
              <HardDrive size={13} className="flex-shrink-0 mt-0.5" />
              <span>Ce document sera sauvegardé localement dans votre navigateur et persistera après rechargement.</span>
            </div>
          )}

          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Catégorie</label>
              <select value={form.category} onChange={set("category")} className={inputCls}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Type</label>
              <select value={form.type} onChange={set("type")} className={inputCls}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Nom du document <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="ex : Fiche de préparation — Python"
              required
              className={inputCls}
            />
          </div>

          {/* Description + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Description</label>
              <input value={form.description} onChange={set("description")} placeholder="Description courte…" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Date</label>
              <input value={form.date} onChange={set("date")} placeholder="ex : Nov. 2024" className={inputCls} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 shadow-sm flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</>
            ) : (
              <><File size={14} /> {doc ? "Mettre à jour" : selectedFile ? "Ajouter le document" : "Enregistrer"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
