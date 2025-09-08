import { useMemo, useState } from "react";
import {
  FiBook, FiSearch, FiExternalLink, FiFilter, FiTag, FiGlobe, FiDownload,
  FiPlayCircle, FiClock, FiFileText, FiLink, FiX, FiChevronRight, FiSliders
} from "react-icons/fi";

/* ---------------------------------- Static data ---------------------------------- */
const RESOURCES = [
  {
    id: "r1",
    type: "eBook",
    title: "Guyton & Hall Textbook of Medical Physiology",
    year: 2023,
    access: "Campus + Remote",
    subject: "Physiology",
    publisher: "Elsevier",
    image: "https://images.unsplash.com/photo-1585432959449-b1c7b1c2d7d1?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/guyton-physiology",
    desc: "Comprehensive coverage of systems physiology with clinical correlations.",
    tags: ["MBBS", "Core", "Reference"],
    size: "PDF, 65 MB",
    featured: true,
  },
  {
    id: "r2",
    type: "eBook",
    title: "Robbins & Cotran Pathologic Basis of Disease",
    year: 2022,
    access: "Campus",
    subject: "Pathology",
    publisher: "Elsevier",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/robbins-pathology",
    desc: "Gold-standard text for general & systemic pathology with photomicrographs.",
    tags: ["MBBS", "PG", "Atlas"],
    size: "PDF, 120 MB",
    featured: true,
  },
  {
    id: "r3",
    type: "Journal",
    title: "New England Journal of Medicine (NEJM)",
    year: 2025,
    access: "Campus",
    subject: "Multidisciplinary",
    publisher: "Massachusetts Medical Society",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/nejm",
    desc: "High-impact clinical research, reviews and case reports.",
    tags: ["High Impact", "Clinical"],
    featured: true,
  },
  {
    id: "r4",
    type: "Journal",
    title: "The Lancet",
    year: 2025,
    access: "Campus",
    subject: "Multidisciplinary",
    publisher: "Elsevier",
    image: "https://images.unsplash.com/photo-1582719478250-04e1a4f1f931?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/lancet",
    desc: "Leading global health and clinical medicine journal.",
    tags: ["Global Health", "RCTs"],
  },
  {
    id: "r5",
    type: "Journal",
    title: "Indian Journal of Community Medicine",
    year: 2024,
    access: "Open Access",
    subject: "Community Medicine",
    publisher: "Indian Association of Preventive & Social Medicine",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/ijcm",
    desc: "Public health, epidemiology and implementation research from India.",
    tags: ["Open", "Policy"],
  },
  {
    id: "r6",
    type: "eBook",
    title: "Harrison’s Principles of Internal Medicine",
    year: 2022,
    access: "Campus",
    subject: "Medicine",
    publisher: "McGraw Hill",
    image: "https://images.unsplash.com/photo-1584985589253-854f2b0f7b42?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/harrisons",
    desc: "Authoritative reference for internal medicine across specialties.",
    tags: ["PG", "Reference"],
    size: "HTML + PDF",
  },
  {
    id: "r7",
    type: "Video",
    title: "Clinical Skills: Cardiovascular Examination",
    year: 2024,
    access: "Remote",
    subject: "Clinical Skills",
    publisher: "Skill & Simulation Lab",
    image: "https://images.unsplash.com/photo-1615486364134-5dec46bb9d7e?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/skills-cvs",
    desc: "Step-by-step OSCE-aligned cardiovascular exam with checklists.",
    tags: ["OSCE", "MBBS"],
    duration: "14m 30s",
  },
  {
    id: "r8",
    type: "Video",
    title: "Anatomy Dissection: Upper Limb",
    year: 2023,
    access: "Campus + Remote",
    subject: "Anatomy",
    publisher: "Department of Anatomy",
    image: "https://images.unsplash.com/photo-1559757175-08c8d4d3c6b9?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/dissection-upper-limb",
    desc: "Layer-by-layer dissection demonstration with surface anatomy.",
    tags: ["MBBS", "Lab"],
    duration: "22m 10s",
  },
  {
    id: "r9",
    type: "Dataset",
    title: "Antibiogram (ICU) — Quarterly Summary",
    year: 2025,
    access: "Campus",
    subject: "Microbiology",
    publisher: "Hospital Infection Control Committee",
    image: "https://images.unsplash.com/photo-1581093458791-9d09c5a6c1d5?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/antibiogram-icu",
    desc: "Aggregated ICU culture & sensitivity trends for stewardship.",
    tags: ["AMS", "Quality"],
    size: "CSV + Dashboard",
    featured: true,
  },
  {
    id: "r10",
    type: "eBook",
    title: "Goodman & Gilman: The Pharmacological Basis of Therapeutics",
    year: 2021,
    access: "Campus + Remote",
    subject: "Pharmacology",
    publisher: "McGraw Hill",
    image: "https://images.unsplash.com/photo-1582719478248-fbaf0c6b7f72?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/goodman-gilman",
    desc: "Mechanisms of drug action and clinical pharmacology.",
    tags: ["PG", "Therapeutics"],
    size: "PDF, 85 MB",
  },
  {
    id: "r11",
    type: "Journal",
    title: "BMJ (British Medical Journal)",
    year: 2025,
    access: "Campus",
    subject: "Multidisciplinary",
    publisher: "BMJ Publishing Group",
    image: "https://images.unsplash.com/photo-1523246206026-6299f2b271c1?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/bmj",
    desc: "Clinical practice, guidelines, research and commentary.",
    tags: ["Guidelines", "Evidence"],
  },
  {
    id: "r12",
    type: "Video",
    title: "Emergency Medicine: Triage & ACLS Pearls",
    year: 2024,
    access: "Remote",
    subject: "Emergency Medicine",
    publisher: "Emergency Dept. Education",
    image: "https://images.unsplash.com/photo-1576765607924-b3d05d3b3f81?q=80&w=1600&auto=format&fit=crop",
    link: "https://example.edu/library/ed-acls",
    desc: "Case-based triage scenarios and ACLS algorithm walkthrough.",
    tags: ["Simulation", "OSCE"],
    duration: "18m 02s",
  },
];

/* ------------------------------------ Helpers ----------------------------------- */
const cls = (...a) => a.filter(Boolean).join(" ");
const uniq = (arr) => Array.from(new Set(arr));

/* ================================== Component ================================== */
export default function DigitalLibrary() {
  const [type, setType] = useState("All");
  const [subject, setSubject] = useState("All");
  const [access, setAccess] = useState("All");
  const [year, setYear] = useState("All");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [saved, setSaved] = useState({}); // {id: true}

  const types = useMemo(() => ["All", ...uniq(RESOURCES.map((r) => r.type))], []);
  const subjects = useMemo(() => ["All", ...uniq(RESOURCES.map((r) => r.subject))], []);
  const accessOpts = useMemo(() => ["All", ...uniq(RESOURCES.map((r) => r.access))], []);
  const years = useMemo(() => ["All", ...uniq(RESOURCES.map((r) => r.year)).sort((a, b) => b - a)], []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = RESOURCES.filter((r) =>
      (type === "All" || r.type === type) &&
      (subject === "All" || r.subject === subject) &&
      (access === "All" || r.access === access) &&
      (year === "All" || r.year === Number(year)) &&
      (!needle ||
        `${r.title} ${r.subject} ${r.publisher} ${(r.tags || []).join(" ")}`.toLowerCase().includes(needle))
    );
    if (sortBy === "Newest") rows = rows.sort((a, b) => b.year - a.year);
    if (sortBy === "A–Z") rows = rows.sort((a, b) => a.title.localeCompare(b.title));
    return rows;
  }, [type, subject, access, year, q, sortBy]);

  const featured = useMemo(() => filtered.filter((r) => r.featured), [filtered]);

  const copyLink = (link) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link).then(() => alert("Link copied!"));
    } else {
      prompt("Copy this URL", link);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Digital Library</h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <button
            className="sm:hidden px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center justify-center"
            onClick={() => setShowFilters(v => !v)}
          >
            <FiSliders className="mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full sm:w-72"
              placeholder="Search title, subject, publisher…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Inline animations */}
      <style>{`
        .card-in { animation: cardIn .28s ease both; }
        @keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .fade { animation: fade .25s ease both; }
        @keyframes fade { from { opacity:0 } to { opacity:1 } }
        .img-zoom { transition: transform .35s ease; }
        .img-zoom:hover { transform: scale(1.03); }
      `}</style>

      {/* Featured carousel (scrollable) */}
      {!!featured.length && (
        <section className="card-in bg-white border rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-700 flex items-center">
              <FiBook className="mr-2" /> Featured this term
            </div>
            <div className="text-[12px] text-gray-500">Swipe/scroll →</div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-full">
              {featured.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setOpenId(r.id)}
                  className="w-80 shrink-0 rounded-xl overflow-hidden border bg-white hover:shadow-sm transition card-in text-left"
                  style={{ animationDelay: `${i * 20}ms` }}
                  title="Open details"
                >
                  <div className="relative">
                    <div className="h-40 w-full overflow-hidden">
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover img-zoom" loading="lazy" />
                    </div>
                    <span className="absolute top-2 left-2 text-[11px] px-2 py-0.5 rounded-md border bg-blue-50 text-blue-700">
                      {r.type}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold line-clamp-2">{r.title}</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">{r.publisher}</div>
                    <div className="mt-2 flex items-center gap-2 text-[12px]">
                      <AccessBadge access={r.access} />
                      <span className="text-gray-500">{r.year}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <div className={cls("card-in bg-white border rounded-xl", showFilters ? "block" : "hidden sm:block")}>
        <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <Dropdown label="Type" value={type} onChange={setType} options={types} icon={<FiFilter className="text-gray-500" />} />
          <Dropdown label="Subject" value={subject} onChange={setSubject} options={subjects} icon={<FiTag className="text-gray-500" />} />
          <Dropdown label="Access" value={access} onChange={setAccess} options={accessOpts} icon={<FiGlobe className="text-gray-500" />} />
          <Dropdown label="Year" value={year} onChange={setYear} options={years} />
          <Dropdown label="Sort" value={sortBy} onChange={setSortBy} options={["Newest", "A–Z"]} />
        </div>
      </div>

      {/* Cards grid */}
      <div className="card-in bg-white border rounded-xl">
        <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((r, i) => (
            <article
              key={r.id}
              className="border rounded-xl overflow-hidden bg-white hover:shadow-sm transition card-in"
              style={{ animationDelay: `${i * 20}ms` }}
            >
              <div className="relative">
                <div className="aspect-video overflow-hidden">
                  <img src={r.image} alt={r.title} className="w-full h-full object-cover img-zoom" loading="lazy" />
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-md border bg-purple-50 text-purple-700">{r.type}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md border bg-slate-50 text-slate-700">{r.subject}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">{r.publisher}</div>
                  <div className="text-xs text-gray-500">{r.year}</div>
                </div>

                <h3 className="mt-1 text-base sm:text-lg font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{r.desc}</p>

                {r.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    {r.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md border bg-gray-50">{t}</span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                  <AccessBadge access={r.access} />
                  {r.duration && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border bg-amber-50 text-amber-700">
                      <FiClock /> {r.duration}
                    </span>
                  )}
                  {r.size && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-700">
                      <FiFileText /> {r.size}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 inline-flex items-center justify-center"
                  >
                    {r.type === "Video" ? <FiPlayCircle className="mr-2" /> : <FiExternalLink className="mr-2" />}
                    Open
                  </a>
                  <button
                    onClick={() => setOpenId(r.id)}
                    className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm inline-flex items-center justify-center"
                  >
                    Details <FiChevronRight className="ml-1" />
                  </button>
                  <button
                    onClick={() => copyLink(r.link)}
                    className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm inline-flex items-center justify-center"
                  >
                    <FiLink className="mr-2" /> Copy Link
                  </button>
                  <button
                    onClick={() => setSaved(s => ({ ...s, [r.id]: !s[r.id] }))}
                    className={cls(
                      "px-3 py-1.5 rounded-lg border text-sm inline-flex items-center justify-center",
                      saved[r.id] ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "hover:bg-gray-50"
                    )}
                    title="Save to My List (local)"
                  >
                    {saved[r.id] ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!filtered.length && (
          <div className="px-4 pb-6 text-center text-gray-500">No resources found.</div>
        )}
      </div>

      {/* Details modal */}
      <DetailsModal
        item={filtered.find(x => x.id === openId) || RESOURCES.find(x => x.id === openId)}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}

/* -------------------------------- Subcomponents -------------------------------- */
function Dropdown({ label, value, onChange, options, icon }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm text-gray-600 whitespace-nowrap">{label}:</span>
      <select
        className="border rounded-lg px-3 py-2 text-sm w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function AccessBadge({ access }) {
  const tone =
    access === "Open Access" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
    access.includes("Remote") ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
    "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[12px] ${tone}`}>
      <FiGlobe /> {access}
    </span>
  );
}

function DetailsModal({ item, onClose }) {
  if (!item) return null;
  const cite = `${item.publisher ? item.publisher + ". " : ""}${item.title} (${item.year}). ${item.subject ? item.subject + ". " : ""}${item.link}`;
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
            <div className="text-xs sm:text-sm text-gray-500">{item.type} · {item.subject} · {item.year}</div>
            <div className="text-base sm:text-lg font-semibold">{item.title}</div>
            <div className="text-sm text-gray-600">{item.publisher}</div>
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
                <div className="text-sm font-semibold text-gray-800 mb-2">About</div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
              </section>

              {item.tags?.length > 0 && (
                <section className="p-3 rounded-lg border bg-white">
                  <div className="text-sm font-semibold text-gray-800 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {item.tags.map((t) => (
                      <span key={t} className="px-2 py-1 rounded-md border bg-gray-50">{t}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Quick Info</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <Row k="Access" v={<AccessBadge access={item.access} />} />
                  <Row k="Publisher" v={item.publisher} />
                  <Row k="Format" v={item.duration ? "Video" : item.size || "Online"} />
                  <Row k="Link" v={<a href={item.link} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline inline-flex items-center"><FiExternalLink className="mr-1" />Open resource</a>} />
                </div>
              </section>

              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Citation</div>
                <p className="text-sm text-gray-700">{cite}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50 inline-flex items-center"
                    onClick={() => {
                      if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(cite);
                      else prompt("Copy citation", cite);
                    }}
                  >
                    <FiLink className="mr-2" /> Copy Citation
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50 inline-flex items-center"
                    onClick={() => alert("RIS export is a demo action")}
                  >
                    <FiDownload className="mr-2" /> Download RIS
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm text-center inline-flex items-center justify-center"
          >
            {item.type === "Video" ? <FiPlayCircle className="mr-2" /> : <FiExternalLink className="mr-2" />}
            Open Resource
          </a>
          <button className="w-full sm:w-auto px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-gray-500">{k}</div>
      <div className="text-gray-800">{v}</div>
    </div>
  );
}
