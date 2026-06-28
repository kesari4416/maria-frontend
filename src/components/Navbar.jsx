import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const LOGO = "https://customer-assets.emergentagent.com/job_c473f9e5-814c-45ab-92b6-facfece4a340/artifacts/kabbdtfj_maria_logo.jpg";
const WHATSAPP_URL = "https://wa.me/919994611220?text=Hello%20Maria%20Glass%20%26%20Plywood%2C%20I%27d%20like%20to%20enquire%20about%20your%20products.";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3" data-testid="nav-logo">
          <img src={LOGO} alt="Maria Glass & Plywoods" className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100" />
          <div className="leading-tight">
            <div className="font-display font-bold text-lg text-stone-900">Maria Glass & Plywoods</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-emerald-700 font-semibold">Nagercoil · Since 2006</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-emerald-700" : "text-stone-700 hover:text-emerald-700"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+919994611220"
            data-testid="nav-call"
            className="flex items-center gap-2 text-sm font-semibold text-stone-800 hover:text-emerald-700"
          >
            <Phone className="w-4 h-4" /> 99946 11220
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer noopener"
            data-testid="nav-whatsapp"
            aria-label="Chat on WhatsApp"
            className="whatsapp-pulse inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white transition-all hover:-translate-y-0.5"
          >
            <span className="whatsapp-wiggle flex"><WhatsAppIcon className="w-5 h-5" /></span>
          </a>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen((s) => !s)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `py-2 text-base font-medium ${isActive ? "text-emerald-700" : "text-stone-800"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              data-testid="nav-mobile-whatsapp"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white px-5 py-3 text-sm font-semibold"
            >
              <span className="whatsapp-wiggle flex"><WhatsAppIcon className="w-5 h-5" /></span>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
