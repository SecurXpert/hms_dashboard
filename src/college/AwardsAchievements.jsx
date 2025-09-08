import { useMemo, useState } from "react";
import {
  FiCalendar, FiAward, FiUsers, FiFilter, FiSearch, FiMapPin,
  FiExternalLink, FiX, FiChevronRight
} from "react-icons/fi";

/* -------------------------- Static Awards / Achievements -------------------------- */
const AWARDS = [
  {
    id: "a1",
    year: 2025,
    category: "Institution",
    title: "State Best Teaching Hospital",
    team: "College & Attached Tertiary Care Hospital",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1600&auto=format&fit=crop",
    location: "Madhya Pradesh",
    highlights: [
      "OPD > 6,000/day with integrated EMR",
      "NABH & NABL accreditations retained",
      "Patient-safety metrics ranked #1 in state",
    ],
    blurb:
      "Recognized by the State Health Ministry for outstanding clinical training, patient safety and quality processes. Skill lab rotations aligned with CBME were integrated into ward postings with excellent learning outcomes.",
    link: "https://example.edu/press/state-teaching-hospital-2025",
  },
  {
    id: "a2",
    year: 2025,
    category: "Research",
    title: "ICMR Multi-centre Grant — Antimicrobial Stewardship",
    team: "Microbiology • Pharmacology • General Medicine",
    image: "https://images.unsplash.com/photo-1581594549595-35f6edc3a2f7?q=80&w=1600&auto=format&fit=crop",
    location: "Pan-India (4 partner sites)",
    highlights: [
      "₹1.8 Cr grant over 3 years",
      "ICU cohort with real-time antibiograms",
      "Open-source AMS dashboard toolkit",
    ],
    blurb:
      "Grant awarded to develop and evaluate a stewardship bundle using point-of-care audit with feedback, integrated antibiogram visualizations and clinical decision support.",
    link: "https://example.edu/research/icmr-ams-2025",
  },
  {
    id: "a3",
    year: 2024,
    category: "Faculty",
    title: "Research Excellence — Community Medicine",
    team: "Department of Community Medicine",
    image: "https://images.unsplash.com/photo-1584985599830-5a6f1a3b91b3?q=80&w=1600&auto=format&fit=crop",
    location: "New Delhi",
    highlights: ["20+ Scopus papers (2023–24)", "Urban slum vaccination drive model", "Policy inputs to National Health Programme"],
    blurb:
      "Awarded by a national public health association for field epidemiology, implementation research and evidence-to-policy translation.",
    link: "https://example.edu/awards/community-research-2024",
  },
  {
    id: "a4",
    year: 2024,
    category: "Innovation",
    title: "Innovation in Simulation-Based Learning",
    team: "Central Skills & Simulation Lab",
    image: "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?q=80&w=1600&auto=format&fit=crop",
    location: "Bengaluru",
    highlights: ["OSCE blueprint mapped to CBME", "Low-cost task trainers built in-house", "Interprofessional drills (MBBS + Nursing)"],
    blurb:
      "Recognized at a national conclave for low-cost task trainers and simulation cases aligned to competency-based medical education.",
    link: "https://example.edu/innovation/simlab-2024",
  },
  {
    id: "a5",
    year: 2024,
    category: "Student",
    title: "All-India Rank 2 — MBBS Quiz (Physiology)",
    team: "MBBS Batch 2023 (Sem 2)",
    image: "https://images.unsplash.com/photo-1576765607924-b3d05d3b3f81?q=80&w=1600&auto=format&fit=crop",
    location: "AIIMS Jodhpur",
    highlights: ["Aarav Gupta • Ishita Rao", "Rapid fire physiology & data interpretation", "Faculty mentor: Dr. Arvind Rao"],
    blurb:
      "Second place nationally in a high-stakes quiz focused on neurophysiology, CVS and respiratory problem-solving.",
    link: "https://example.edu/students/mbbs-quiz-2024",
  },
  {
    id: "a6",
    year: 2023,
    category: "Institution",
    title: "NIRF — Top 50 (Medical Colleges)",
    team: "Institutional Ranking Cell",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop",
    location: "India",
    highlights: ["Rise across 3 cycles", "Research & Graduation Outcomes improved", "Inclusive outreach programs scaled"],
    blurb:
      "Entered the Top-50 band in NIRF Medical with sustained growth in research output, citations and student diversity.",
    link: "https://example.edu/rankings/nirf-2023",
  },
  {
    id: "a7",
    year: 2023,
    category: "Sports",
    title: "Inter-Medics Sports Meet — Overall Champions",
    team: "UG & PG mixed contingent",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop",
    location: "Nagpur",
    highlights: ["Gold in athletics & badminton", "Med-cricket league champions", "Women’s relay set new meet record"],
    blurb:
      "Overall championship secured with cross-disciplinary participation and strong coaching support.",
    link: "https://example.edu/students/sports-champs-2023",
  },
  {
    id: "a8",
    year: 2022,
    category: "Faculty",
    title: "Clinician Teacher of the Year",
    team: "Dr. Kavita Sharma — Anatomy",
    image: "https://images.unsplash.com/photo-1559750965-1f6738f6f34c?q=80&w=1600&auto=format&fit=crop",
    location: "Mumbai",
    highlights: ["Flipped classrooms in dissection", "Peer-reviewed histology atlas", "Mentored 3 PG dissertations"],
    blurb:
      "Honoured for innovation in dissection-room pedagogy and sustained mentorship of undergraduate and postgraduate learners.",
    link: "https://example.edu/faculty/teacher-year-2022",
  },
  {
    id: "a9",
    year: 2022,
    category: "Community",
    title: "COVID Service Commendation",
    team: "Hospitals • Nursing • Community Medicine",
    image: "https://images.unsplash.com/photo-1600959907703-125ba1374b56?q=80&w=1600&auto=format&fit=crop",
    location: "District Administration",
    highlights: ["5 screening camps/day", "Oxygen triage shared statewide", "Tele-follow-up system deployed"],
    blurb:
      "Commended for high-impact community service and robust triage innovations during the pandemic waves.",
    link: "https://example.edu/community/covid-commendation-2022",
  },
];

/* ------------------------------------ Helpers ----------------------------------- */
const cls = (...a) => a.filter(Boolean).join(" ");
const unique = (a) => Array.from(new Set(a));
const CATEGORIES = ["All", "Institution", "Faculty", "Student", "Research", "Innovation", "Sports", "Community"];

/* ================================== Component ================================== */
export default function AwardsAchievements() {
  const [year, setYear] = useState("All");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);

  const years = useMemo(
    () => ["All", ...unique(AWARDS.map((a) => a.year)).sort((a, b) => b - a)],
    []
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return AWARDS.filter(
      (a) =>
        (year === "All" || a.year === Number(year)) &&
        (cat === "All" || a.category === cat) &&
        (!needle ||
          `${a.title} ${a.team} ${a.location} ${a.highlights.join(" ")}`
            .toLowerCase()
            .includes(needle))
    ).sort((a, b) => b.year - a.year);
  }, [year, cat, q]);

  const summary = useMemo(() => {
    const total = rows.length;
    const faculty = rows.filter((r) => r.category === "Faculty").length;
    const students = rows.filter((r) => r.category === "Student").length;
    return { total, faculty, students };
  }, [rows]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Awards & Achievements</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1">
              <FiCalendar className="text-gray-500" />
              <select
                className="border rounded-lg px-3 py-2 text-sm w-full"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <FiFilter className="text-gray-500" />
              <select
                className="border rounded-lg px-3 py-2 text-sm w-full"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full sm:w-72"
              placeholder="Search title, team, place…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .card-in { animation: cardIn .28s ease both; }
        @keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .img-zoom { transition: transform .35s ease; }
        .img-zoom:hover { transform: scale(1.03); }
      `}</style>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Summary icon={<FiAward className="h-5 w-5" />} label="Total Recognitions" value={summary.total} />
        <Summary icon={<FiUsers className="h-5 w-5" />} label="Faculty Awards" value={summary.faculty} />
        <Summary icon={<FiUsers className="h-5 w-5" />} label="Student Awards" value={summary.students} />
      </div>

      {/* Cards */}
      <div className="card-in bg-white border rounded-xl">
        <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
          {rows.map((a, i) => (
            <article
              key={a.id}
              className="border rounded-xl overflow-hidden bg-white hover:shadow-sm transition card-in"
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <div className="relative">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={a.image}
                    alt={`${a.title} — ${a.team}`}
                    className="w-full h-full object-cover img-zoom"
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge tone="indigo">{a.year}</Badge>
                  <Badge tone={badgeTone(a.category)}>{a.category}</Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{a.team}</p>
                <div className="mt-2 text-[12px] text-gray-500 flex items-center gap-2">
                  <FiMapPin /> {a.location}
                </div>

                <ul className="mt-3 text-sm text-gray-700 space-y-1 list-disc list-inside">
                  {a.highlights.slice(0, 3).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setOpenId(a.id)}
                    className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm inline-flex items-center justify-center"
                  >
                    View Details <FiChevronRight className="ml-1" />
                  </button>
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm inline-flex items-center justify-center"
                  >
                    Official Link <FiExternalLink className="ml-1" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!rows.length && <div className="px-4 pb-6 text-center text-gray-500">No awards found.</div>}
      </div>

      {/* Modal */}
      <DetailsModal
        item={rows.find((x) => x.id === openId) || AWARDS.find((x) => x.id === openId)}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}

/* --------------------------------- Subcomponents -------------------------------- */
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

function Badge({ children, tone = "slate" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`px-2 py-0.5 border rounded-md text-[11px] ${tones[tone]}`}>{children}</span>
  );
}

function DetailsModal({ item, onClose }) {
  if (!item) return null;
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
            <div className="text-xs sm:text-sm text-gray-500">
              {item.category} · {item.year}
            </div>
            <div className="text-base sm:text-lg font-semibold">{item.title}</div>
            <div className="text-sm text-gray-600">{item.team}</div>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-50" onClick={onClose} aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto">
          <div className="w-full aspect-video bg-gray-100">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">About this recognition</div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.blurb}</p>
              </section>

              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Key Highlights</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {item.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Quick Info</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex items-center gap-2"><FiMapPin className="text-gray-500" /> {item.location}</div>
                  <div className="flex items-center gap-2"><FiCalendar className="text-gray-500" /> {item.year}</div>
                </div>
              </section>

              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Links</div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-sm text-blue-700 hover:underline"
                >
                  Official announcement <FiExternalLink className="ml-1" />
                </a>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
          <button className="w-full sm:w-auto px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm" onClick={onClose}>
            Close
          </button>
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm text-center"
          >
            Visit Official Page
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Utilities ---------------------------------- */
function badgeTone(cat) {
  switch (cat) {
    case "Institution": return "blue";
    case "Faculty": return "emerald";
    case "Student": return "rose";
    case "Research": return "indigo";
    case "Innovation": return "amber";
    case "Sports": return "emerald";
    case "Community": return "blue";
    default: return "slate";
  }
}
