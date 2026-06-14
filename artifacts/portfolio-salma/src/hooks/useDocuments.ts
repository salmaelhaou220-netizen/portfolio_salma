import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./useAuth";

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

  return {
    docs,
    isLoading,
    createDoc: createMut.mutateAsync,
    updateDoc: updateMut.mutateAsync,
    deleteDoc: deleteMut.mutateAsync,
    createPending: createMut.isPending,
    updatePending: updateMut.isPending,
    deletePending: deleteMut.isPending,
  };
}
