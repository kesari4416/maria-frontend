import { useEffect, useState } from "react";
import { Loader2, Calendar, MapPin, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";

const STATUS_COLOR = {
  "Site Visited": "bg-blue-50 text-blue-700",
  "Materials Delivered": "bg-violet-50 text-violet-700",
  "Work in Progress": "bg-amber-50 text-amber-700",
  "Completed": "bg-emerald-50 text-emerald-700",
  "On Hold": "bg-stone-100 text-stone-700",
  "Cancelled": "bg-rose-50 text-rose-700",
};

const TABS = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "day_after", label: "Day After" },
];

export default function RemindersView({ testIdPrefix = "reminders" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reminders");
      setData(res.data);
    } catch (e) {
      toast.error(formatError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  if (loading && !data) {
    return <div className="p-16 text-center text-stone-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  }

  const items = data?.[tab] || [];
  const dateForTab = data?.dates?.[tab];

  return (
    <div data-testid={testIdPrefix} className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="label-eyebrow text-emerald-700 mb-1">Reminder Dates</div>
          <h2 className="font-display text-2xl font-bold text-stone-900">Upcoming client appointments</h2>
          <p className="text-sm text-stone-500 mt-1">Grouped by day so you can prepare ahead.</p>
        </div>
        <button onClick={refresh} data-testid={`${testIdPrefix}-refresh`} className="text-xs text-stone-600 hover:text-emerald-700 inline-flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => {
          const count = data?.counts?.[t.key] ?? 0;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              data-testid={`${testIdPrefix}-tab-${t.key}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition-colors ${active ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {t.label}
              <span className={`inline-block min-w-[1.4rem] text-center px-1.5 py-0.5 rounded-full text-[11px] font-bold ${active ? "bg-white/25 text-white" : count > 0 ? "bg-emerald-600 text-white" : "bg-stone-300 text-stone-600"}`}>{count}</span>
              {data?.dates?.[t.key] && (
                <span className="text-[10px] font-normal opacity-75">
                  {new Date(data.dates[t.key]).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="text-center text-stone-500 py-14 border border-dashed border-stone-200 rounded-2xl">
          <Calendar className="w-8 h-8 mx-auto text-stone-300 mb-2" />
          <div className="font-semibold text-stone-700">No appointments {tab === "today" ? "today" : tab === "tomorrow" ? "tomorrow" : "the day after tomorrow"} ({dateForTab})</div>
          <div className="text-xs text-stone-500 mt-1">Field workers can add &quot;Next Appointment&quot; dates when submitting.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => {
            const status = s.status || "Site Visited";
            return (
              <div key={s.id} data-testid={`${testIdPrefix}-card-${s.id}`} className="rounded-2xl border border-stone-200 bg-white p-5 hover:border-emerald-400 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[status] || "bg-stone-100 text-stone-700"}`}>{status}</span>
                  {s.visit_number > 1 && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">Visit #{s.visit_number}</span>
                  )}
                </div>

                <div className="font-display font-bold text-stone-900 text-lg leading-tight">{s.client_name}</div>
                {s.client_role && <div className="text-xs text-emerald-700 font-semibold mt-0.5">{s.client_role}</div>}
                {s.client_company && <div className="text-xs text-stone-500 mt-0.5">{s.client_company}</div>}

                <div className="mt-3 space-y-1.5 text-sm text-stone-700">
                  {s.client_mobile && (
                    <a href={`tel:${(s.client_mobile || "").replace(/\D/g, "")}`} className="inline-flex items-center gap-2 hover:text-emerald-700">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> {s.client_mobile}
                    </a>
                  )}
                  {s.location && (
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {s.location}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Worker: <span className="font-semibold text-stone-800">{s.worker_name}</span></span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                    <Calendar className="w-3 h-3" /> {new Date(s.next_appointment_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </div>

                {s.geo?.latitude && (
                  <a
                    href={`https://www.google.com/maps?q=${s.geo.latitude},${s.geo.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    data-testid={`${testIdPrefix}-map-${s.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-xs font-semibold"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Open site on Maps
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
