import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, Loader2, CheckCircle2, LogOut, Upload } from "lucide-react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const LOGO = "https://customer-assets.emergentagent.com/job_c473f9e5-814c-45ab-92b6-facfece4a340/artifacts/kabbdtfj_maria_logo.jpg";

export default function FieldDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    client_name: "",
    client_company: "",
    client_mobile: "",
    client_email: "",
    site_address: "",
    notes: "",
    latitude: "",
    longitude: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const getGPS = () => {
    if (!navigator.geolocation) {
      toast.error("GPS not supported on this device");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        toast.success("Location captured");
        setGpsLoading(false);
      },
      (err) => {
        toast.error("Could not get location: " + err.message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append("photo", photo);
      const { data } = await api.post("/field/submit", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
      if (data.email_sent) toast.success("Report submitted & emailed to HQ");
      else toast.warning("Report saved, but email delivery failed");
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({ client_name: "", client_company: "", client_mobile: "", client_email: "", site_address: "", notes: "", latitude: "", longitude: "" });
    setPhoto(null);
    setPreview(null);
    setSubmitted(false);
  };

  return (
    <div data-testid="field-dashboard" className="min-h-[calc(100vh-5rem)] bg-stone-100">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="MG" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-display font-bold text-stone-900">Field Worker Portal</div>
              <div className="text-xs text-stone-500">Welcome, {user?.name}</div>
            </div>
          </div>
          <button onClick={() => { logout(); nav("/"); }} data-testid="field-logout" className="text-sm font-semibold text-stone-700 hover:text-emerald-700 inline-flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {submitted ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-emerald-200">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-bold text-stone-900 mt-4">Report submitted!</h2>
            <p className="text-stone-600 mt-2">Your site report has been sent to the company inbox.</p>
            <button onClick={reset} data-testid="field-new-report" className="btn-primary rounded-full px-7 py-3 text-sm font-semibold mt-6">
              Submit another report
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-3xl border border-stone-200 p-6 md:p-10 space-y-7">
            <div>
              <div className="label-eyebrow">New Submission</div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-2">Capture site details</h1>
              <p className="text-stone-600 mt-1 text-sm">Fill the form below — it will be emailed to HQ instantly.</p>
            </div>

            <fieldset className="space-y-5">
              <legend className="font-display text-lg font-semibold text-stone-900 mb-2">Client Details</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Client Name *" testId="field-client-name" value={form.client_name} onChange={handle("client_name")} required />
                <Field label="Client Company" testId="field-client-company" value={form.client_company} onChange={handle("client_company")} />
                <Field label="Client Mobile *" testId="field-client-mobile" value={form.client_mobile} onChange={handle("client_mobile")} required />
                <Field label="Client Email" testId="field-client-email" type="email" value={form.client_email} onChange={handle("client_email")} />
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="font-display text-lg font-semibold text-stone-900 mb-2">Construction Site</legend>
              <Field label="Site Address / Description" testId="field-site-address" value={form.site_address} onChange={handle("site_address")} />

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Site Location (GPS)</label>
                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={getGPS} disabled={gpsLoading} data-testid="field-gps-btn" className="rounded-xl border border-emerald-600 text-emerald-700 px-4 py-3 font-semibold inline-flex items-center justify-center gap-2 hover:bg-emerald-50 disabled:opacity-50">
                    {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    {gpsLoading ? "Locating..." : "Auto-detect current location"}
                  </button>
                  <input data-testid="field-latitude" value={form.latitude} onChange={handle("latitude")} placeholder="Latitude" className="flex-1 rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
                  <input data-testid="field-longitude" value={form.longitude} onChange={handle("longitude")} placeholder="Longitude" className="flex-1 rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
                </div>
                {form.latitude && form.longitude && (
                  <a href={`https://www.google.com/maps?q=${form.latitude},${form.longitude}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 font-semibold mt-2 inline-block">
                    View on Google Maps →
                  </a>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Construction Photo</label>
                <div className="mt-2 flex flex-col sm:flex-row items-start gap-4">
                  <label data-testid="field-photo-label" className="cursor-pointer rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-500 px-6 py-8 flex flex-col items-center justify-center text-stone-600 hover:text-emerald-700 w-full sm:w-72 transition-colors">
                    <Camera className="w-7 h-7 mb-2" strokeWidth={1.5} />
                    <span className="text-sm font-semibold">Tap to take / upload photo</span>
                    <span className="text-xs text-stone-400 mt-1">JPG / PNG</span>
                    <input data-testid="field-photo-input" type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
                  </label>
                  {preview && (
                    <div className="relative">
                      <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded-xl border border-stone-200" />
                      <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">Ready</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Notes</label>
                <textarea data-testid="field-notes" rows={3} value={form.notes} onChange={handle("notes")} placeholder="Any observations, materials needed, follow-ups..." className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
              </div>
            </fieldset>

            <button data-testid="field-submit-btn" disabled={loading} className="btn-primary w-full rounded-full px-7 py-4 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {loading ? "Submitting..." : "Submit Report & Send Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, testId, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">{label}</label>
      <input data-testid={testId} type={type} required={required} value={value} onChange={onChange} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none" />
    </div>
  );
}
