import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, ClipboardList, MapPin, History, X, Plus, Trash2, RefreshCw } from "lucide-react";
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
const NOTE_STATUSES = ["Site Visited", "Materials Delivered", "Work in Progress", "Completed", "On Hold", "Cancelled"];

export default function ShopDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const s = await api.get("/admin/submissions");
      setSubmissions(s.data);
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div data-testid="shop-dashboard" className="min-h-[calc(100vh-5rem)] bg-stone-100">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="MG" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-display font-bold text-stone-900">Shop Worker Portal</div>
              <div className="text-xs text-stone-500">{user?.email}</div>
            </div>
          </div>
          <button onClick={() => { logout(); nav("/"); }} data-testid="shop-logout" className="text-sm font-semibold text-stone-700 hover:text-emerald-700 inline-flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <StatCard icon={ClipboardList} label="Total Leads" value={submissions.length} />
          <StatCard icon={MapPin} label="With GPS" value={submissions.filter((s) => s.geo?.latitude).length} />
          <StatCard icon={History} label="Follow-up Visits" value={submissions.filter((s) => (s.visit_number || 1) > 1).length} />
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3">
            <div className="text-xs uppercase tracking-widest font-semibold text-stone-500">All Client Leads</div>
            <button onClick={refresh} data-testid="shop-refresh" className="text-xs text-stone-600 hover:text-emerald-700 inline-flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-16 text-center text-stone-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : (
            <SubmissionsTable items={submissions} onDataChanged={refresh} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-700">
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest font-semibold text-stone-500">{label}</div>
        <div className="font-display text-2xl font-bold text-stone-900 mt-1">{value}</div>
      </div>
    </div>
  );
}

function SubmissionsTable({ items, onDataChanged }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [locFilter, setLocFilter] = useState("All locations");
  const [timelineSub, setTimelineSub] = useState(null);

  if (!items.length) return <div className="p-16 text-center text-stone-500">No submissions yet.</div>;
  const visible = items.filter((s) => {
    const st = s.status || "Site Visited";
    if (statusFilter !== "All" && st !== statusFilter) return false;
    if (locFilter !== "All locations" && (s.location || "") !== locFilter) return false;
    return true;
  });

  return (
    <>
      <div className="px-5 py-4 border-b border-stone-100 space-y-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              data-testid={`shop-status-filter-${s.toLowerCase().replace(/\s+/g, '-')}`}
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${locFilter === l ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
            >
              📍 {l}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-stone-50">
            <tr className="text-left text-xs uppercase tracking-wider text-stone-600">
              <th className="px-2 py-2.5">When</th>
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
              return (
                <tr key={s.id} data-testid={`shop-submission-row-${s.id}`} className="border-t border-stone-100 hover:bg-stone-50 align-middle">
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
                  <td className="px-2 py-2 text-stone-700 text-sm truncate">{s.client_mobile}</td>
                  <td className="px-2 py-2 text-stone-700 text-sm truncate">{s.worker_name}</td>
                  <td className="px-2 py-2 text-center">
                    {s.geo?.latitude ? (
                      <a href={`https://www.google.com/maps?q=${s.geo.latitude},${s.geo.longitude}`} target="_blank" rel="noreferrer" title="Open on Google Maps" className="text-emerald-700 hover:text-emerald-800 inline-flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </a>
                    ) : <span className="text-stone-300 text-xs">—</span>}
                  </td>
                  <td className="px-2 py-2 text-right">
                    <button onClick={() => setTimelineSub(s)} data-testid={`shop-view-timeline-${s.id}`} className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold inline-flex items-center gap-1">
                      <History className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {timelineSub && <TimelineModal sub={timelineSub} onClose={() => setTimelineSub(null)} onDataChanged={onDataChanged} />}
    </>
  );
}

function TimelineModal({ sub, onClose, onDataChanged }) {
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

  const handleNoteAdded = (visitId, admin_notes, newStatus) => {
    setData((d) => d ? {
      ...d,
      visits: d.visits.map((v) => {
        if (v.id !== visitId) return v;
        return newStatus ? { ...v, admin_notes, status: newStatus } : { ...v, admin_notes };
      }),
    } : d);
    if (newStatus && typeof onDataChanged === "function") onDataChanged();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div data-testid="shop-timeline-modal" className="bg-white rounded-3xl border border-stone-200 w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
          <button onClick={onClose} data-testid="shop-timeline-close" className="text-stone-500 hover:text-stone-900"><X className="w-5 h-5" /></button>
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
                  <div key={v.id} className="relative mb-7" data-testid={`shop-visit-${v.id}`}>
                    <div className="absolute -left-7 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600" />
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-stone-900 font-display">Visit #{v.visit_number}</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_COLOR[status] || "bg-stone-100 text-stone-700"}`}>{status}</span>
                      <span className="text-xs text-stone-500">{new Date(v.created_at).toLocaleString()}</span>
                    </div>
                    <div className="mt-2 rounded-xl bg-stone-50 border border-stone-200 p-3">
                      <div className="text-[11px] uppercase tracking-widest font-semibold text-stone-500 mb-1">Field Worker Response</div>
                      <div className="text-sm text-stone-800 whitespace-pre-wrap">{v.notes || <em className="text-stone-400">No notes from worker</em>}</div>
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
                    <NotesBlock visit={v} onNoteAdded={handleNoteAdded} />
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

function NotesBlock({ visit, onNoteAdded }) {
  const [text, setText] = useState("");
  const [noteStatus, setNoteStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const notes = visit.admin_notes || [];

  const addNote = async () => {
    const t = text.trim();
    if (!t) return;
    setSaving(true);
    try {
      const res = await api.post(`/visit/${visit.id}/note`, { text: t, status: noteStatus || null });
      onNoteAdded(visit.id, res.data.admin_notes, res.data.status_updated ? res.data.status : null);
      setText("");
      setNoteStatus("");
      toast.success(res.data.status_updated ? `Note added - status set to ${res.data.status}` : "Note added");
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await api.delete(`/visit/${visit.id}/note/${noteId}`);
      onNoteAdded(visit.id, res.data.admin_notes);
      toast.success("Note deleted");
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  return (
    <div className="mt-2 rounded-xl bg-emerald-50/60 border border-emerald-200 p-3">
      <div className="text-[11px] uppercase tracking-widest font-semibold text-emerald-800 mb-2">Notes & Status Updates</div>
      {notes.length === 0 ? (
        <div className="text-xs text-stone-500 italic mb-2">No notes yet.</div>
      ) : (
        <ul className="space-y-2 mb-3">
          {notes.map((n) => (
            <li key={n.id} data-testid={`shop-note-${n.id}`} className="bg-white rounded-lg border border-emerald-100 px-3 py-2 text-sm text-stone-800">
              {n.status && (
                <span className={`inline-block mb-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_COLOR[n.status] || "bg-stone-100 text-stone-700"}`}>
                  {n.status}
                </span>
              )}
              <div className="whitespace-pre-wrap break-words">{n.text}</div>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mt-1.5 text-[11px] text-stone-500">
                <span className="truncate">— {n.author_name}{n.author_role ? ` (${n.author_role === "admin" ? "Admin" : n.author_role === "shop_worker" ? "Shop" : "Worker"})` : ""} · {new Date(n.created_at).toLocaleString()}</span>
                <button
                  onClick={() => deleteNote(n.id)}
                  data-testid={`shop-note-delete-${n.id}`}
                  className="text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1 shrink-0"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2">
        <div>
          <select
            value={noteStatus}
            onChange={(e) => setNoteStatus(e.target.value)}
            data-testid={`shop-note-status-${visit.id}`}
            className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="">Update status (optional)</option>
            {NOTE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {noteStatus && <div className="text-[10px] text-emerald-700 mt-1 leading-tight">Will set visit status to <strong>{noteStatus}</strong></div>}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Add a note for this visit..."
          data-testid={`shop-note-input-${visit.id}`}
          className="rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600 bg-white resize-y w-full"
        />
      </div>
      <div className="mt-2 flex justify-end">
        <button
          onClick={addNote}
          disabled={saving || !text.trim()}
          data-testid={`shop-note-add-${visit.id}`}
          className="btn-primary rounded-full px-4 py-2 text-xs font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Add Note
        </button>
      </div>
    </div>
  );
}
