import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const BG = "https://images.unsplash.com/photo-1623489254637-a2dd8375243d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBzaXRlfGVufDB8fHx8MTc4MjI3NzcwM3ww&ixlib=rb-4.1.0&q=85";
const LOGO = "https://customer-assets.emergentagent.com/job_c473f9e5-814c-45ab-92b6-facfece4a340/artifacts/kabbdtfj_maria_logo.jpg";

export default function PortalLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (r.ok) {
      toast.success("Welcome back!");
      nav(r.user.role === "admin" ? "/admin" : "/field");
    } else {
      toast.error(r.error);
    }
  };

  return (
    <div data-testid="portal-login-page" className="min-h-[calc(100vh-5rem)] grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/80 via-stone-900/60 to-emerald-900/70" />
        <div className="relative z-10 h-full p-12 flex flex-col justify-between text-white">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="MG" className="w-12 h-12 rounded-full ring-2 ring-white/20" />
            <div className="font-display font-bold text-xl">Maria Glass & Plywood</div>
          </div>
          <div>
            <div className="label-eyebrow text-emerald-300">Field Portal</div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mt-4 leading-tight max-w-md">
              Capture site reports. Send to HQ instantly.
            </h2>
            <p className="mt-4 text-stone-300 max-w-md">
              Log client details, snap site photos and auto-tag the location — your report reaches the company inbox in seconds.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16 bg-[#FAFAF9]">
        <div className="w-full max-w-md">
          <div className="label-eyebrow">Sign in</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-3">Welcome to the Portal</h1>
          <p className="mt-3 text-stone-600">For field workers and administrators.</p>

          <form onSubmit={submit} className="mt-10 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Email</label>
              <input
                data-testid="portal-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Password</label>
              <input
                data-testid="portal-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              data-testid="portal-login-submit"
              disabled={loading}
              className="btn-primary w-full rounded-full px-7 py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-10 text-sm text-stone-500">
            Don't have access? Contact your administrator. <br />
            <Link to="/" className="text-emerald-700 font-semibold mt-2 inline-block">← Back to website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
