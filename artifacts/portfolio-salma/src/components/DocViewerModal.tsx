import { X, FileText, Image, Download } from "lucide-react";
import type { Doc } from "@/hooks/useDocuments";

interface Props { doc: Doc | null; onClose: () => void; }

export default function DocViewerModal({ doc, onClose }: Props) {
  if (!doc) return null;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = doc.path;
    a.download = doc.name;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-sm text-slate-800 truncate flex-1 mr-4">{doc.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 p-14 bg-slate-50 min-h-[300px] text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
            {doc.type === "img"
              ? <Image size={40} className="text-blue-500" />
              : <FileText size={40} className="text-blue-500" />}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-lg mb-2">Document bientôt disponible</h4>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              {doc.type === "ppt" || doc.type === "doc"
                ? "Ce format nécessite un téléchargement. Utilisez le bouton ci-dessous."
                : "Ce document sera publié prochainement sur le portfolio."}
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
          >
            <Download size={15} /> Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}
