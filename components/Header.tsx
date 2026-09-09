"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, User, LogIn, LogOut, CreditCard, ChevronDown, Heart, HelpCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

interface AuthUser {
  id: string;
  nome: string;
  email: string;
}

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setUserMenuOpen(false);
    setMenuOpen(false);
    toast.success("Você saiu da sua conta");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80" role="banner">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="CIPTEA Digital — Página inicial">
          {/* Puzzle icon */}
          <svg width="28" height="28" viewBox="0 0 100 100">
            <path
              d="M50 0 C50 0, 65 0, 65 0 C65 0, 65 10, 75 10 C85 10, 85 0, 85 0 L100 0 L100 35 C100 35, 90 35, 90 45 C90 55, 100 55, 100 55 L100 100 L65 100 C65 100, 65 90, 55 90 C45 90, 45 100, 45 100 L0 100 L0 65 C0 65, 10 65, 10 55 C10 45, 0 45, 0 45 L0 0 Z"
              fill="#1E88E5"
            />
          </svg>
          <div>
            <span className="text-lg font-bold text-autism-blue">
              Carteira Autismo
            </span>
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              Parnamirim/RN
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex" aria-label="Navegação principal">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition hover:text-autism-blue"
          >
            Início
          </Link>
          <Link
            href="/solicitar"
            className="text-sm font-medium text-muted-foreground transition hover:text-autism-blue"
          >
            Solicitar
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium text-muted-foreground transition hover:text-autism-blue"
          >
            Sobre
          </Link>
          <Link
            href="/ajuda"
            className="text-sm font-medium text-muted-foreground transition hover:text-autism-blue"
          >
            Ajuda
          </Link>
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 rounded-full border border-autism-blue/20 bg-autism-blue/5 px-3 py-1.5 text-sm font-medium text-autism-blue transition hover:bg-autism-blue/10"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="Menu do usuário"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-autism-blue text-[10px] font-bold text-white">
                  {user.nome.charAt(0).toUpperCase()}
                </div>
                {user.nome.split(" ")[0]}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", userMenuOpen && "rotate-180")} />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-xl dark:bg-gray-900" role="menu" aria-label="Opções do usuário">
                  <div className="border-b px-4 py-3">
                    <p className="text-sm font-semibold">{user.nome}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/minha-conta"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-muted/50"
                    >
                      <User className="h-4 w-4 text-autism-blue" />
                      Minha Conta
                    </Link>
                    <Link
                      href="/perfil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-muted/50"
                    >
                      <Pencil className="h-4 w-4 text-amber-500" />
                      Editar Perfil
                    </Link>
                    <Link
                      href="/solicitar"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-muted/50"
                    >
                      <CreditCard className="h-4 w-4 text-autism-green" />
                      Solicitar Carteira
                    </Link>
                  </div>
                  <div className="border-t p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-autism-red transition hover:bg-autism-red/5"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair da conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                Entrar
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Alternar tema"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Alternar tema"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t md:hidden",
          menuOpen ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Menu de navegação mobile">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/20"
            onClick={() => setMenuOpen(false)}
          >
            Início
          </Link>
          <Link
            href="/solicitar"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/20"
            onClick={() => setMenuOpen(false)}
          >
            Solicitar Carteira
          </Link>
          <Link
            href="/sobre"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/20"
            onClick={() => setMenuOpen(false)}
          >
            Sobre & Direitos
          </Link>
          <Link
            href="/ajuda"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/20"
            onClick={() => setMenuOpen(false)}
          >
            Ajuda
          </Link>
          {user ? (
            <>
              {/* User info */}
              <div className="my-2 rounded-lg border border-autism-blue/20 bg-autism-blue/5 px-3 py-3">
                <p className="text-sm font-semibold text-autism-blue">{user.nome}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Link
                href="/minha-conta"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-autism-blue hover:bg-muted/20"
                onClick={() => setMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Minha Conta
              </Link>
              <Link
                href="/perfil"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-amber-600 hover:bg-muted/20"
                onClick={() => setMenuOpen(false)}
              >
                <Pencil className="h-4 w-4" />
                Editar Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-autism-red hover:bg-autism-red/5"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-autism-blue hover:bg-muted/20"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
