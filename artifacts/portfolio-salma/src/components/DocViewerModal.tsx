import { X, FileText, Image, Download } from "lucide-react";
import type { Doc } from "@/hooks/useDocuments";

interface Props {
  doc: Doc | null;
  onClose: () => void;
}

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground truncate flex-1 mr-4">{doc.name}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 p-12 bg-muted/30 min-h-[300px] text-center">
          {doc.type === "img" ? (
            <Image size={56} className="text-gold" />
          ) : (
            <FileText size={56} className="text-gold" />
          )}
          <div>
            <h4 className="font-semibold text-foreground text-lg mb-2">Document bientôt disponible</h4>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              {doc.type === "ppt" || doc.type === "doc"
                ? "Ce format nécessite un téléchargement. Utilisez le bouton ci-dessous."
                : "Ce document sera publié prochainement sur le portfolio."}
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-[#d4a017] text-[#0f0f1a] font-semibold rounded-lg text-sm transition-colors"
          >
            <Download size={15} /> Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}
