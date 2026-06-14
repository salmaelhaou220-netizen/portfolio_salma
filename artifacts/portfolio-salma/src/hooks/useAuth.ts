import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = "/api";

async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers as Record<string, string> || {}) },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur réseau" }));
    throw new Error((err as { error?: string }).error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export { apiFetch };

export function useAuth() {
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["auth"],
    queryFn: () => apiFetch("/auth/me"),
    staleTime: 5 * 60 * 1000,
  });

  const loginMut = useMutation({
    mutationFn: (password: string) =>
      apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ password }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth"] }),
  });

  const logoutMut = useMutation({
    mutationFn: () => apiFetch("/auth/logout", { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth"] }),
  });

  return {
    isAdmin: (data as { isAdmin?: boolean })?.isAdmin === true,
    login: loginMut.mutateAsync,
    logout: logoutMut.mutateAsync,
    loginPending: loginMut.isPending,
    logoutPending: logoutMut.isPending,
  };
}
