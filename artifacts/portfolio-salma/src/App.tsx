import { useState } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Home, IdCard, FileText, Folder, Brain, Monitor, Sparkles, Mail,
  Menu, Lock, LockOpen, GraduationCap, MapPin
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
          "fixed top-0 left-0 bottom-0 flex flex-col z-50 bg-white border-r border-slate-200 transition-all duration-300 shadow-sm",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-3 border-b border-slate-100 h-[65px] flex-shrink-0 px-4",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-slate-900 font-semibold text-sm leading-tight block">Portfolio</span>
              <span className="text-blue-600 text-xs font-medium">Salma</span>
            </div>
          )}
        </div>

        {/* Profile */}
        {!collapsed && (
          <div className="px-4 py-5 border-b border-slate-100 flex flex-col items-center gap-3 flex-shrink-0 bg-slate-50/60">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl font-serif select-none shadow-md">
              S
            </div>
            <div className="text-center">
              <h2 className="text-slate-900 font-semibold text-sm">Salma</h2>
              <p className="text-slate-500 text-xs leading-relaxed mt-0.5">Prof. Stagiaire · Informatique</p>
              <p className="text-blue-600 text-xs flex items-center justify-center gap-1 mt-1 font-medium">
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
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon size={17} className={cn("flex-shrink-0", isActive ? "text-blue-600" : "text-slate-400")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{label}</span>
                    {badge && docs.length > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
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
        <div className="px-2 py-2 border-t border-slate-100">
          <button
            onClick={handleAdminClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              collapsed ? "justify-center" : "",
              isAdmin
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
          >
            {isAdmin ? <LockOpen size={17} className="flex-shrink-0 text-blue-600" /> : <Lock size={17} className="flex-shrink-0 text-slate-400" />}
            {!collapsed && <span>{isAdmin ? "Admin connecté" : "Administration"}</span>}
          </button>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-slate-100 text-center bg-slate-50/60 flex-shrink-0">
            <p className="text-slate-400 text-[10px] leading-relaxed">Lycée Hommane El Fetouaki</p>
            <p className="text-slate-400 text-[10px]">CRMEF Rabat · 2024–2025</p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3.5 top-20 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm text-xs"
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
    <div className="flex min-h-screen bg-slate-50">
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
      <main className="flex-1 min-w-0 bg-slate-50">
        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 shadow-sm"
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
