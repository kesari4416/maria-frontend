import { useState } from "react";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page" className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="label-eyebrow mb-4">Contact Us</div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-stone-900">
          Tell us about your project.
        </h1>
        <p className="mt-6 text-lg text-stone-600 leading-relaxed">
          Drop us a message or visit our Nagercoil showroom. We typically respond within a business day.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <form onSubmit={submit} className="product-card p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Name</label>
                <input data-testid="contact-name" required value={form.name} onChange={handle("name")} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Email</label>
                <input data-testid="contact-email" type="email" required value={form.email} onChange={handle("email")} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Phone</label>
                <input data-testid="contact-phone" value={form.phone} onChange={handle("phone")} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Subject</label>
                <input data-testid="contact-subject" value={form.subject} onChange={handle("subject")} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Message</label>
              <textarea data-testid="contact-message" required rows={5} value={form.message} onChange={handle("message")} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
            </div>
            <button data-testid="contact-submit" disabled={loading} className="btn-primary rounded-full px-7 py-3.5 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <a href="tel:+919994611220" className="product-card p-7 flex items-start gap-4 hover:border-emerald-300 transition-colors">
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center"><Phone className="w-5 h-5 text-emerald-700" strokeWidth={1.5} /></div>
            <div>
              <div className="label-eyebrow">Call</div>
              <div className="font-display text-lg font-semibold text-stone-900 mt-1">+91 99946 11220</div>
              <div className="text-sm text-stone-600 mt-1">Mon–Sat · 9:00 AM – 8:00 PM</div>
            </div>
          </a>

          <div className="product-card p-7 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center"><Mail className="w-5 h-5 text-emerald-700" strokeWidth={1.5} /></div>
            <div>
              <div className="label-eyebrow">Email</div>
              <div className="font-display text-lg font-semibold text-stone-900 mt-1">info@mariaglassplywood.com</div>
              <div className="text-sm text-stone-600 mt-1">We reply within 24 hours.</div>
            </div>
          </div>

          <div className="product-card p-7 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center"><MapPin className="w-5 h-5 text-emerald-700" strokeWidth={1.5} /></div>
            <div>
              <div className="label-eyebrow">Visit</div>
              <div className="font-display text-lg font-semibold text-stone-900 mt-1">29/10-B, Beach Road</div>
              <div className="text-sm text-stone-600 mt-1">Nagercoil, Kanyakumari, Tamil Nadu — 629002</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
