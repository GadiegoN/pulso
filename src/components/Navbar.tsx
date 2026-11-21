"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Menu, X, Sun, Moon, ArrowRight, Radio, Lock } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "O Cenário", href: "/#cenario" },
    { label: "A Solução", href: "/#solucao" },
    { label: "Como Funciona", href: "/#como-funciona" },
    { label: "Guia Local", href: "/guia" },
    { label: "Para Quem É", href: "/#segmentos" },
    { label: "Liderança", href: "/#lideranca" },
    { label: "Visão", href: "/#visao" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-[#080914]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-lg shadow-black/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo: PULSO */}
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-[#ff2a85] via-[#ff7300] to-[#00f0ff] p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-[#ff2a85]/20">
              <div className="w-full h-full bg-white dark:bg-[#0d0f23] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#ff2a85] dark:text-[#00f0ff] transition-transform group-hover:scale-110" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#e11d48] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
                  PULSO
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#ff2a85]/10 text-[#ff2a85] dark:bg-[#00f0ff]/15 dark:text-[#00f0ff] border border-[#ff2a85]/20 dark:border-[#00f0ff]/30 tracking-tight">
                  REDE LOCAL
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                Rede de Comunicação Local
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema claro/escuro"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              title={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#ff9900]" />
              ) : (
                <Moon className="w-4 h-4 text-[#0284c7]" />
              )}
            </button>

            {/* Login / Painel Link */}
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#ff2a85] dark:text-[#00f0ff]" />
              <span>Painel</span>
            </Link>

            {/* CTA Button */}
            <a
              href="#contato"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#ff2a85] to-[#ff7300] shadow-md shadow-[#ff2a85]/30 hover:shadow-lg hover:shadow-[#ff2a85]/40 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Quero Conhecer</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#ff9900]" />
              ) : (
                <Moon className="w-4 h-4 text-[#0284c7]" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu de navegação"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#080914]/95 backdrop-blur-xl px-5 pt-4 pb-6 shadow-2xl transition-all">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 text-center"
              >
                <Lock className="w-4 h-4 text-[#ff2a85] dark:text-[#00f0ff]" />
                <span>Acessar Painel</span>
              </Link>

              <a
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ff2a85] to-[#ff7300] shadow-md shadow-[#ff2a85]/30 text-center"
              >
                <span>Quero Conhecer o Projeto</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
