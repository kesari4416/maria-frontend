import { Link } from "react-router-dom";
import { ArrowRight, Award, ShieldCheck, Headphones, Smile, Phone } from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1523477593243-78bbf626fd3b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnbGFzcyUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODIyNzc2OTV8MA&ixlib=rb-4.1.0&q=85";
const ABOUT_IMG = "https://images.unsplash.com/photo-1481026469463-66327c86e544?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBnbGFzcyUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODIyNzc2OTV8MA&ixlib=rb-4.1.0&q=85";

const features = [
  { icon: Award, title: "Quality Products", text: "Sourced from India's most trusted brands." },
  { icon: ShieldCheck, title: "Affordable Prices", text: "Fair, transparent pricing on every order." },
  { icon: Headphones, title: "Best Support", text: "Expert guidance from selection to delivery." },
  { icon: Smile, title: "Client Satisfaction", text: "Hundreds of happy homes & projects." },
];

const categories = [
  {
    name: "Premium Glass",
    desc: "Window, mirror, toughened, designer & lacquered glass.",
    img: "https://images.pexels.com/photos/33410957/pexels-photo-33410957.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    name: "Engineered Plywoods",
    desc: "Sharon, Century, Green, HDMR sheets & Sunmica.",
    img: "https://images.unsplash.com/photo-1700973408133-b45276ec8feb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxwbHl3b29kJTIwc3RhY2t8ZW58MHx8fHwxNzgyMjc3Njk1fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    name: "Doors & Hardware",
    desc: "Teak doors, bedroom doors, EBCO, Ozone, Dorset fittings.",
    img: "https://images.unsplash.com/photo-1583691028182-e8f01e74bfa2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxkb29yJTIwaGFyZHdhcmUlMjBjb25zdHJ1Y3Rpb258ZW58MHx8fHwxNzgyMjc3Njk1fDA&ixlib=rb-4.1.0&q=85",
  },
];

const brands = ["Green Ply", "Mayur", "Sharon", "Century", "Woodline", "Kit Ply", "EBCO", "Ozone", "Dorset"];

export default function Home() {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 h-full flex flex-col justify-end pb-24">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-300/40 text-emerald-200 text-[11px] font-bold tracking-[0.2em] uppercase mb-5">Quality you can build on</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              Premium Glass, Plywood & Doors for every kind of build.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-stone-200 max-w-2xl leading-relaxed">
              From elegant glass facades to sturdy doors and finest plywood — Maria Glass & Plywood is Kanyakumari's go-to partner for residential and commercial projects.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/products" data-testid="hero-cta-products" className="btn-primary rounded-full px-7 py-3.5 text-sm font-semibold inline-flex items-center gap-2">
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+919994611220" data-testid="hero-cta-call" className="btn-outline rounded-full px-7 py-3.5 text-sm font-semibold inline-flex items-center gap-2">
                <Phone className="w-4 h-4" /> +91 99946 11220
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <div className="label-eyebrow mb-4">About Us</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
            Building trust in every sheet, pane and panel.
          </h2>
          <p className="mt-6 text-stone-600 leading-relaxed">
            Maria Glass & Plywoods is your trusted destination for high-quality glass, plywood, and hardware solutions in Nagercoil. With years of industry expertise, we offer a curated selection that meets the demands of architects, contractors and homeowners alike.
          </p>
          <p className="mt-4 text-stone-600 leading-relaxed">
            Committed to quality and customer satisfaction, we deliver personalized service for both residential and commercial projects — experience excellence with Maria.
          </p>
          <Link to="/about" data-testid="about-learn-more" className="inline-flex items-center gap-2 mt-8 text-emerald-700 font-semibold hover:gap-3 transition-all">
            Read our story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="lg:col-span-6 relative">
          <img src={ABOUT_IMG} alt="Maria Glass showroom" className="rounded-3xl w-full h-[440px] object-cover" />
          <div className="absolute -bottom-6 -left-6 hidden md:block bg-emerald-700 text-white p-6 rounded-2xl shadow-xl">
            <div className="text-3xl font-bold font-display">20+</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1">Years of trust</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-stone-100 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="text-center mb-14">
            <div className="label-eyebrow mb-4">Our Features</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">Why builders choose Maria</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="product-card p-8 text-left">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-emerald-700" strokeWidth={1.5} />
                </div>
                <div className="font-display text-lg font-semibold text-stone-900 mb-2">{f.title}</div>
                <div className="text-sm text-stone-600 leading-relaxed">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="label-eyebrow mb-4">Our Range</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">Crafted for every kind of space</h2>
          </div>
          <Link to="/products" data-testid="see-all-products" className="text-emerald-700 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
            See all products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div key={c.name} className="product-card group">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-7">
                <div className="font-display text-xl font-semibold text-stone-900">{c.name}</div>
                <div className="mt-2 text-sm text-stone-600 leading-relaxed">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="border-y border-stone-200 bg-white py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 mb-6">
          <div className="label-eyebrow">Our trusted brands</div>
        </div>
        <div className="marquee">
          {[...brands, ...brands].map((b, i) => (
            <div key={i} className="px-10 py-2 font-display text-2xl sm:text-3xl font-bold text-stone-300 whitespace-nowrap">
              {b} ·
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-20">
        <div className="rounded-3xl bg-stone-950 text-white p-10 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <div className="label-eyebrow text-emerald-400 mb-4">Start your project</div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Visit our Nagercoil showroom or call us for a free consultation.
            </h3>
            <p className="mt-4 text-stone-400 max-w-xl">29/10-B, Beach Road, Nagercoil, Kanyakumari, Tamil Nadu — 629002</p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
            <a href="tel:+919994611220" data-testid="cta-call" className="btn-primary rounded-full px-7 py-3.5 text-sm font-semibold inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <Link to="/contact" data-testid="cta-contact" className="rounded-full px-7 py-3.5 text-sm font-semibold border border-white/30 hover:bg-white hover:text-stone-900 transition-colors">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
