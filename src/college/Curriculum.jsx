import { useMemo, useState } from "react";
import {
  FiDownload, FiSearch, FiBookOpen, FiLayers, FiAward,
  FiClock, FiUsers, FiGrid, FiX, FiFileText, FiSliders
} from "react-icons/fi";

/* ---------------------------- Static curriculum data ---------------------------- */
const DATA = [
  {
    program: "MBBS",
    semester: "Sem 1",
    credits: 24,
    ltp: { L: 11, T: 2, P: 11 },
    hoursPerWeek: 24,
    core: ["Anatomy", "Physiology", "Biochemistry"],
    electives: ["Humanities in Medicine"],
    competencies: [
      "Describe gross & histological structure of organs",
      "Record blood pressure, pulse & respiratory rate",
      "Correlate biochemical pathways with disease",
    ],
    methods: ["Dissection", "Histology SDL", "Small Group Discussions", "Seminars"],
    assessment: { IA: "20%", Univ: "80%", Practical: "50 marks (OSPE/Practical)" },
    postings: [
      { area: "Anatomy Dissection Hall", weeks: 4, remarks: "Upper limb + Thorax" },
      { area: "Physiology Lab", weeks: 3, remarks: "Hematology & Spirometry" },
      { area: "Biochemistry Lab", weeks: 3, remarks: "Qualitative tests" },
    ],
  },
  {
    program: "MBBS",
    semester: "Sem 3",
    credits: 22,
    ltp: { L: 10, T: 2, P: 10 },
    hoursPerWeek: 22,
    core: ["Pathology", "Microbiology", "Pharmacology"],
    electives: ["Bioethics"],
    competencies: [
      "Explain mechanisms of cell injury & inflammation",
      "Interpret Gram stain & culture reports",
      "Write rational prescriptions and dose calculations",
    ],
    methods: ["Practical Demonstrations", "SDL", "Case-based Learning", "Journal Clubs"],
    assessment: { IA: "20%", Univ: "80%", Practical: "40–50 marks (OSPE/Viva)" },
    postings: [
      { area: "Pathology Lab", weeks: 4, remarks: "Hematology & Histopath" },
      { area: "Microbiology Lab", weeks: 3, remarks: "Bacteriology & Sterilization" },
      { area: "Pharmacology", weeks: 3, remarks: "Prescription & ADR exercise" },
    ],
  },
  {
    program: "MBBS",
    semester: "Sem 5",
    credits: 20,
    ltp: { L: 8, T: 1, P: 11 },
    hoursPerWeek: 20,
    core: ["ENT", "Ophthalmology"],
    electives: ["Public Health Elective"],
    competencies: [
      "Perform otoscopic & anterior rhinoscopic exam",
      "Measure visual acuity & basic slit-lamp findings",
    ],
    methods: ["Clinics", "Skills Lab", "Simulated Patients", "Seminars"],
    assessment: { IA: "20%", Univ: "80%", Practical: "OSCE + Viva" },
    postings: [
      { area: "ENT OPD & OT", weeks: 4, remarks: "Endoscopy & Minor OT" },
      { area: "Ophthalmology OPD", weeks: 4, remarks: "Refraction & Fundus" },
    ],
  },
  {
    program: "B.Sc Nursing",
    semester: "Sem 2",
    credits: 20,
    ltp: { L: 8, T: 0, P: 12 },
    hoursPerWeek: 20,
    core: ["Fundamentals of Nursing", "Nutrition", "Psychology"],
    electives: ["Communication Skills"],
    competencies: [
      "Demonstrate basic nursing procedures",
      "Document nursing process and care plans",
    ],
    methods: ["Clinical Postings", "Skill Lab", "Demonstrations"],
    assessment: { IA: "25%", Univ: "75%", Practical: "Clinical logbook + Viva" },
    postings: [
      { area: "Medical Ward", weeks: 4, remarks: "Bedside nursing" },
      { area: "Surgical Ward", weeks: 3, remarks: "Pre/Post-op care" },
      { area: "Nutrition Lab", weeks: 1, remarks: "Diet planning" },
    ],
  },
  {
    program: "Allied Health (BPT)",
    semester: "Sem 1",
    credits: 18,
    ltp: { L: 7, T: 0, P: 11 },
    hoursPerWeek: 18,
    core: ["Anatomy", "Physiology", "Biomechanics"],
    electives: [],
    competencies: [
      "Explain joint kinematics and gait parameters",
      "Demonstrate posture assessment",
    ],
    methods: ["Practical Demonstrations", "Skill Stations", "SDL"],
    assessment: { IA: "20%", Univ: "80%", Practical: "OSPE" },
    postings: [
      { area: "PT Lab", weeks: 4, remarks: "ROM & Strength testing" },
      { area: "Orthopedics OPD", weeks: 2, remarks: "Observation" },
    ],
  },
];

/* --------------------------------- Helpers --------------------------------- */
const cls = (...a) => a.filter(Boolean).join(" ");
const uniq = (arr) => Array.from(new Set(arr));

/* =============================== Main Component ============================== */
export default function Curriculum() {
  const [prog, setProg] = useState("All");
  const [sem, setSem] = useState("All");
  const [q, setQ] = useState("");
  const [openIdx, setOpenIdx] = useState(null); // details modal
  const [showFilters, setShowFilters] = useState(false); // mobile filter toggle

  // options
  const programs = useMemo(() => ["All", ...uniq(DATA.map(d => d.program))], []);
  const semesters = useMemo(() => {
    const pool = DATA.filter(d => prog === "All" || d.program === prog).map(d => d.semester);
    return ["All", ...uniq(pool)];
  }, [prog]);

  // filtered rows
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return DATA.filter(r =>
      (prog === "All" || r.program === prog) &&
      (sem === "All" || r.semester === sem) &&
      (!needle ||
        [r.program, r.semester, r.core.join(" "), (r.electives || []).join(" "), (r.competencies || []).join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [prog, sem, q]);

  // summaries
  const summary = useMemo(() => {
    const totalCredits = rows.reduce((a, r) => a + r.credits, 0);
    const avgHrs = rows.length ? Math.round(rows.reduce((a, r) => a + (r.hoursPerWeek || 0), 0) / rows.length) : 0;
    return { totalCredits, avgHrs, count: rows.length };
  }, [rows]);

  const onExport = (type) => {
    console.log("Export", type, rows);
    alert(`${type.toUpperCase()} export is a placeholder in this demo.`);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Curriculum</h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(v => !v)}
            className="sm:hidden px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 flex items-center justify-center"
            aria-expanded={showFilters}
          >
            <FiSliders className="mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => onExport("csv")} className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50">
              Export CSV
            </button>
            <button onClick={() => onExport("pdf")} className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 flex items-center justify-center">
              <FiDownload className="mr-2" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .card-in { animation: cardIn .28s ease both; }
        @keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .fade { animation: fade .25s ease both; }
        @keyframes fade { from { opacity:0 } to { opacity:1 } }
      `}</style>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Summary icon={<FiBookOpen className="h-5 w-5" />} label="Curriculum Blocks" value={summary.count} />
        <Summary icon={<FiAward className="h-5 w-5" />} label="Total Credits" value={summary.totalCredits} />
        <Summary icon={<FiClock className="h-5 w-5" />} label="Avg. Hours / Week" value={`${summary.avgHrs}`} />
      </div>

      {/* Filters */}
      <div className={cls("card-in bg-white border rounded-xl", showFilters ? "block" : "hidden sm:block")}>
        <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Program:</span>
            <select
              className="border rounded-lg px-3 py-2 text-sm w-full"
              value={prog}
              onChange={e => { setProg(e.target.value); setSem("All"); }}
            >
              {programs.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Semester:</span>
            <select
              className="border rounded-lg px-3 py-2 text-sm w-full"
              value={sem}
              onChange={e => setSem(e.target.value)}
            >
              {semesters.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="relative lg:col-span-2">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full"
              placeholder="Search subjects, competencies, electives…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="card-in bg-white border rounded-xl">
        <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
          {rows.map((r, i) => (
            <div
              key={`${r.program}-${r.semester}`}
              className="border rounded-xl bg-white p-4 hover:shadow-sm transition card-in"
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="text-[11px] sm:text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700">
                  {r.program}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500">{r.semester}</div>
              </div>

              <div className="mt-2 text-lg font-semibold">Core Subjects</div>

              <div className="mt-2 flex flex-wrap gap-2">
                {r.core.map(s => <Chip key={s} text={s} />)}
              </div>

              {!!(r.electives?.length) && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Electives</div>
                  <div className="flex flex-wrap gap-2">
                    {r.electives.map(s => <Chip key={s} text={s} tone="amber" />)}
                  </div>
                </div>
              )}

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <Stat mini icon={<FiAward />} label="Credits" value={r.credits} />
                <Stat mini icon={<FiClock />} label="Hrs/Week" value={r.hoursPerWeek} />
                <Stat mini icon={<FiLayers />} label="L-T-P" value={`${r.ltp.L}-${r.ltp.T}-${r.ltp.P}`} />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm flex items-center justify-center"
                  onClick={() => setOpenIdx(i)}
                >
                  <FiFileText className="mr-1" /> View Details
                </button>
                <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm">
                  Download Scheme
                </button>
              </div>
            </div>
          ))}
        </div>

        {!rows.length && (
          <div className="px-4 pb-6 text-center text-gray-500">No results</div>
        )}
      </div>

      {/* Details Modal */}
      <DetailsModal block={openIdx !== null ? rows[openIdx] : null} onClose={() => setOpenIdx(null)} />
    </div>
  );
}

/* ------------------------------ Subcomponents ------------------------------ */
function Summary({ icon, label, value }) {
  return (
    <div className="card-in bg-white border rounded-xl p-3 sm:p-4 flex items-center gap-3">
      <div className="p-3 rounded-lg bg-blue-50 text-blue-700">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg sm:text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, mini = false }) {
  return (
    <div className={cls("rounded-lg border bg-gray-50", mini ? "p-2" : "p-3")}>
      <div className={cls("flex items-center gap-2 text-gray-600", mini ? "text-[11px]" : "text-xs")}>
        {icon} {label}
      </div>
      <div className={cls("font-semibold text-gray-900", mini ? "text-sm mt-0.5" : "text-base mt-1")}>
        {value}
      </div>
    </div>
  );
}

function Chip({ text, tone = "blue" }) {
  const map = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span className={cls("inline-flex items-center px-2 py-1 rounded-md border text-xs", map[tone])}>
      {text}
    </span>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="p-3 rounded-lg border bg-white">
      <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function DetailsModal({ block, onClose }) {
  if (!block) return null;
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div
        className="
          absolute left-80 -translate-x-1/2 top-4 sm:top-10
          w-[calc(100%-1.5rem)] sm:w-[calc(100%-4rem)] lg:w-[min(100%-8rem,980px)]
          max-h-[88vh] sm:max-h-[86vh] rounded-xl border bg-white shadow-2xl card-in
          flex flex-col overflow-hidden
        "
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b flex items-center justify-between">
          <div>
            <div className="text-xs sm:text-sm text-gray-500">{block.program} · {block.semester}</div>
            <div className="text-base sm:text-lg font-semibold">Curriculum Details</div>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-50" onClick={onClose} aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 overflow-y-auto">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <Section title="Core & Electives" icon={<FiBookOpen />}>
              <div className="flex flex-wrap gap-2">
                {block.core.map(s => <Chip key={s} text={s} />)}
                {(block.electives || []).map(s => <Chip key={s} text={s} tone="amber" />)}
              </div>
            </Section>

            <Section title="Competencies & Outcomes" icon={<FiUsers />}>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {block.competencies.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </Section>

            <Section title="Teaching–Learning Methods" icon={<FiLayers />}>
              <div className="flex flex-wrap gap-2">
                {block.methods.map(m => <Chip key={m} text={m} tone="gray" />)}
              </div>
            </Section>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Section title="Quick Info" icon={<FiGrid />}>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Stat icon={<FiAward />} label="Credits" value={block.credits} />
                <Stat icon={<FiClock />} label="Hrs/Week" value={block.hoursPerWeek} />
                <Stat icon={<FiLayers />} label="L-T-P" value={`${block.ltp.L}-${block.ltp.T}-${block.ltp.P}`} />
              </div>
            </Section>

            <Section title="Assessment" icon={<FiFileText />}>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Internal Assessment: <span className="font-medium">{block.assessment.IA}</span></div>
                <div>University Exam: <span className="font-medium">{block.assessment.Univ}</span></div>
                {block.assessment.Practical && (
                  <div>Practical/Clinical: <span className="font-medium">{block.assessment.Practical}</span></div>
                )}
              </div>
            </Section>

            <Section title="Postings / Rotations" icon={<FiUsers />}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[420px]">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-1 pr-2">Area</th>
                      <th className="py-1 pr-2">Weeks</th>
                      <th className="py-1">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.postings.map((p, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2 pr-2">{p.area}</td>
                        <td className="py-2 pr-2">{p.weeks}</td>
                        <td className="py-2">{p.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
          <button className="w-full sm:w-auto px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm" onClick={onClose}>Close</button>
          <button className="w-full sm:w-auto px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Download (PDF)</button>
        </div>
      </div>
    </div>
  );
}
