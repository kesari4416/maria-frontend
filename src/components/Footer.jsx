import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const LOGO = "https://customer-assets.emergentagent.com/job_c473f9e5-814c-45ab-92b6-facfece4a340/artifacts/kabbdtfj_maria_logo.jpg";
const WHATSAPP_URL = "https://wa.me/919994611220?text=Hello%20Maria%20Glass%20%26%20Plywood%2C%20I%27d%20like%20to%20enquire%20about%20your%20products.";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <img src={LOGO} alt="MG" className="w-14 h-14 rounded-full" />
            <div>
              <div className="font-display text-xl font-bold text-white">Maria Glass & Plywoods</div>
              <div className="text-xs tracking-[0.2em] uppercase text-emerald-400">Trusted in Kanyakumari</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-stone-400 max-w-md">
            Your trusted destination for premium glass, plywood, hardware and doors. Serving residential and commercial projects across Tamil Nadu with quality you can build on.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer noopener"
            data-testid="footer-whatsapp-link"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white pl-2 pr-6 py-2 transition-all hover:-translate-y-0.5"
          >
            <span className="whatsapp-pulse w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <span className="whatsapp-wiggle flex">
                <WhatsAppIcon className="w-6 h-6 text-white" />
              </span>
            </span>
            <span className="text-left">
              <span className="block text-[10px] tracking-[0.2em] uppercase text-emerald-100 font-semibold">Chat with us</span>
              <span className="block font-semibold text-sm">+91 6379517048</span>
            </span>
          </a>
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
          <div className="label-eyebrow text-emerald-400 mb-4">Reach Us</div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-emerald-400" /> 29/10-B, Beach Road, Nagercoil, Kanyakumari, Tamil Nadu — 629002</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-emerald-400" /> <a href="tel:+916379517048" className="hover:text-white">+91 6379517048</a></li>
            <li className="flex gap-2 items-start">
              <WhatsAppIcon className="w-4 h-4 mt-0.5 text-[#25D366]" />
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener" className="hover:text-white">WhatsApp us</a>
            </li>
            <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 text-emerald-400" /> mariaglassonline@gmail.com</li>
          </ul>
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
