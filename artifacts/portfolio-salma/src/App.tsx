import { useState, useRef } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Home, IdCard, FileText, Folder, Brain, Monitor, Sparkles, Mail,
  Menu, Lock, LockOpen, GraduationCap, MapPin, Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useDocuments } from "@/hooks/useDocuments";
import AdminLoginModal from "@/components/AdminLoginModal";
import Accueil from "@/pages/Accueil";
import CV from "@/pages/CV";
import Rapport from "@/pages/Rapport";
import Documents from "@/pages/Documents";
import Reflexion from "@/pages/Reflexion";
import TICE from "@/pages/TICE";
import Productions from "@/pages/Productions";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const NAV = [
  { path: "/",            label: "Accueil",          icon: Home },
  { path: "/cv",          label: "CV & Parcours",     icon: IdCard },
  { path: "/rapport",     label: "Rapport de Stage",  icon: FileText },
  { path: "/documents",   label: "Mes Documents",     icon: Folder,   badge: true },
  { path: "/reflexion",   label: "Analyse Réflexive", icon: Brain },
  { path: "/tice",        label: "Intégration TICE",  icon: Monitor },
  { path: "/productions", label: "Productions",        icon: Sparkles },
  { path: "/contact",     label: "Contact",            icon: Mail },
];

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [location] = useLocation();
  const { isAdmin, logout } = useAuth();
  const { docs } = useDocuments();
  const [showLogin, setShowLogin] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [photoKey, setPhotoKey] = useState(0);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const res = await fetch("/api/photo", { method: "POST", credentials: "include", body: fd });
      if (res.ok) {
        setPhotoError(false);
        setPhotoKey(k => k + 1);
      }
    } catch {
    }
    e.target.value = "";
  };

  const handleAdminClick = async () => {
    if (isAdmin) {
      if (confirm("Voulez-vous vous déconnecter du panneau administrateur ?")) {
        await logout();
      }
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 flex flex-col z-50 transition-all duration-300 shadow-xl",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
        style={{ background: "#2D1B25" }}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-3 border-b h-[65px] flex-shrink-0 px-4",
          collapsed ? "justify-center" : ""
        )} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#C084A0" }}>
            <GraduationCap size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-white font-semibold text-sm leading-tight block">Portfolio</span>
              <span className="text-[#C084A0] text-xs font-medium">EL HAOU SALMA</span>
            </div>
          )}
        </div>

        {/* Profile */}
        {!collapsed && (
          <div className="px-4 py-5 border-b flex flex-col items-center gap-3 flex-shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="relative group">
              {photoError ? (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl font-serif select-none shadow-md"
                  style={{ background: "linear-gradient(135deg,#C084A0,#9B5B7A)", outline: "2px solid #E8B4C8", outlineOffset: "2px" }}>
                  S
                </div>
              ) : (
                <img
                  key={photoKey}
                  src={`/photo-salma.jpg?v=${photoKey}`}
                  alt="EL HAOU SALMA"
                  className="w-16 h-16 rounded-full object-cover shadow-md"
                  style={{ outline: "2px solid #E8B4C8", outlineOffset: "2px" }}
                  onError={() => setPhotoError(true)}
                />
              )}
              {isAdmin && (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  title="Changer la photo"
                  className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(45,27,37,0.65)" }}
                >
                  <Camera size={18} className="text-white" />
                </button>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-sm text-white">EL HAOU SALMA</h2>
              <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#E8B4C8" }}>Prof. Stagiaire · Informatique</p>
              <p className="text-xs flex items-center justify-center gap-1 mt-1 font-medium" style={{ color: "#C084A0" }}>
                <MapPin size={10} /> Rabat, Maroc
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto flex flex-col gap-0.5">
          {NAV.map(({ path, label, icon: Icon, badge }) => {
            const isActive = path === "/" ? location === "/" : location.startsWith(path);
            return (
              <Link key={path} href={path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  collapsed ? "justify-center" : "",
                )}
                style={{
                  background: isActive ? "rgba(192,132,160,0.18)" : "transparent",
                  color: isActive ? "#C084A0" : "#B8A0AC",
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "#F5E6EE"; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#B8A0AC"; } }}
              >
                <Icon size={17} className="flex-shrink-0" style={{ color: isActive ? "#C084A0" : "#B8A0AC" }} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{label}</span>
                    {badge && docs.length > 0 && (
                      <span className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center" style={{ background: "#C084A0" }}>
                        {docs.length}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin */}
        <div className="px-2 py-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <button
            onClick={handleAdminClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              collapsed ? "justify-center" : "",
            )}
            style={{
              background: isAdmin ? "rgba(192,132,160,0.18)" : "transparent",
              color: isAdmin ? "#C084A0" : "#B8A0AC",
            }}
          >
            {isAdmin
              ? <LockOpen size={17} className="flex-shrink-0" style={{ color: "#C084A0" }} />
              : <Lock size={17} className="flex-shrink-0" style={{ color: "#B8A0AC" }} />}
            {!collapsed && <span>{isAdmin ? "Admin connecté" : "Administration"}</span>}
          </button>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-3 border-t text-center flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-[10px] leading-relaxed" style={{ color: "#9B7A8A" }}>Lycée Hommane El Fetouaki</p>
            <p className="text-[10px]" style={{ color: "#9B7A8A" }}>CRMEF Rabat · 2025–2026</p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3.5 top-20 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md transition-colors"
          style={{ background: "#2D1B25", border: "1px solid rgba(192,132,160,0.35)", color: "#C084A0" }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </aside>

      <AdminLoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#FDF8FA" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0" style={{ width: sidebarCollapsed ? 68 : 260 }}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0" style={{ background: "#FDF8FA" }}>
        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm"
          style={{ color: "#3D2B35" }}
        >
          <Menu size={18} />
        </button>

        <div className="animate-fade-in">
          <Switch>
            <Route path="/" component={Accueil} />
            <Route path="/cv" component={CV} />
            <Route path="/rapport" component={Rapport} />
            <Route path="/documents" component={Documents} />
            <Route path="/reflexion" component={Reflexion} />
            <Route path="/tice" component={TICE} />
            <Route path="/productions" component={Productions} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Layout />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
