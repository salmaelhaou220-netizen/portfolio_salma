import { useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ open, onClose }: Props) {
  const { login, loginPending } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(password);
      setPassword("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Mot de passe incorrect.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 bg-[#0f0f1a]">
          <div className="w-10 h-10 rounded-lg bg-[rgba(184,134,11,0.15)] flex items-center justify-center text-gold flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <h3 className="flex-1 font-semibold text-[#e8e4d8] text-base">Accès Administration</h3>
          <button onClick={onClose} className="text-[#8a8599] hover:text-[#e8e4d8] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Entrez votre mot de passe pour gérer les documents du portfolio.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              required
              className="px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loginPending}
            className="w-full py-2.5 bg-gold hover:bg-[#d4a017] text-[#0f0f1a] font-semibold rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {loginPending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
