import { Award, Users, ShieldCheck, Sparkles } from "lucide-react";

const ABOUT_IMG = "https://images.unsplash.com/photo-1481026469463-66327c86e544?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBnbGFzcyUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODIyNzc2OTV8MA&ixlib=rb-4.1.0&q=85";

const values = [
  { icon: ShieldCheck, t: "Quality First", d: "Only certified, brand-backed products that stand the test of time." },
  { icon: Users, t: "Customer Centric", d: "Personalised guidance from our experienced team — no upselling." },
  { icon: Award, t: "Industry Expertise", d: "14+ years of supplying glass, plywood and hardware across Tamil Nadu." },
  { icon: Sparkles, t: "Modern Range", d: "Latest designs, finishes and engineered materials updated regularly." },
];

export default function About() {
  return (
    <div data-testid="about-page" className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="label-eyebrow mb-4">About Maria</div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-stone-900">
          A name Kanyakumari trusts for building materials.
        </h1>
        <p className="mt-6 text-lg text-stone-600 leading-relaxed">
          Founded with a simple goal — to make premium glass, plywood, doors and hardware accessible to every builder, architect and homeowner in our region — Maria Glass & Plywood has grown into a name builders rely on.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <img src={ABOUT_IMG} alt="Maria showroom" className="rounded-3xl w-full h-[440px] object-cover" />
        </div>
        <div className="lg:col-span-5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">Quality you can build on.</h2>
          <p className="mt-4 text-stone-600 leading-relaxed">
            Our showroom on Beach Road in Nagercoil stocks an extensive range of products from India's most reputed brands — Sharon, Century, Green Ply, EBCO, Ozone, Dorset and more. We pride ourselves on personalised service: whether you are renovating a kitchen or fitting out an entire commercial floor, our team helps you choose materials that match your budget and your build.
          </p>
          <p className="mt-4 text-stone-600 leading-relaxed">
            Reliable supply, transparent pricing, and a deep network across Tamil Nadu — that's the Maria promise.
          </p>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v) => (
          <div key={v.t} className="product-card p-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
              <v.icon className="w-6 h-6 text-emerald-700" strokeWidth={1.5} />
            </div>
            <div className="font-display text-lg font-semibold text-stone-900">{v.t}</div>
            <div className="mt-2 text-sm text-stone-600 leading-relaxed">{v.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
