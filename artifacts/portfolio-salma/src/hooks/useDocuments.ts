import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./useAuth";

const API = "/api";

export interface Doc {
  id: number;
  category: string;
  name: string;
  description: string;
  date: string;
  type: string;
  path: string;
  createdAt: string;
}

async function apiUpload(formData: FormData): Promise<Doc> {
  const res = await fetch(`${API}/documents/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur réseau" }));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<Doc>;
}

export function useDocuments() {
  const qc = useQueryClient();

  const { data: docs = [], isLoading } = useQuery<Doc[]>({
    queryKey: ["documents"],
    queryFn: () => apiFetch("/documents"),
    staleTime: 30_000,
  });

  const createMut = useMutation({
    mutationFn: (payload: Omit<Doc, "id" | "createdAt">) =>
      apiFetch("/documents", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, ...payload }: Partial<Doc> & { id: number }) =>
      apiFetch(`/documents/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/documents/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });

  const uploadMut = useMutation({
    mutationFn: apiUpload,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });

  return {
    docs,
    isLoading,
    createDoc: createMut.mutateAsync,
    updateDoc: updateMut.mutateAsync,
    deleteDoc: deleteMut.mutateAsync,
    uploadDoc: uploadMut.mutateAsync,
    createPending: createMut.isPending,
    updatePending: updateMut.isPending,
    deletePending: deleteMut.isPending,
    uploadPending: uploadMut.isPending,
  };
}
