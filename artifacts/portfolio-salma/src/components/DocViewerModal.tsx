import { X, Download, ExternalLink, FileText, Image as ImageIcon, Presentation } from "lucide-react";
import type { Doc } from "@/hooks/useDocuments";
import type { LocalDoc } from "@/hooks/useLocalDocs";

type AnyDoc = (Doc & { isLocal?: false }) | LocalDoc;

interface Props { doc: AnyDoc | null; onClose: () => void; }

function getGoogleViewerUrl(url: string) {
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
}

function isBase64(path: string) {
  return path.startsWith("data:");
}

export default function DocViewerModal({ doc, onClose }: Props) {
  if (!doc) return null;

  const path = doc.path;
  const type = doc.type;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = path;
    a.download = (doc as LocalDoc).fileName ?? doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderContent = () => {
    if (type === "img") {
      return (
        <div className="flex items-center justify-center w-full h-full bg-slate-100 p-4">
          <img
            src={path}
            alt={doc.name}
            className="max-h-full max-w-full object-contain rounded-lg shadow-md"
          />
        </div>
      );
    }

    if (type === "pdf") {
      return (
        <iframe
          src={path}
          title={doc.name}
          className="w-full h-full border-0"
        />
      );
    }

    if ((type === "doc" || type === "ppt") && !isBase64(path)) {
      return (
        <iframe
          src={getGoogleViewerUrl(path)}
          title={doc.name}
          className="w-full h-full border-0"
        />
      );
    }

    const Icon = type === "ppt" ? Presentation : type === "img" ? ImageIcon : FileText;
    return (
      <div className="flex flex-col items-center justify-center gap-5 h-full bg-slate-50 text-center px-8">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
          <Icon size={40} className="text-blue-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-1">Aperçu non disponible</p>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            Ce format ne peut pas être affiché directement. Téléchargez le fichier pour l'ouvrir.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <Download size={14} /> Télécharger
        </button>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl overflow-hidden animate-fade-in"
        style={{ height: "min(88vh, 800px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 flex-shrink-0 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
              type === "pdf" ? "bg-red-50 text-red-700 border border-red-200" :
              type === "doc" ? "bg-blue-50 text-blue-700 border border-blue-200" :
              type === "ppt" ? "bg-orange-50 text-orange-700 border border-orange-200" :
              "bg-green-50 text-green-700 border border-green-200"
            }`}>{type?.toUpperCase()}</span>
            <h3 className="font-semibold text-sm text-slate-800 truncate">{doc.name}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isBase64(path) && (
              <a
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                title="Ouvrir dans un nouvel onglet"
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
            <button
              onClick={handleDownload}
              title="Télécharger"
              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Download size={16} />
            </button>
            <button
              onClick={onClose}
              title="Fermer"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
