const products = {
  Glass: [
    { name: "Window Glass", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/window-scaled-qvrz22j7ccgng7872aiucsu0ss27wwwum6km4apfog.jpg" },
    { name: "Mirror Glass", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/mirror-glass7-qvrzgwfj68rimpoogpaxp23u7mypczsdzl4epgpti8.jpeg" },
    { name: "Toughened Glass", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/taughen-glass6-qvrzizmmczmgfing9lt38j4pqgo2gs2wxxb93lmbog.png" },
    { name: "Designer Glass", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/Designer-glass-1-qvs0hi99byvis0igpixvstk31ujb4n42crr5jefv6o.jpg" },
    { name: "Painting Glass", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/painting-glass10-qvs0id9xli1zf59eoeckl3qankaf6nj7h1a6dj5vhc.jpg" },
    { name: "Lacquered Glass", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/Lacquered-Glass1-qvs6z439uony776pm04yzdd5w94b4liit0kea22isg.jpg" },
  ],
  Plywood: [
    { name: "Sharon Plywood", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/products-qvs1eqtt02djbm8dme5ygxlv9cpkbc2d9a89gn5p5s.jpg" },
    { name: "Kit Plywood", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/Products2-qvs1na712w2as3twrl0yma1licml8cylfjk1e4hyn4.jpg" },
    { name: "Century Plywood", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/Compress-Marine-Plywood-qvs4za99lgc4zxis1geaxzw3p95jx9cxxhvn1ukk9s.jpg" },
    { name: "Green Plywood", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/HDMR-Sheet-qvs6y84rebg78gh4smbnmlfhp5htuvzncmdvyndwo0.jpg" },
    { name: "HDMR Sheet", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/green-plywood-1000x1000-1-qvs54rndgnucq1k20tpyhm2wg64mtp4komvltyfvz4.jpg" },
    { name: "Sunmica Plywood", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/sunmica-plywood-qw2uir4h98a73wthoxk0nk7n8z0qltvy6hjyu7cexs.jpg" },
  ],
  Doors: [
    { name: "Teak Door", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/Teak1-qvs5qdxqnhfrr65js651u5okb7kjv2ybnn1n72dwv4.jpg" },
    { name: "Bedroom Door", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/Bed-Room-Door1-qvs5r497yufss93bihilrz1gxzytulut39b8mtaw0w.jpg" },
    { name: "Oil Door", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/oil-door-1-qvs60meh2jg66bac0leszkp9694fofl3qarzbj7l40.jpg" },
  ],
  Hardware: [
    { name: "EBCO", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/EBCO2-qvs6l2e3ptf8bppu62lpw8b5zvlh2q5zgp6wgtocjk.jpg" },
    { name: "Ozone", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/elementor/thumbs/Ozone3-e1729859311407-qw2u8zkrthcrtnht36a5re8jgsv8ul2biqzfhgp6dc.jpeg" },
    { name: "Dorset", img: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/dorset-Hardware1.png" },
  ],
};

export default function Products() {
  return (
    <div data-testid="products-page" className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="label-eyebrow mb-4">Our Products</div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-stone-900">
          Materials curated for serious builders.
        </h1>
        <p className="mt-6 text-lg text-stone-600 leading-relaxed">
          Browse our wide selection of premium glass, engineered plywood, durable doors and trusted hardware. Our team is happy to recommend the right product for your project.
        </p>
      </div>

      {Object.entries(products).map(([category, items]) => (
        <section key={category} className="mt-20" data-testid={`products-section-${category.toLowerCase()}`}>
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">{category}</h2>
            <div className="text-sm text-stone-500">{items.length} products</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((p) => (
              <div key={p.name} className="product-card">
                <div className="aspect-square overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="font-display font-semibold text-stone-900">{p.name}</div>
                  <div className="text-xs text-stone-500 mt-1">{category}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
