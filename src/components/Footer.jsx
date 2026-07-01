import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { BRANCHES } from "@/lib/branches";

const LOGO = "https://customer-assets.emergentagent.com/job_c473f9e5-814c-45ab-92b6-facfece4a340/artifacts/kabbdtfj_maria_logo.jpg";
const GENERAL_MOBILE = "+91 63795 17048";
const GENERAL_MOBILE_DIGITS = "916379517048";
const GENERAL_EMAIL = "mariaglassonline@gmail.com";
const WHATSAPP_URL = `https://wa.me/${GENERAL_MOBILE_DIGITS}?text=${encodeURIComponent("Hello Maria Glass & Plywoods, I'd like to enquire about your products.")}`;

const MAIN = BRANCHES.Nagercoil;
const SUB_KEYS = ["Valliyoor", "Thisayanvilai", "Monday Market"];

function digits(mob) { return (mob || "").replace(/\D/g, ""); }

function BranchCard({ b, main = false }) {
  return (
    <div
      data-testid={`footer-branch-${b.branch.toLowerCase().replace(/\s+/g, "-")}`}
      className={`rounded-xl p-5 border ${main ? "bg-emerald-950/40 border-emerald-800" : "bg-stone-900/60 border-stone-800"}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {main && (
          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-950 text-[10px] font-bold tracking-wider uppercase">Main Branch</span>
        )}
        <div className="font-display font-bold text-white text-sm">{b.branch}</div>
      </div>
      <div className="flex gap-2 text-sm text-stone-300 mb-3">
        <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
        <a
          href={b.mapLink}
          target="_blank"
          rel="noreferrer noopener"
          className="hover:text-white whitespace-pre-line leading-relaxed"
        >
          {b.address}
        </a>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <a href={`tel:${digits(b.mobile)}`} className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white">
          <Phone className="w-3.5 h-3.5 text-emerald-400" /> {b.mobile}
        </a>
        <a
          href={`https://wa.me/${digits(b.mobile)}?text=${encodeURIComponent(`Hello Maria Glass & Plywoods (${b.branch}), I'd like to enquire.`)}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={LOGO} alt="MG" className="w-14 h-14 rounded-full" />
              <div>
                <div className="font-display text-xl font-bold text-white">Maria Glass & Plywoods</div>
                <div className="text-xs tracking-[0.2em] uppercase text-emerald-400">Nagercoil · Since 2006</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400 mb-6">
              Your trusted destination for premium glass, plywood, hardware and doors. Serving residential and commercial projects across Tamil Nadu with quality you can build on.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer noopener"
              data-testid="footer-whatsapp-link"
              className="inline-flex items-center gap-3 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white pl-2 pr-6 py-2 transition-all hover:-translate-y-0.5"
            >
              <span className="whatsapp-pulse w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <span className="whatsapp-wiggle flex">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </span>
              </span>
              <span className="text-left">
                <span className="block text-[10px] tracking-[0.2em] uppercase text-emerald-100 font-semibold">Chat with us</span>
                <span className="block font-semibold text-sm">{GENERAL_MOBILE}</span>
              </span>
            </a>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href={`tel:${GENERAL_MOBILE_DIGITS}`} data-testid="footer-call-link" className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {GENERAL_MOBILE}
              </a>
              <a href={`mailto:${GENERAL_EMAIL}`} data-testid="footer-email-link" className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> {GENERAL_EMAIL}
              </a>
            </div>
          </div>

          <div>
            <div className="label-eyebrow text-emerald-400 mb-4">Explore</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/products" className="hover:text-white">Products</Link></li>
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="label-eyebrow text-emerald-400 mb-4">Get in Touch</div>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 items-start">
                <Phone className="w-4 h-4 mt-0.5 text-emerald-400" />
                <a href={`tel:${GENERAL_MOBILE_DIGITS}`} className="hover:text-white">{GENERAL_MOBILE}</a>
              </li>
              <li className="flex gap-2 items-start">
                <WhatsAppIcon className="w-4 h-4 mt-0.5 text-[#25D366]" />
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener" className="hover:text-white">WhatsApp us</a>
              </li>
              <li className="flex gap-2 items-start">
                <Mail className="w-4 h-4 mt-0.5 text-emerald-400" />
                <a href={`mailto:${GENERAL_EMAIL}`} className="hover:text-white">{GENERAL_EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-10">
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <div>
              <div className="label-eyebrow text-emerald-400 mb-1">Our Branches</div>
              <h3 className="font-display text-2xl font-bold text-white">Visit us across Tamil Nadu</h3>
            </div>
            <div className="text-xs text-stone-500">{SUB_KEYS.length + 1} showrooms · Open 6 days a week</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <BranchCard b={MAIN} main />
            {SUB_KEYS.map((k) => (
              <BranchCard key={k} b={BRANCHES[k]} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-5 text-xs text-stone-500 flex flex-col sm:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} Maria Glass & Plywoods. All rights reserved.</div>
          <div>Crafted with care · Quality you can build on.</div>
        </div>
      </div>
    </footer>
  );
}
