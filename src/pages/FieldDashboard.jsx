import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, Loader2, CheckCircle2, LogOut, Upload, PlusCircle, ListChecks, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { whatsappLink, normalizeWhatsApp } from "@/lib/whatsapp";

const LOGO = "https://customer-assets.emergentagent.com/job_c473f9e5-814c-45ab-92b6-facfece4a340/artifacts/kabbdtfj_maria_logo.jpg";

const STATUS_OPTIONS = [
  "Site Visited",
  "Materials Delivered",
  "Work in Progress",
  "Completed",
  "On Hold",
  "Cancelled",
];

const CLIENT_ROLES = ["Engineer", "Plumber", "Electrician", "Mastri", "Other"];
const LOCATIONS = ["Nagercoil", "Monday Market", "Valliyoor", "Thisayanvilai"];

const STATUS_COLOR = {
  "Site Visited": "bg-blue-50 text-blue-700",
  "Materials Delivered": "bg-violet-50 text-violet-700",
  "Work in Progress": "bg-amber-50 text-amber-700",
  "Completed": "bg-emerald-50 text-emerald-700",
  "On Hold": "bg-stone-100 text-stone-700",
  "Cancelled": "bg-rose-50 text-rose-700",
};

export default function FieldDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("new"); // 'new' | 'reports'
  const [myReports, setMyReports] = useState([]);
  const [followUpTarget, setFollowUpTarget] = useState(null); // submission object
  const [timeline, setTimeline] = useState([]);

  const refreshReports = async () => {
    try {
      const { data } = await api.get("/field/my-reports");
      setMyReports(data);
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  useEffect(() => { refreshReports(); }, []);
  // Auto-refetch whenever the worker switches to the "My Reports" tab
  useEffect(() => {
    if (tab === "reports") refreshReports();
  }, [tab]);

  const openFollowUp = async (report) => {
    setFollowUpTarget(report);
    try {
      const { data } = await api.get(`/submissions/${report.id}/timeline`);
      setTimeline(data.visits || []);
    } catch (e) {
      setTimeline([]);
    }
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

      {followUpTarget ? (
        <FollowUpForm
          target={followUpTarget}
          timeline={timeline}
          onCancel={() => { setFollowUpTarget(null); setTimeline([]); }}
          onDone={() => { setFollowUpTarget(null); setTimeline([]); refreshReports(); setTab("reports"); }}
        />
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
            <div className="flex border-b border-stone-200">
              <TabBtn active={tab === "new"} onClick={() => setTab("new")} testId="field-tab-new" icon={PlusCircle}>New Submission</TabBtn>
              <TabBtn active={tab === "reports"} onClick={() => setTab("reports")} testId="field-tab-reports" icon={ListChecks}>My Reports ({myReports.length})</TabBtn>
            </div>

            {tab === "new" ? (
              <NewSubmissionForm onDone={() => { refreshReports(); setTab("reports"); }} />
            ) : (
              <MyReportsList reports={myReports} onRefresh={refreshReports} onFollowUp={openFollowUp} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children, testId, icon: Icon }) {
  return (
    <button onClick={onClick} data-testid={testId} className={`px-6 py-4 text-sm font-semibold border-b-2 inline-flex items-center gap-2 ${active ? "border-emerald-700 text-emerald-700" : "border-transparent text-stone-600 hover:text-stone-900"}`}>
      {Icon && <Icon className="w-4 h-4" />} {children}
    </button>
  );
}

function StatusPill({ status }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_COLOR[status] || "bg-stone-100 text-stone-700"}`}>
      {status}
    </span>
  );
}

function MyReportsList({ reports, onRefresh, onFollowUp }) {
  if (!reports.length) {
    return (
      <div className="p-16 text-center text-stone-500">
        <ListChecks className="w-10 h-10 mx-auto text-stone-300 mb-3" strokeWidth={1.5} />
        <div>No reports yet. Submit your first one!</div>
      </div>
    );
  }
  return (
    <div className="divide-y divide-stone-100">
      <div className="flex justify-between items-center px-6 py-3 bg-stone-50">
        <div className="text-xs uppercase tracking-widest font-semibold text-stone-500">Recent reports</div>
        <button onClick={onRefresh} data-testid="field-reports-refresh" className="text-xs text-stone-600 hover:text-emerald-700 inline-flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
      </div>
      {reports.map((r) => (
        <div key={r.id} data-testid={`field-report-${r.id}`} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-stone-50">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-display font-bold text-stone-900 truncate">{r.client_name}</div>
              <StatusPill status={r.latest_status} />
              <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {r.total_visits} visit{r.total_visits === 1 ? "" : "s"}
              </span>
            </div>
            <div className="text-sm text-stone-600 mt-1 truncate">
              {r.client_role && <span className="text-stone-900 font-semibold">{r.client_role}</span>}{r.client_role && " · "}{r.client_company || "—"} · {r.client_mobile}
            </div>
            {r.location && <div className="text-xs text-emerald-700 font-semibold mt-0.5">📍 {r.location}</div>}
            <div className="text-xs text-stone-500 mt-1 inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Last visit: {new Date(r.latest_visit_at).toLocaleString()}
            </div>
          </div>
          <button onClick={() => onFollowUp(r)} data-testid={`field-followup-btn-${r.id}`} className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 text-sm font-semibold inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap">
            <PlusCircle className="w-4 h-4" /> Add Follow-up
          </button>
        </div>
      ))}
    </div>
  );
}

function NewSubmissionForm({ onDone }) {
  const [form, setForm] = useState({
    client_name: "", client_company: "", client_mobile: "", client_email: "",
    client_role: "", client_role_other: "",
    location: "",
    site_address: "", notes: "", latitude: "", longitude: "", status: "Site Visited",
  });
  const [photos, setPhotos] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedClient, setSubmittedClient] = useState(null);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onPhoto = (idx) => (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setPhotos((arr) => arr.map((p, i) => (i === idx ? f : p)));
    setPreviews((arr) => arr.map((p, i) => (i === idx ? URL.createObjectURL(f) : p)));
  };
  const removePhoto = (idx) => () => {
    setPhotos((arr) => arr.map((p, i) => (i === idx ? null : p)));
    setPreviews((arr) => arr.map((p, i) => (i === idx ? null : p)));
  };
  const getGPS = () => {
    if (!navigator.geolocation) return toast.error("GPS not supported");
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })); toast.success("Location captured"); setGpsLoading(false); },
      (err) => { toast.error("Could not get location: " + err.message); setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      const effectiveRole = form.client_role === "Other"
        ? (form.client_role_other.trim() || "Other")
        : form.client_role;
      Object.entries(form).forEach(([k, v]) => {
        if (["client_role", "client_role_other"].includes(k)) return;
        fd.append(k, v);
      });
      fd.append("client_role", effectiveRole);
      photos.forEach((p, i) => { if (p) fd.append(`photo${i + 1}`, p); });
      const { data } = await api.post("/field/submit", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmittedClient({ client_name: form.client_name, client_mobile: form.client_mobile, status: form.status, location: form.location });
      setSubmitted(true);
      toast.success(`Visit #1 submitted (${data.photo_count} photo${data.photo_count === 1 ? "" : "s"}). HQ email being sent...`);
    } catch (err) {
      toast.error(formatError(err));
    } finally { setLoading(false); }
  };

  if (submitted) {
    const waLink = whatsappLink({ mobile: submittedClient?.client_mobile, client_name: submittedClient?.client_name, status: "initial", location: submittedClient?.location });
    const hasMobile = !!normalizeWhatsApp(submittedClient?.client_mobile);
    return (
      <div className="p-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" strokeWidth={1.5} />
        <h2 className="font-display text-2xl font-bold text-stone-900 mt-4">Visit #1 submitted!</h2>
        <p className="text-stone-600 mt-2">Your initial site report has been sent to HQ.</p>

        {hasMobile ? (
          <div className="mt-6 mx-auto max-w-lg bg-emerald-50 rounded-2xl border border-emerald-200 p-5 text-left">
            <div className="flex items-start gap-3">
              <span className="whatsapp-pulse w-11 h-11 flex-shrink-0 rounded-full bg-[#25D366] flex items-center justify-center">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </span>
              <div className="flex-1">
                <div className="font-semibold text-stone-900">Send a thank-you to {submittedClient.client_name}?</div>
                <p className="text-xs text-stone-600 mt-1">Tap below to open WhatsApp with a pre-written message from Maria Glass &amp; Plywood. The message will be sent from your phone.</p>
                <a href={waLink} target="_blank" rel="noreferrer" data-testid="field-wa-send-client" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white px-5 py-2.5 text-sm font-semibold">
                  <WhatsAppIcon className="w-4 h-4" /> Send WhatsApp to {submittedClient.client_name || "client"}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 mx-auto max-w-lg bg-amber-50 rounded-2xl border border-amber-200 p-4 text-left text-sm text-amber-900" data-testid="field-wa-unavailable">
            <strong>WhatsApp share unavailable.</strong> The client mobile number "{submittedClient?.client_mobile || "(empty)"}" wasn't a valid 10-digit Indian number. Please re-enter it in the next submission to enable one-tap WhatsApp.
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button onClick={() => { setForm({ client_name: "", client_company: "", client_mobile: "", client_email: "", client_role: "", client_role_other: "", location: "", site_address: "", notes: "", latitude: "", longitude: "", status: "Site Visited" }); setPhotos([null,null,null]); setPreviews([null,null,null]); setSubmitted(false); setSubmittedClient(null); }} data-testid="field-new-report" className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold">Submit another</button>
          <button onClick={onDone} className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">View my reports</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="p-6 md:p-10 space-y-7">
      <div>
        <div className="label-eyebrow">New Submission · Visit #1</div>
        <h1 className="font-display text-2xl font-bold text-stone-900 mt-2">Capture site details</h1>
        <p className="text-stone-600 text-sm mt-1">First visit to a new client. Subsequent visits use Follow-up.</p>
      </div>

      <Section title="Client Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Client Name *" testId="field-client-name" value={form.client_name} onChange={handle("client_name")} required />
          <RoleSelect
            value={form.client_role}
            onChange={handle("client_role")}
            otherValue={form.client_role_other}
            onOtherChange={handle("client_role_other")}
          />
          <Field label="Client Company" testId="field-client-company" value={form.client_company} onChange={handle("client_company")} />
          <Field label="Client Mobile *" testId="field-client-mobile" value={form.client_mobile} onChange={handle("client_mobile")} required />
          <Field label="Client Email" testId="field-client-email" type="email" value={form.client_email} onChange={handle("client_email")} />
        </div>
      </Section>

      <Section title="This Visit">
        <Field label="Site Address / Description" testId="field-site-address" value={form.site_address} onChange={handle("site_address")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <LocationSelect value={form.location} onChange={handle("location")} />
          <StatusSelect value={form.status} onChange={handle("status")} testId="field-status" />
        </div>
        <GpsRow form={form} setForm={setForm} gpsLoading={gpsLoading} getGPS={getGPS} required={false} />
        <PhotoGrid previews={previews} onPhoto={onPhoto} removePhoto={removePhoto} />
        <NotesField value={form.notes} onChange={handle("notes")} />
      </Section>

      <button data-testid="field-submit-btn" disabled={loading} className="btn-primary w-full rounded-full px-7 py-4 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {loading ? "Submitting..." : "Submit & Email HQ"}
      </button>
    </form>
  );
}

function FollowUpForm({ target, timeline, onCancel, onDone }) {
  const [form, setForm] = useState({ status: "Materials Delivered", notes: "", latitude: "", longitude: "" });
  const [photos, setPhotos] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { visit_number, status }

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onPhoto = (idx) => (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setPhotos((arr) => arr.map((p, i) => (i === idx ? f : p)));
    setPreviews((arr) => arr.map((p, i) => (i === idx ? URL.createObjectURL(f) : p)));
  };
  const removePhoto = (idx) => () => {
    setPhotos((arr) => arr.map((p, i) => (i === idx ? null : p)));
    setPreviews((arr) => arr.map((p, i) => (i === idx ? null : p)));
  };
  const getGPS = () => {
    if (!navigator.geolocation) return toast.error("GPS not supported");
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })); toast.success("Location captured"); setGpsLoading(false); },
      (err) => { toast.error("Could not get location: " + err.message); setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach((p, i) => { if (p) fd.append(`photo${i + 1}`, p); });
      const { data } = await api.post(`/field/follow-up/${target.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`Visit #${data.visit_number} submitted (${data.distance_from_original_m ?? "—"}m from original). HQ email being sent...`);
      setSuccess({ visit_number: data.visit_number, status: form.status, distance_m: data.distance_from_original_m });
    } catch (err) {
      toast.error(formatError(err));
    } finally { setLoading(false); }
  };

  if (success) {
    const waLink = whatsappLink({ mobile: target.client_mobile, client_name: target.client_name, status: success.status, location: target.location });
    const hasMobile = !!normalizeWhatsApp(target.client_mobile);
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-10 md:p-14 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" strokeWidth={1.5} />
          <h2 className="font-display text-2xl font-bold text-stone-900 mt-4">Visit #{success.visit_number} submitted!</h2>
          <p className="text-stone-600 mt-2">Status: <strong>{success.status}</strong>{success.distance_m != null && ` · ${success.distance_m}m from original site`}</p>

          {hasMobile && (
            <div className="mt-6 mx-auto max-w-lg bg-emerald-50 rounded-2xl border border-emerald-200 p-5 text-left">
              <div className="flex items-start gap-3">
                <span className="whatsapp-pulse w-11 h-11 flex-shrink-0 rounded-full bg-[#25D366] flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-stone-900">Update {target.client_name} on WhatsApp?</div>
                  <p className="text-xs text-stone-600 mt-1">Tap to open WhatsApp with a pre-written message about this status update. Sent from your phone.</p>
                  <a href={waLink} target="_blank" rel="noreferrer" data-testid="field-wa-send-followup" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white px-5 py-2.5 text-sm font-semibold">
                    <WhatsAppIcon className="w-4 h-4" /> Send WhatsApp to {target.client_name || "client"}
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button onClick={onDone} className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold">Done — back to my reports</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-10">
        <button onClick={onCancel} data-testid="field-followup-cancel" className="text-sm text-stone-500 hover:text-stone-800 mb-4">← Back to my reports</button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <div className="label-eyebrow">Follow-up Visit</div>
            <h1 className="font-display text-2xl font-bold text-stone-900 mt-1">{target.client_name}</h1>
            <div className="text-sm text-stone-600">{target.client_company || "—"} · {target.client_mobile}</div>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 rounded-full px-4 py-2 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" /> Must be within 300m of original site
          </div>
        </div>

        {timeline.length > 0 && (
          <div className="bg-stone-50 rounded-2xl p-4 mb-6">
            <div className="text-xs uppercase tracking-widest font-bold text-stone-500 mb-3">Previous visits</div>
            <div className="space-y-2">
              {timeline.map((v) => (
                <div key={v.id} className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-stone-900 w-12">#{v.visit_number}</span>
                  <StatusPill status={v.status} />
                  <span className="text-stone-600 truncate flex-1">{v.notes || "—"}</span>
                  <span className="text-xs text-stone-500">{new Date(v.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <StatusSelect value={form.status} onChange={handle("status")} testId="field-followup-status" />

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Current Location (GPS) *</label>
            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={getGPS} disabled={gpsLoading} data-testid="field-followup-gps-btn" className="rounded-xl border border-emerald-600 text-emerald-700 px-4 py-3 font-semibold inline-flex items-center justify-center gap-2 hover:bg-emerald-50 disabled:opacity-50">
                {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                {gpsLoading ? "Locating..." : "Auto-detect"}
              </button>
              <input data-testid="field-followup-latitude" value={form.latitude} onChange={handle("latitude")} required placeholder="Latitude" className="flex-1 rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none" />
              <input data-testid="field-followup-longitude" value={form.longitude} onChange={handle("longitude")} required placeholder="Longitude" className="flex-1 rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none" />
            </div>
            {target.geo?.latitude && (
              <p className="text-xs text-stone-500 mt-2">
                Original site: {target.geo.latitude}, {target.geo.longitude} ·{" "}
                <a href={`https://www.google.com/maps?q=${target.geo.latitude},${target.geo.longitude}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold">View on Maps</a>
              </p>
            )}
          </div>

          <PhotoGrid previews={previews} onPhoto={onPhoto} removePhoto={removePhoto} />
          <NotesField value={form.notes} onChange={handle("notes")} placeholder="What changed since the last visit? Materials delivered, work progress, issues..." />

          <button data-testid="field-followup-submit-btn" disabled={loading} className="btn-primary w-full rounded-full px-7 py-4 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {loading ? "Submitting..." : "Submit Follow-up & Email HQ"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="space-y-5">
      <legend className="font-display text-lg font-semibold text-stone-900 mb-2">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, testId, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">{label}</label>
      <input data-testid={testId} type={type} required={required} value={value} onChange={onChange} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none" />
    </div>
  );
}

function RoleSelect({ value, onChange, otherValue, onOtherChange }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Client Role</label>
      <select data-testid="field-client-role" value={value} onChange={onChange} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none bg-white">
        <option value="">— Select role —</option>
        {CLIENT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      {value === "Other" && (
        <input
          data-testid="field-client-role-other"
          value={otherValue || ""}
          onChange={onOtherChange}
          placeholder="Type role (e.g. Carpenter, Painter, Architect...)"
          maxLength={50}
          className="mt-2 w-full rounded-xl border border-emerald-400 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
        />
      )}
    </div>
  );
}

function StatusSelect({ value, onChange, testId }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Status</label>
      <select data-testid={testId} value={value} onChange={onChange} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none bg-white">
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

function LocationSelect({ value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Location</label>
      <select data-testid="field-location" value={value} onChange={onChange} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none bg-white">
        <option value="">— Select location —</option>
        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  );
}

function GpsRow({ form, setForm, gpsLoading, getGPS, required }) {
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Site Location (GPS){required ? " *" : ""}</label>
      <div className="mt-2 flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={getGPS} disabled={gpsLoading} data-testid="field-gps-btn" className="rounded-xl border border-emerald-600 text-emerald-700 px-4 py-3 font-semibold inline-flex items-center justify-center gap-2 hover:bg-emerald-50 disabled:opacity-50">
          {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {gpsLoading ? "Locating..." : "Auto-detect"}
        </button>
        <input data-testid="field-latitude" value={form.latitude} onChange={handle("latitude")} required={required} placeholder="Latitude" className="flex-1 rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none" />
        <input data-testid="field-longitude" value={form.longitude} onChange={handle("longitude")} required={required} placeholder="Longitude" className="flex-1 rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none" />
      </div>
    </div>
  );
}

function PhotoGrid({ previews, onPhoto, removePhoto }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Construction Photos (up to 3)</label>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="relative">
            {previews[idx] ? (
              <div className="relative group rounded-xl overflow-hidden border border-stone-200">
                <img src={previews[idx]} alt={`preview ${idx + 1}`} className="w-full h-40 object-cover" />
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Photo {idx + 1}</span>
                <button type="button" onClick={removePhoto(idx)} data-testid={`field-photo-remove-${idx + 1}`} className="absolute top-2 right-2 bg-white/95 hover:bg-white text-rose-600 rounded-full px-2 py-0.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
              </div>
            ) : (
              <label data-testid={`field-photo-label-${idx + 1}`} className="cursor-pointer rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/40 px-4 py-8 flex flex-col items-center justify-center text-stone-600 hover:text-emerald-700 h-40 transition-colors">
                <Camera className="w-6 h-6 mb-1.5" strokeWidth={1.5} />
                <span className="text-sm font-semibold">Photo {idx + 1}</span>
                <span className="text-[11px] text-stone-400 mt-0.5">Tap to capture</span>
                <input data-testid={`field-photo-input-${idx + 1}`} type="file" accept="image/*" capture="environment" onChange={onPhoto(idx)} className="hidden" />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesField({ value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Notes</label>
      <textarea data-testid="field-notes" rows={3} value={value} onChange={onChange} placeholder={placeholder || "Any observations, materials needed, follow-ups..."} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none" />
    </div>
  );
}