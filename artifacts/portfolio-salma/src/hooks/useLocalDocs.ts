import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "portfolio_salma_local_docs";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface LocalDoc {
  id: string;
  category: string;
  name: string;
  description: string;
  date: string;
  type: string;
  path: string;
  fileData: string;
  fileName: string;
  fileSize: number;
  isLocal: true;
  createdAt: string;
}

function load(): LocalDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalDoc[]) : [];
  } catch {
    return [];
  }
}

function save(docs: LocalDoc[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch {
    console.warn("localStorage quota exceeded");
  }
}

export function useLocalDocs() {
  const [localDocs, setLocalDocs] = useState<LocalDoc[]>(load);

  useEffect(() => {
    save(localDocs);
  }, [localDocs]);

  const addLocalDoc = useCallback(
    (
      meta: Omit<LocalDoc, "id" | "isLocal" | "createdAt" | "fileData" | "path" | "fileName" | "fileSize">,
      file: File,
      dataUrl: string
    ) => {
      if (file.size > MAX_FILE_BYTES) {
        throw new Error(`Fichier trop volumineux (max 5 Mo). Taille actuelle : ${(file.size / 1024 / 1024).toFixed(1)} Mo`);
      }
      const doc: LocalDoc = {
        ...meta,
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        path: dataUrl,
        fileData: dataUrl,
        fileName: file.name,
        fileSize: file.size,
        isLocal: true,
        createdAt: new Date().toISOString(),
      };
      setLocalDocs(prev => [doc, ...prev]);
      return doc;
    },
    []
  );

  const updateLocalDoc = useCallback(
    (id: string, updates: Partial<Pick<LocalDoc, "name" | "description" | "category" | "date" | "type">>) => {
      setLocalDocs(prev =>
        prev.map(d => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    []
  );

  const deleteLocalDoc = useCallback((id: string) => {
    setLocalDocs(prev => {
      const doc = prev.find(d => d.id === id);
      if (doc?.path?.startsWith("blob:")) {
        try { URL.revokeObjectURL(doc.path); } catch {}
      }
      return prev.filter(d => d.id !== id);
    });
  }, []);

  const clearAllLocalDocs = useCallback(() => {
    setLocalDocs([]);
  }, []);

  return { localDocs, addLocalDoc, updateLocalDoc, deleteLocalDoc, clearAllLocalDocs, MAX_FILE_BYTES };
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Impossible de lire le fichier."));
    reader.readAsDataURL(file);
  });
}

export function guessDocType(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["doc", "docx"].includes(ext)) return "doc";
  if (["ppt", "pptx"].includes(ext)) return "ppt";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "img";
  return "pdf";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}
