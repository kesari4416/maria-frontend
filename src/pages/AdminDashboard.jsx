import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, Loader2, Users, ClipboardList, MapPin, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const LOGO = "https://customer-assets.emergentagent.com/job_c473f9e5-814c-45ab-92b6-facfece4a340/artifacts/kabbdtfj_maria_logo.jpg";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("submissions");
  const [workers, setWorkers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: "", email: "", password: "" });

  const refresh = async () => {
    setLoading(true);
    try {
      const [w, s] = await Promise.all([api.get("/admin/workers"), api.get("/admin/submissions")]);
      setWorkers(w.data);
      setSubmissions(s.data);
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
      setNewWorker({ name: "", email: "", password: "" });
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard icon={ClipboardList} label="Total Reports" value={submissions.length} />
          <StatCard icon={Users} label="Field Workers" value={workers.length} />
          <StatCard icon={MapPin} label="With GPS" value={submissions.filter((s) => s.geo?.latitude).length} />
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200">
            <div className="flex">
              <TabBtn active={tab === "submissions"} onClick={() => setTab("submissions")} testId="admin-tab-submissions">Submissions</TabBtn>
              <TabBtn active={tab === "workers"} onClick={() => setTab("workers")} testId="admin-tab-workers">Field Workers</TabBtn>
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
          ) : (
            <WorkersPanel
              workers={workers}
              onRemove={removeWorker}
              newWorker={newWorker}
              setNewWorker={setNewWorker}
              creating={creating}
              onCreate={createWorker}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-emerald-700" strokeWidth={1.5} />
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
  if (!items.length) return <div className="p-16 text-center text-stone-500">No submissions yet.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-stone-50">
          <tr className="text-left text-xs uppercase tracking-widest text-stone-600">
            <th className="px-5 py-4">When</th>
            <th className="px-5 py-4">Client</th>
            <th className="px-5 py-4">Mobile</th>
            <th className="px-5 py-4">Worker</th>
            <th className="px-5 py-4">Site</th>
            <th className="px-5 py-4">GPS</th>
            <th className="px-5 py-4">Email</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id} data-testid={`submission-row-${s.id}`} className="border-t border-stone-100 hover:bg-stone-50">
              <td className="px-5 py-4 text-stone-600 whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</td>
              <td className="px-5 py-4">
                <div className="font-semibold text-stone-900">{s.client_name}</div>
                <div className="text-xs text-stone-500">{s.client_company || "—"}</div>
              </td>
              <td className="px-5 py-4 text-stone-700">{s.client_mobile}</td>
              <td className="px-5 py-4 text-stone-700">{s.worker_name}</td>
              <td className="px-5 py-4 text-stone-700 max-w-xs truncate" title={s.site_address}>{s.site_address || "—"}</td>
              <td className="px-5 py-4">
                {s.geo?.latitude ? (
                  <a href={`https://www.google.com/maps?q=${s.geo.latitude},${s.geo.longitude}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold">Map →</a>
                ) : "—"}
              </td>
              <td className="px-5 py-4">
                {s.email_sent ? <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Sent</span> : <span className="inline-block px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">Failed</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkersPanel({ workers, onRemove, newWorker, setNewWorker, creating, onCreate }) {
  return (
    <div className="p-6 md:p-8">
      <form onSubmit={onCreate} className="bg-stone-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8">
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
        <button data-testid="admin-create-worker-btn" disabled={creating} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Worker
        </button>
      </form>

      {workers.length === 0 ? (
        <div className="text-center text-stone-500 py-10">No field workers yet — create the first one above.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr className="text-left text-xs uppercase tracking-widest text-stone-600">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="px-5 py-4 font-semibold text-stone-900">{w.name}</td>
                  <td className="px-5 py-4 text-stone-700">{w.email}</td>
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
