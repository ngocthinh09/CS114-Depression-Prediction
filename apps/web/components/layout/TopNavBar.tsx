"use client";

import Link from "next/link";
import { LogoGroup } from "../ui/LogoGroup";

export type NavPage = "home" | "about" | "prediction" | "help";

interface TopNavBarProps {
  activePage: NavPage;
}

export const TopNavBar = ({ activePage }: TopNavBarProps) => {
  const navLinks = [
    { label: "Home", href: "/", id: "home" },
    { label: "About", href: "/about", id: "about" },
    { label: "Prediction", href: "/assessment", id: "prediction" },
    { label: "Help", href: "/help", id: "help" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-container-max items-center justify-between px-margin-mobile md:px-lg">
        {/* Brand Logo Group */}
        <LogoGroup />

        {/* Navigation Links (Desktop) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-md md:flex">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`text-label-md py-2 transition-all ${
                  isActive
                    ? "text-primary border-b-2 border-primary font-bold scale-100"
                    : "text-on-surface-variant hover:text-primary scale-95 opacity-80 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Trailing Action */}
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/support"
            className="hidden rounded-lg bg-primary px-6 py-3 text-label-md font-medium text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95 md:block"
          >
            Get Support
          </Link>

          {/* Mobile Menu Icon */}
          <button className="text-on-surface md:hidden">
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
