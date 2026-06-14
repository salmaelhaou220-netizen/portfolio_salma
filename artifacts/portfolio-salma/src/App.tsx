import { useState } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Home, IdCard, FileText, Folder, Brain, Monitor, Sparkles, Mail,
  MapPin, ChevronRight, PanelLeftClose, PanelLeftOpen, Menu, Lock, LockOpen
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
  { path: "/",           label: "Accueil",          icon: Home },
  { path: "/cv",         label: "CV & Parcours",     icon: IdCard },
  { path: "/rapport",    label: "Rapport de Stage",  icon: FileText },
  { path: "/documents",  label: "Mes Documents",     icon: Folder,   badge: true },
  { path: "/reflexion",  label: "Analyse Réflexive", icon: Brain },
  { path: "/tice",       label: "Intégration TICE",  icon: Monitor },
  { path: "/productions",label: "Productions",        icon: Sparkles },
  { path: "/contact",    label: "Contact",            icon: Mail },
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
          "fixed top-0 left-0 bottom-0 flex flex-col z-50 transition-all duration-300",
          "bg-[#0f0f1a] border-r border-[rgba(184,134,11,0.15)]",
          collapsed ? "w-[70px]" : "w-[270px]"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[rgba(184,134,11,0.15)] flex-shrink-0">
          {collapsed ? (
            <span className="text-gold text-xl font-serif block text-center">✦</span>
          ) : (
            <span className="text-gold font-serif text-[17px] font-semibold tracking-wide whitespace-nowrap">
              ✦ Portfolio · Salma
            </span>
          )}
        </div>

        {/* Profile */}
        {!collapsed && (
          <div className="px-5 py-6 border-b border-[rgba(184,134,11,0.15)] flex flex-col items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-18 h-18 rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4a017] flex items-center justify-center text-[#0f0f1a] font-serif text-3xl font-bold select-none"
                style={{ width: 72, height: 72 }}>
                S
              </div>
              <div className="absolute inset-[-3px] rounded-full border-2 border-[#b8860b] opacity-40 animate-pulse-ring pointer-events-none" />
            </div>
            <div className="text-center">
              <h2 className="text-[#e8e4d8] font-serif text-lg font-semibold">Salma</h2>
              <p className="text-[#8a8599] text-xs leading-relaxed mt-0.5">Professeure Stagiaire · Informatique</p>
              <p className="text-gold text-xs flex items-center justify-center gap-1 mt-1">
                <MapPin size={11} /> Rabat, Maroc
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-1">
          {NAV.map(({ path, label, icon: Icon, badge }) => {
            const isActive = path === "/" ? location === "/" : location.startsWith(path);
            return (
              <Link key={path} href={path}
                className={cn(
                  "flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-[rgba(184,134,11,0.2)] text-gold border-l-2 border-gold"
                    : "text-[#8a8599] hover:bg-[rgba(184,134,11,0.08)] hover:text-[#e8e4d8]"
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{label}</span>
                    {badge && docs.length > 0 && (
                      <span className="bg-gold text-[#0f0f1a] text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[22px] text-center">
                        {docs.length}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin button */}
        <div className="px-3 py-2 border-t border-[rgba(184,134,11,0.15)]">
          <button
            onClick={handleAdminClick}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              collapsed ? "justify-center" : "",
              isAdmin
                ? "text-gold bg-[rgba(184,134,11,0.12)]"
                : "text-[#8a8599] hover:bg-[rgba(184,134,11,0.08)] hover:text-[#e8e4d8]"
            )}
          >
            {isAdmin ? <LockOpen size={18} className="flex-shrink-0" /> : <Lock size={18} className="flex-shrink-0" />}
            {!collapsed && <span>{isAdmin ? "Admin connecté" : "Administration"}</span>}
          </button>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="px-5 py-4 border-t border-[rgba(184,134,11,0.15)] text-center flex-shrink-0">
            <p className="text-[#8a8599] text-[11px] leading-relaxed">Lycée Hommane El Fetouaki</p>
            <p className="text-[#8a8599] text-[11px]">CRMEF Rabat · 2024–2025</p>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-4 bottom-16 w-8 h-8 bg-[#0f0f1a] border border-[rgba(184,134,11,0.25)] rounded-full flex items-center justify-center text-[#8a8599] hover:text-gold transition-colors z-10"
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
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
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
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
      <div className="hidden md:block flex-shrink-0" style={{ width: sidebarCollapsed ? 70 : 270 }}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 w-11 h-11 bg-[#0f0f1a] border border-[rgba(184,134,11,0.25)] rounded-lg flex items-center justify-center text-gold"
        >
          <Menu size={20} />
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
