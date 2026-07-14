import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RemindersView from "@/components/RemindersView";
import { LogOut, Plus, Trash2, Loader2, Users, ClipboardList, MapPin, FileSpreadsheet, FileText, History, X, AlertTriangle, Calendar, Search } from "lucide-react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const LOGO = "https://customer-assets.emergentagent.com/job_c473f9e5-814c-45ab-92b6-facfece4a340/artifacts/kabbdtfj_maria_logo.jpg";

const STATUS_COLOR = {
  "Site Visited": "bg-blue-50 text-blue-700",
  "Materials Delivered": "bg-violet-50 text-violet-700",
  "Work in Progress": "bg-amber-50 text-amber-700",
  "Completed": "bg-emerald-50 text-emerald-700",
  "On Hold": "bg-stone-100 text-stone-700",
  "Cancelled": "bg-rose-50 text-rose-700",
};
const STATUS_FILTERS = ["All", "Site Visited", "Materials Delivered", "Work in Progress", "Completed", "On Hold", "Cancelled"];
const LOCATION_FILTERS = ["All locations", "Nagercoil", "Monday Market", "Valliyoor", "Thisayanvilai"];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("submissions");
  const [workers, setWorkers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: "", email: "", password: "", role: "field_worker" });

  const refresh = async () => {
    setLoading(true);
    try {
      const [w, s, r] = await Promise.all([
        api.get("/admin/workers"),
        api.get("/admin/submissions"),
        api.get("/admin/rejected-attempts"),
      ]);
      setWorkers(w.data);
      setSubmissions(s.data);
      setRejected(r.data);
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const exportSubmissions = async (format) => {
    try {
      const res = await api.get(`/admin/submissions/export?format=${format}`, { responseType: "blob" });
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `maria_submissions_${stamp}.${format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${submissions.length} report(s) as ${format.toUpperCase()}`);
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  const createWorker = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/admin/workers", newWorker);
      toast.success("Worker account created");
      setNewWorker({ name: "", email: "", password: "", role: "field_worker" });
      refresh();
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setCreating(false);
    }
  };

  const removeWorker = async (id) => {
    if (!window.confirm("Delete this worker?")) return;
    try {
      await api.delete(`/admin/workers/${id}`);
      toast.success("Worker deleted");
      refresh();
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  return (
    <div data-testid="admin-dashboard" className="min-h-[calc(100vh-5rem)] bg-stone-100">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="MG" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-display font-bold text-stone-900">Admin Dashboard</div>
              <div className="text-xs text-stone-500">{user?.email}</div>
            </div>
          </div>
          <button onClick={() => { logout(); nav("/"); }} data-testid="admin-logout" className="text-sm font-semibold text-stone-700 hover:text-emerald-700 inline-flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <StatCard icon={ClipboardList} label="Total Reports" value={submissions.length} />
          <StatCard icon={Users} label="Field Workers" value={workers.length} />
          <StatCard icon={MapPin} label="With GPS" value={submissions.filter((s) => s.geo?.latitude).length} />
          <StatCard icon={AlertTriangle} label="Rejected (out-of-range)" value={rejected.length} accent={rejected.length > 0 ? "rose" : "stone"} />
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200">
            <div className="flex flex-wrap">
              <TabBtn active={tab === "submissions"} onClick={() => setTab("submissions")} testId="admin-tab-submissions">Submissions</TabBtn>
              <TabBtn active={tab === "reminders"} onClick={() => setTab("reminders")} testId="admin-tab-reminders">Reminders</TabBtn>
              <TabBtn active={tab === "workers"} onClick={() => setTab("workers")} testId="admin-tab-workers">Field Workers</TabBtn>
              <TabBtn active={tab === "rejected"} onClick={() => setTab("rejected")} testId="admin-tab-rejected">
                Rejected{rejected.length > 0 && <span className="ml-1.5 inline-block bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{rejected.length}</span>}
              </TabBtn>
            </div>
            {tab === "submissions" && submissions.length > 0 && (
              <div className="flex gap-2 px-5 py-3 sm:py-0">
                <button
                  onClick={() => exportSubmissions("excel")}
                  data-testid="admin-export-excel"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-600 text-emerald-700 px-4 py-2 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export Excel
                </button>
                <button
                  onClick={() => exportSubmissions("pdf")}
                  data-testid="admin-export-pdf"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 text-stone-700 px-4 py-2 text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  <FileText className="w-4 h-4" /> Export PDF
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-16 text-center text-stone-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : tab === "submissions" ? (
            <SubmissionsTable items={submissions} />
          ) : tab === "reminders" ? (
            <RemindersView testIdPrefix="admin-reminders" />
          ) : tab === "workers" ? (
            <WorkersPanel
              workers={workers}
              onRemove={removeWorker}
              newWorker={newWorker}
              setNewWorker={setNewWorker}
              creating={creating}
              onCreate={createWorker}
            />
          ) : (
            <RejectedAttemptsTable items={rejected} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = "emerald" }) {
  const accentMap = {
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    stone: "bg-stone-100 text-stone-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${accentMap[accent]}`}>
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest font-semibold text-stone-500">{label}</div>
        <div className="font-display text-2xl font-bold text-stone-900 mt-1">{value}</div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children, testId }) {
  return (
    <button onClick={onClick} data-testid={testId} className={`px-6 py-4 text-sm font-semibold border-b-2 ${active ? "border-emerald-700 text-emerald-700" : "border-transparent text-stone-600 hover:text-stone-900"}`}>
      {children}
    </button>
  );
}

function SubmissionsTable({ items }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [locFilter, setLocFilter] = useState("All locations");
  const [search, setSearch] = useState("");
  const [recency, setRecency] = useState("all"); // 'all' | '7d' | '30d'
  const [timelineSub, setTimelineSub] = useState(null);

  if (!items.length) return <div className="p-16 text-center text-stone-500">No submissions yet.</div>;
  const q = search.trim().toLowerCase();
  const now = Date.now();
  const recencyMs = recency === "7d" ? 7 * 86400000 : recency === "30d" ? 30 * 86400000 : null;
  const visible = items.filter((s) => {
    const st = s.status || "Site Visited";
    if (statusFilter !== "All" && st !== statusFilter) return false;
    if (locFilter !== "All locations" && (s.location || "") !== locFilter) return false;
    if (recencyMs != null) {
      const t = s.created_at ? new Date(s.created_at).getTime() : 0;
      if (!t || now - t > recencyMs) return false;
    }
    if (q) {
      const hay = [
        s.client_name, s.client_mobile, s.client_company, s.client_email,
        s.client_role, s.worker_name, s.location, s.site_address,
      ].map((x) => (x || "").toString().toLowerCase()).join(" | ");
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <>
      <div className="px-5 py-4 border-b border-stone-100 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            data-testid="admin-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, mobile, company, email, role, worker, address…"
            className="w-full rounded-full border border-stone-300 pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              data-testid="admin-search-clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 rounded-full p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] uppercase tracking-widest font-bold text-stone-500 mr-1">Recently contacted:</span>
          {[
            { k: "all", label: "Any time" },
            { k: "7d", label: "Last 7 days" },
            { k: "30d", label: "Last 30 days" },
          ].map((r) => (
            <button
              key={r.k}
              onClick={() => setRecency(r.k)}
              data-testid={`admin-recency-${r.k}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${recency === r.k ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              data-testid={`admin-status-filter-${s.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${statusFilter === s ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {LOCATION_FILTERS.map((l) => (
            <button
              key={l}
              onClick={() => setLocFilter(l)}
              data-testid={`admin-loc-filter-${l.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${locFilter === l ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
            >
              📍 {l}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        {visible.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm" data-testid="admin-no-results">
            No submissions match your search / filters.
          </div>
        ) : (
        <table className="w-full text-sm table-fixed">
          <thead className="bg-stone-50">
            <tr className="text-left text-xs uppercase tracking-wider text-stone-600">
              <th className="px-2 py-2.5">When</th>
              <th className="px-2 py-2.5">Next Appt</th>
              <th className="px-2 py-2.5">Status</th>
              <th className="px-2 py-2.5">Client</th>
              <th className="px-2 py-2.5">Location</th>
              <th className="px-2 py-2.5">Mobile</th>
              <th className="px-2 py-2.5">Worker</th>
              <th className="px-2 py-2.5 text-center">Map</th>
              <th className="px-2 py-2.5 text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => {
              const status = s.status || "Site Visited";
              const visitN = s.visit_number || 1;
              const d = new Date(s.created_at);
              const dateShort = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
              const timeShort = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
              const nextAppt = s.next_appointment_date
                ? new Date(s.next_appointment_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                : null;
              return (
                <tr key={s.id} data-testid={`submission-row-${s.id}`} className="border-t border-stone-100 hover:bg-stone-50 align-middle">
                  <td className="px-2 py-2 text-stone-600 text-xs truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        title={s.email_sent === true ? "Email sent" : s.email_sent === false ? "Email failed - check SMTP config" : "Email queued (pending)"}
                        className={`inline-block w-2 h-2 rounded-full shrink-0 ${s.email_sent === true ? "bg-emerald-500" : s.email_sent === false ? "bg-rose-500" : "bg-stone-400"}`}
                      />
                      <span className="truncate">{dateShort} {timeShort}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 truncate">
                    {nextAppt ? (
                      <span
                        title={`Next appointment on ${s.next_appointment_date}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold whitespace-nowrap"
                      >
                        <Calendar className="w-3 h-3" /> {nextAppt}
                      </span>
                    ) : <span className="text-stone-300 text-xs">—</span>}
                  </td>
                  <td className="px-2 py-2 truncate">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mr-1 ${visitN === 1 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>#{visitN}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[status] || "bg-stone-100 text-stone-700"}`}>{status}</span>
                  </td>
                  <td className="px-2 py-2 truncate">
                    <div className="font-semibold text-stone-900 text-sm truncate" title={s.client_name}>{s.client_name}</div>
                    {s.client_role && <div className="text-xs text-emerald-700 font-semibold truncate">{s.client_role}</div>}
                  </td>
                  <td className="px-2 py-2 truncate">
                    {s.location ? <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 text-xs font-semibold truncate max-w-full" title={s.location}>📍 {s.location}</span> : <span className="text-stone-400 text-xs">—</span>}
                  </td>
                  <td className="px-2 py-2 text-stone-700 text-sm truncate" title={s.client_mobile}>{s.client_mobile}</td>
                  <td className="px-2 py-2 text-stone-700 text-sm truncate" title={s.worker_name}>{s.worker_name}</td>
                  <td className="px-2 py-2 text-center">
                    {s.geo?.latitude ? (
                      <a
                        href={`https://www.google.com/maps?q=${s.geo.latitude},${s.geo.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Open on Google Maps"
                        className="text-emerald-700 hover:text-emerald-800 inline-flex items-center justify-center"
                      >
                        <MapPin className="w-5 h-5" />
                      </a>
                    ) : <span className="text-stone-300 text-xs">—</span>}
                  </td>
                  <td className="px-2 py-2 text-right">
                    <button onClick={() => setTimelineSub(s)} data-testid={`admin-view-timeline-${s.id}`} className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold inline-flex items-center gap-1">
                      <History className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>

      {timelineSub && <TimelineModal sub={timelineSub} onClose={() => setTimelineSub(null)} />}
    </>
  );
}

function TimelineModal({ sub, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/submissions/${sub.id}/timeline`);
        setData(res.data);
      } catch (e) {
        toast.error(formatError(e));
      } finally { setLoading(false); }
    })();
  }, [sub.id]);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div data-testid="admin-timeline-modal" className="bg-white rounded-3xl border border-stone-200 w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-20 bg-white border-b border-stone-200 px-7 py-5 flex justify-between items-start rounded-t-3xl">
          <div>
            <div className="label-eyebrow">Client Timeline</div>
            <h2 className="font-display text-2xl font-bold text-stone-900 mt-1">{sub.client_name}</h2>
            <div className="text-sm text-stone-600">
              {sub.client_role && <span className="text-emerald-700 font-semibold">{sub.client_role}</span>}
              {sub.client_role && " · "}
              {sub.client_company || "—"} · {sub.client_mobile}
            </div>
            {sub.location && <div className="text-xs text-stone-500 mt-1">📍 {sub.location}</div>}
          </div>
          <button onClick={onClose} data-testid="admin-timeline-close" className="text-stone-500 hover:text-stone-900"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-7">
          {loading ? (
            <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-stone-400 mx-auto" /></div>
          ) : !data?.visits?.length ? (
            <div className="text-center text-stone-500 py-10">No visits found.</div>
          ) : (
            <div className="relative pl-7">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-stone-200" />
              {data.visits.map((v) => {
                const status = v.status || "Site Visited";
                return (
                  <div key={v.id} className="relative mb-7" data-testid={`admin-visit-${v.id}`}>
                    <div className="absolute -left-7 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600" />
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-stone-900 font-display">Visit #{v.visit_number}</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_COLOR[status] || "bg-stone-100 text-stone-700"}`}>{status}</span>
                      <span className="text-xs text-stone-500">{new Date(v.created_at).toLocaleString()}</span>
                      {v.distance_from_original_m != null && (
                        <span className="text-xs text-stone-500">· {v.distance_from_original_m}m from origin</span>
                      )}
                    </div>

                    <div className="mt-2 rounded-xl bg-stone-50 border border-stone-200 p-3">
                      <div className="text-[11px] uppercase tracking-widest font-semibold text-stone-500 mb-1">Field Worker Response</div>
                      <div className="text-sm text-stone-800 whitespace-pre-wrap">{v.notes || <em className="text-stone-400">No notes from worker</em>}</div>
                      {v.next_appointment_date && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                          <Calendar className="w-3 h-3" /> Next appointment: {new Date(v.next_appointment_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-stone-500 mt-2">
                        <span>By {v.worker_name}</span>
                        <span>·</span>
                        <span>{v.photo_count || 0} photo{v.photo_count === 1 ? "" : "s"}</span>
                        {v.geo?.latitude && (
                          <>
                            <span>·</span>
                            <a href={`https://www.google.com/maps?q=${v.geo.latitude},${v.geo.longitude}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold">Map</a>
                          </>
                        )}
                      </div>
                    </div>

                    <NotesReadonlyBlock notes={v.admin_notes || []} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotesReadonlyBlock({ notes }) {
  if (!notes.length) return null;
  return (
    <div className="mt-2 rounded-xl bg-emerald-50/60 border border-emerald-200 p-3">
      <div className="text-[11px] uppercase tracking-widest font-semibold text-emerald-800 mb-2">Notes ({notes.length})</div>
      <ul className="space-y-2">
        {notes.map((n) => (
          <li key={n.id} data-testid={`admin-note-${n.id}`} className="bg-white rounded-lg border border-emerald-100 px-3 py-2 text-sm text-stone-800">
            {n.status && (
              <span className={`inline-block mb-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_COLOR[n.status] || "bg-stone-100 text-stone-700"}`}>
                {n.status}
              </span>
            )}
            <div className="whitespace-pre-wrap break-words">{n.text}</div>
            <div className="mt-1.5 text-[11px] text-stone-500">
              — {n.author_name}{n.author_role ? ` (${n.author_role === "admin" ? "Admin" : "Worker"})` : ""} · {new Date(n.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkersPanel({ workers, onRemove, newWorker, setNewWorker, creating, onCreate }) {
  return (
    <div className="p-6 md:p-8">
      <form onSubmit={onCreate} className="bg-stone-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-8">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Name</label>
          <input data-testid="admin-new-worker-name" required value={newWorker.name} onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Email</label>
          <input data-testid="admin-new-worker-email" type="email" required value={newWorker.email} onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Password</label>
          <input data-testid="admin-new-worker-password" type="text" required value={newWorker.password} onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-600">Role</label>
          <select
            data-testid="admin-new-worker-role"
            value={newWorker.role}
            onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="field_worker">Field Worker</option>
            <option value="shop_worker">Shop Worker</option>
          </select>
        </div>
        <button data-testid="admin-create-worker-btn" disabled={creating} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create User
        </button>
      </form>

      {workers.length === 0 ? (
        <div className="text-center text-stone-500 py-10">No workers yet — create the first one above.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr className="text-left text-xs uppercase tracking-widest text-stone-600">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="px-5 py-4 font-semibold text-stone-900">{w.name}</td>
                  <td className="px-5 py-4 text-stone-700">{w.email}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${w.role === "shop_worker" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {w.role === "shop_worker" ? "Shop Worker" : "Field Worker"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-stone-500">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => onRemove(w.id)} data-testid={`admin-delete-worker-${w.id}`} className="text-rose-600 hover:text-rose-700 text-sm font-semibold inline-flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RejectedAttemptsTable({ items }) {
  if (!items.length) {
    return (
      <div className="p-16 text-center text-stone-500">
        <AlertTriangle className="w-10 h-10 mx-auto text-stone-300 mb-3" strokeWidth={1.5} />
        <div>No rejected attempts. Every follow-up so far was within range. ✅</div>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <div className="px-5 py-3 bg-rose-50 border-b border-rose-100 text-xs text-rose-800">
        <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
        These follow-up attempts were <strong>blocked</strong> because the worker was outside the allowed radius (or didn't share GPS).
      </div>
      <table className="w-full text-sm">
        <thead className="bg-stone-50">
          <tr className="text-left text-xs uppercase tracking-widest text-stone-600">
            <th className="px-5 py-4">When</th>
            <th className="px-5 py-4">Worker</th>
            <th className="px-5 py-4">Client</th>
            <th className="px-5 py-4">Reason</th>
            <th className="px-5 py-4">Distance</th>
            <th className="px-5 py-4">Attempted location</th>
            <th className="px-5 py-4">Original site</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} data-testid={`rejected-row-${r.id}`} className="border-t border-stone-100 hover:bg-stone-50">
              <td className="px-5 py-4 text-stone-600 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
              <td className="px-5 py-4">
                <div className="font-semibold text-stone-900">{r.worker_name}</div>
                <div className="text-xs text-stone-500">{r.worker_email}</div>
              </td>
              <td className="px-5 py-4">
                <div className="font-semibold text-stone-900">{r.client_name}</div>
                <div className="text-xs text-stone-500">{r.client_mobile}</div>
              </td>
              <td className="px-5 py-4">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${r.reason === "missing_gps" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>
                  {r.reason === "missing_gps" ? "No GPS" : "Out of range"}
                </span>
              </td>
              <td className="px-5 py-4 text-stone-700 font-semibold whitespace-nowrap">
                {r.distance_m != null ? `${r.distance_m}m` : "—"}
                <span className="text-stone-400 font-normal text-xs"> / {r.radius_m}m</span>
              </td>
              <td className="px-5 py-4">
                {r.attempted_geo?.latitude ? (
                  <a href={`https://www.google.com/maps?q=${r.attempted_geo.latitude},${r.attempted_geo.longitude}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold">Map →</a>
                ) : <span className="text-stone-400">—</span>}
              </td>
              <td className="px-5 py-4">
                {r.original_geo?.latitude ? (
                  <a href={`https://www.google.com/maps?q=${r.original_geo.latitude},${r.original_geo.longitude}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold">Map →</a>
                ) : <span className="text-stone-400">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

