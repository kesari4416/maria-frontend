import { Hammer, Truck, Ruler, Sparkles, ShieldCheck, Layers } from "lucide-react";

const services = [
  { icon: Layers, t: "Custom Glass Cutting", d: "Toughened, mirror & designer glass cut to your exact specifications." },
  { icon: Ruler, t: "On-site Measurement", d: "Our team visits your site to take precise measurements before fabrication." },
  { icon: Hammer, t: "Installation Support", d: "Coordinated installation through verified partners for doors, glass and hardware." },
  { icon: Truck, t: "Doorstep Delivery", d: "Fast, careful delivery to your site anywhere across Kanyakumari district." },
  { icon: Sparkles, t: "Design Consultation", d: "Get expert recommendations on finishes, brands and configurations." },
  { icon: ShieldCheck, t: "Warranty & After-sales", d: "We stand behind every product with manufacturer-backed warranty support." },
];

export default function Services() {
  return (
    <div data-testid="services-page" className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="label-eyebrow mb-4">Our Services</div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-stone-900">
          More than a supplier — your build partner.
        </h1>
        <p className="mt-6 text-lg text-stone-600 leading-relaxed">
          From design consultation to delivery, we go beyond just selling materials. Here's how the Maria team helps your project come together.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.t} className="product-card p-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
              <s.icon className="w-6 h-6 text-emerald-700" strokeWidth={1.5} />
            </div>
            <div className="font-display text-lg font-semibold text-stone-900">{s.t}</div>
            <div className="mt-2 text-sm text-stone-600 leading-relaxed">{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
