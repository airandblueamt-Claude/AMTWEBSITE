// Header.tsx
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../assets/LOGOAMT.png";
import OptimizedImage from "./OptimizedImage";
import {
  AppLocale,
  DEFAULT_LOCALE,
  isSupportedLocale,
  stripLocalePrefix,
  withLocale,
} from "../utils/localeRouting";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<string>(() =>
    (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) || "dark"
  );
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("amt-theme", next); } catch { /* ignore */ }
  };
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pathLocale = location.pathname.split("/").filter(Boolean)[0];
  const locale: AppLocale = isSupportedLocale(pathLocale) ? pathLocale : DEFAULT_LOCALE;
  const isRTL = locale === "ar";

  const localizedPath = (path: string) => withLocale(path, locale);

  const toggleLanguage = () => {
    const newLocale: AppLocale = isRTL ? "en" : "ar";
    const currentPathWithoutLocale = stripLocalePrefix(location.pathname);
    navigate(withLocale(currentPathWithoutLocale, newLocale));
  };

  const navItems = [
    { label: t("nav.home"), path: localizedPath("/") },
    { label: t("nav.aboutUs"), path: localizedPath("/about") },
    { label: t("nav.solutions"), path: localizedPath("/solution-details") },
    { label: t("nav.contactUs"), path: localizedPath("/contact") },
  ];

  return (
    <header
      className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-hairline shadow-lg shadow-black/20 transition-colors"
      style={{ backgroundColor: "var(--header-bg)" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-20 h-16 sm:h-20">

        {/* ===== LOGO ===== */}
        <div className="flex-shrink-0">
          <Link to={localizedPath("/")}>
            <OptimizedImage
              src={Logo}
              alt="AMT — Advanced Micro Technologies corporate logo"
              className="amt-logo h-12 sm:h-16 w-auto object-contain"
              width={180}
              height={64}
              priority
            />
          </Link>
        </div>

        {/* ===== NAV ===== */}
        <div className="flex items-center">

          {/* Desktop */}
          <nav
            className={`hidden md:flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""
              }`}
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname === `${item.path}/`;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative font-medium transition ${isActive ? "text-[#d6132b]" : "text-ink"
                    } hover:text-[#d6132b]`}
                >
                  {item.label}

                  {/* underline */}
                  <span
                    className={`absolute -bottom-1 h-[2px] bg-[#d6132b] transition-all duration-300 ${isRTL ? "right-0" : "left-0"
                      } ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </Link>
              );
            })}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="grid place-items-center w-9 h-9 rounded-full border border-[#d6132b]/50 text-[#d6132b] hover:bg-[#d6132b] hover:text-white transition"
              aria-label="Toggle light/dark theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 border border-[#d6132b] rounded text-[#d6132b] font-medium hover:bg-[#d6132b] hover:text-white transition"
              aria-label="Toggle Language"
            >
              {isRTL ? "EN" : "AR"}
            </button>
          </nav>

          {/* Mobile Button */}
          <div className="md:hidden ml-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-[#d6132b]" />
              ) : (
                <Menu className="w-6 h-6 text-[#d6132b]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen" : "max-h-0"
          }`}
        style={{ backgroundColor: "var(--header-bg-solid)" }}
      >
        <div className={isRTL ? "text-right" : "text-left"}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-4 px-6 text-ink font-medium hover:text-[#d6132b]"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full py-4 px-6 text-[#d6132b] font-medium hover:bg-[#d6132b] hover:text-white transition"
            aria-label="Toggle light/dark theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          {/* Mobile Language Toggle */}
          <button
            onClick={() => {
              toggleLanguage();
              setIsOpen(false);
            }}
            className="block w-full py-4 px-6 text-[#d6132b] font-medium hover:bg-[#d6132b] hover:text-white transition"
            aria-label="Toggle Language"
          >
            {isRTL ? "EN" : "AR"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
