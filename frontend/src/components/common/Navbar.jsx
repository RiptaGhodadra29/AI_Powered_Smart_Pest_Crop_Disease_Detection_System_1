import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import { cn } from "../ui/cn";

const navLinkClass = ({ isActive }) =>
  cn(
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
    isActive
      ? "bg-white/15 text-white"
      : "text-white/80 hover:bg-white/10 hover:text-white"
  );

const LanguageSelect = ({ language, setLanguage, className, ariaLabel }) => (
  <div className={cn("relative", className)}>
    <Icon
      name="globe"
      className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
    />
    <select
      aria-label={ariaLabel}
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="h-9 w-full appearance-none rounded-lg border border-white/20 bg-white/10 py-1 pl-8 pr-7 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0 [&>option]:text-neutral-900"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="gu">ગુજરાતી</option>
    </select>
    <svg
      className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const authedLinks = [
    { to: "/upload", label: t.nav_upload, icon: "upload" },
    { to: "/history", label: t.nav_history, icon: "history" },
    { to: "/dashboard", label: t.nav_dashboard, icon: "dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-800/40 bg-brand-700 text-white shadow-soft print:hidden">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 rounded-lg py-1 pr-2 font-bold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Icon name="leaf" className="h-5 w-5" />
          </span>
          <span className="text-lg leading-tight tracking-tight">
            {t.brand}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            {t.nav_home}
          </NavLink>

          {isAuthenticated &&
            authedLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                <Icon name={link.icon} className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}

          <span className="mx-2 h-6 w-px bg-white/20" aria-hidden="true" />

          <LanguageSelect
            language={language}
            setLanguage={setLanguage}
            ariaLabel={t.language_label}
            className="w-36"
          />

          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="ml-1 text-white/90 hover:bg-white/10 hover:text-white"
            >
              <Icon name="logout" className="h-4 w-4" />
              {t.nav_logout}
            </Button>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                {t.nav_login}
              </NavLink>
              <Button
                as={Link}
                to="/register"
                size="sm"
                variant="secondary"
                className="ml-1 border-transparent bg-white text-brand-700 hover:bg-brand-50"
              >
                {t.nav_signup}
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t.nav_toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="animate-fade-in border-t border-white/10 bg-brand-700 px-4 pb-4 pt-2 md:hidden"
        >
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              {t.nav_home}
            </NavLink>

            {isAuthenticated &&
              authedLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  <Icon name={link.icon} className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}

            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  {t.nav_login}
                </NavLink>
                <NavLink
                  to="/register"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  {t.nav_signup}
                </NavLink>
              </>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <LanguageSelect
              language={language}
              setLanguage={setLanguage}
              ariaLabel={t.language_label}
              className="w-40"
            />
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="text-white/90 hover:bg-white/10 hover:text-white"
              >
                <Icon name="logout" className="h-4 w-4" />
                {t.nav_logout}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
