import { useState, useEffect, useRef } from "react";
import { FilePlus, X, Upload, File, CheckCircle, AlertCircle, HardDrive, Cloud, Lock } from "lucide-react";
import { useDocuments, type Doc } from "@/hooks/useDocuments";
import { useLocalDocs, readFileAsDataUrl, guessDocType, formatFileSize } from "@/hooks/useLocalDocs";
import { useAuth } from "@/hooks/useAuth";
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
  { value: "rapport",     label: "Rapport de Stage" },
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

type UploadMode = "local" | "server" | "url";

export default function DocFormModal({ open, doc, defaultCategory, onClose }: Props) {
  const { createDoc, updateDoc, uploadDoc, createPending, updatePending, uploadPending } = useDocuments();
  const { addLocalDoc, MAX_FILE_BYTES } = useLocalDocs();
  const { isAdmin } = useAuth();
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
  const [uploadMode, setUploadMode] = useState<UploadMode>("local");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (doc) {
      setForm({ category: doc.category, name: doc.name, description: doc.description, date: doc.date, type: doc.type, path: doc.path });
      setUploadMode("url");
    } else {
      setForm({ category: defaultCategory ?? "fiches", name: "", description: "", date: "", type: "pdf", path: "" });
      setUploadMode(isAdmin ? "server" : "local");
    }
    setSelectedFile(null);
    setError("");
    setIsProcessing(false);
  }, [doc, defaultCategory, open, isAdmin]);

  if (!open) return null;

  const pending = createPending || updatePending || uploadPending || isProcessing;

  const handleFileSelect = (file: File) => {
    if (uploadMode === "local" && file.size > MAX_FILE_BYTES) {
      setError(`Fichier trop volumineux pour le stockage local (max 5 Mo). Taille : ${formatFileSize(file.size)}`);
      return;
    }
    if (uploadMode === "server" && file.size > 20 * 1024 * 1024) {
      setError(`Fichier trop volumineux (max 20 Mo). Taille : ${formatFileSize(file.size)}`);
      return;
    }
    setError("");
    setSelectedFile(file);
    const today = new Date().toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    setForm(f => ({
      ...f,
      name: f.name || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
      type: guessDocType(file),
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

    if (!form.name.trim()) {
      setError("Le nom du document est obligatoire.");
      return;
    }

    setIsProcessing(true);
    try {
      if (doc) {
        await updateDoc({ id: doc.id, ...form });
      } else if (selectedFile && uploadMode === "server") {
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("category", form.category);
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("date", form.date || new Date().toLocaleDateString("fr-FR", { month: "short", year: "numeric" }));
        fd.append("type", form.type);
        await uploadDoc(fd);
      } else if (selectedFile && uploadMode === "local") {
        const dataUrl = await readFileAsDataUrl(selectedFile);
        addLocalDoc(
          { category: form.category, name: form.name, description: form.description,
            date: form.date || new Date().toLocaleDateString("fr-FR", { month: "short", year: "numeric" }),
            type: form.type },
          selectedFile,
          dataUrl
        );
      } else {
        if (!form.path.trim()) {
          setError("Veuillez sélectionner un fichier ou saisir un chemin.");
          setIsProcessing(false);
          return;
        }
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

  const MODES: { key: UploadMode; icon: React.ElementType; label: string; adminOnly?: boolean }[] = [
    { key: "server", icon: Cloud, label: "Serveur (permanent)", adminOnly: true },
    { key: "local",  icon: HardDrive, label: "Local (navigateur)" },
    { key: "url",    icon: File, label: "Chemin / URL" },
  ];

  const showFileDrop = (uploadMode === "local" || uploadMode === "server") && !doc;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
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
          {/* Upload mode toggle */}
          {!doc && (
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              {MODES.map(({ key, icon: Icon, label, adminOnly }) => {
                const disabled = adminOnly && !isAdmin;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={disabled}
                    onClick={() => { if (!disabled) { setUploadMode(key); setSelectedFile(null); } }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition-all",
                      disabled
                        ? "text-slate-300 cursor-not-allowed"
                        : uploadMode === key
                          ? key === "server"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {disabled ? <Lock size={11} /> : <Icon size={11} />}
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mode description badge */}
          {!doc && (
            <div className={cn(
              "flex items-start gap-2.5 rounded-xl px-4 py-2.5 text-xs",
              uploadMode === "server"
                ? "bg-indigo-50 border border-indigo-100 text-indigo-700"
                : uploadMode === "local"
                  ? "bg-blue-50 border border-blue-100 text-blue-700"
                  : "bg-slate-50 border border-slate-200 text-slate-600"
            )}>
              {uploadMode === "server" && <><Cloud size={13} className="flex-shrink-0 mt-0.5" /><span>Le fichier sera stocké sur le serveur et accessible via l'URL publique du portfolio. <strong>Permanent.</strong></span></>}
              {uploadMode === "local"  && <><HardDrive size={13} className="flex-shrink-0 mt-0.5" /><span>Sauvegardé dans le navigateur (localStorage). Visible uniquement sur cet appareil. Max 5 Mo.</span></>}
              {uploadMode === "url"    && <><File size={13} className="flex-shrink-0 mt-0.5" /><span>Entrez un chemin relatif ou une URL externe pointant vers le fichier.</span></>}
            </div>
          )}

          {/* Drag & drop zone */}
          {showFileDrop && (
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                isDragging
                  ? uploadMode === "server" ? "border-indigo-500 bg-indigo-50" : "border-blue-500 bg-blue-50"
                  : selectedFile
                    ? "border-green-400 bg-green-50"
                    : uploadMode === "server"
                      ? "border-indigo-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40"
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
                    <p className="text-sm font-semibold text-slate-800 truncate max-w-[280px]">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatFileSize(selectedFile.size)} · {guessDocType(selectedFile).toUpperCase()}
                      {uploadMode === "server" && <span className="ml-1 text-indigo-600 font-semibold">→ Serveur</span>}
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
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", uploadMode === "server" ? "bg-indigo-100" : "bg-slate-100")}>
                    <Upload size={22} className={uploadMode === "server" ? "text-indigo-400" : "text-slate-400"} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Glissez votre fichier ici</p>
                    <p className="text-xs text-slate-400 mt-1">
                      ou <span className={cn("font-semibold", uploadMode === "server" ? "text-indigo-600" : "text-blue-600")}>cliquez pour parcourir</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      PDF, DOC, PPT, JPG · {uploadMode === "server" ? "Max 20 Mo" : "Max 5 Mo"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* URL field */}
          {uploadMode === "url" && (
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Chemin ou URL du fichier</label>
              <input value={form.path} onChange={set("path")} placeholder="docs/fiches/Fiche.pdf" className={inputCls} />
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
            className={cn(
              "w-full py-2.5 font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 shadow-sm flex items-center justify-center gap-2",
              uploadMode === "server"
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {isProcessing || uploadPending ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {uploadMode === "server" ? "Upload en cours…" : "Traitement…"}</>
            ) : (
              <>
                {uploadMode === "server" ? <Cloud size={14} /> : <File size={14} />}
                {doc ? "Mettre à jour" : uploadMode === "server" ? "Publier sur le serveur" : selectedFile ? "Ajouter le document" : "Enregistrer"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
