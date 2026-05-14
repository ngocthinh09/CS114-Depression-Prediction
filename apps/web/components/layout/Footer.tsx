import Link from "next/link";

export const Footer = () => {
  const footerLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Medical Disclaimer", href: "#" },
    { label: "Crisis Resources", href: "#" },
  ];

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-white/20 px-margin-mobile py-xl backdrop-blur-md md:px-lg">
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-md md:flex-row">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2 text-headline-md font-bold text-primary">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
            MindfulCheck
          </div>
          <p className="text-center text-body-md text-tertiary md:text-left">
            © 2026 MindfulCheck Student Support. This is not a medical diagnosis.
          </p>
        </div>

        {/* Footer Links */}
        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 md:mt-0">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-label-sm text-on-surface-variant opacity-80 transition-all hover:text-primary hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};
