import { useMemo, useState } from "react";
import {
  FiSearch, FiTag, FiLayers, FiGrid, FiBookOpen, FiAward, FiClock,
  FiUsers, FiFilter, FiChevronDown, FiX, FiHash, FiFileText
} from "react-icons/fi";

/* --------------------------------- Static data --------------------------------- */
const COURSES = [
  // MBBS – Sem 1
  { code: "MB101", name: "Human Anatomy", program: "MBBS", sem: "1", department: "Anatomy",
    tags: ["Core", "Lab"], ltp: { L: 4, T: 0, P: 4 }, credits: 6, hoursPerWeek: 8, coordinator: "Dr. Kavita Sharma",
    outcomes: ["Describe gross anatomy & surface landmarks", "Identify histological slides", "Demonstrate basic dissection skills"],
    prereq: [], syllabus: ["General Anatomy", "Upper limb", "Thorax", "Histology basics", "Embryology overview"],
    assessment: { IA: "20", Univ: "80", Practical: "50" }
  },
  { code: "MB102", name: "Human Physiology", program: "MBBS", sem: "1", department: "Physiology",
    tags: ["Core", "Lab"], ltp: { L: 4, T: 1, P: 2 }, credits: 6, hoursPerWeek: 7, coordinator: "Dr. Arvind Rao",
    outcomes: ["Explain functions of organ systems", "Record basic physiological parameters"],
    prereq: [], syllabus: ["Cell & Membrane", "Nerve-Muscle", "CVS", "Respiratory", "Renal"],
    assessment: { IA: "20", Univ: "80", Practical: "50" }
  },
  { code: "MB103", name: "Biochemistry", program: "MBBS", sem: "1", department: "Biochemistry",
    tags: ["Core", "Lab"], ltp: { L: 3, T: 1, P: 2 }, credits: 5, hoursPerWeek: 6, coordinator: "Dr. Pooja Khanna",
    outcomes: ["Relate biochemical pathways to disease", "Perform basic clinical biochemistry tests"],
    prereq: [], syllabus: ["Carbohydrates", "Proteins", "Lipids", "Enzymes", "Molecular Biology"],
    assessment: { IA: "20", Univ: "80", Practical: "50" }
  },

  // MBBS – Sem 3
  { code: "MB203", name: "Pharmacology", program: "MBBS", sem: "3", department: "Pharmacology",
    tags: ["Core"], ltp: { L: 3, T: 1, P: 1 }, credits: 5, hoursPerWeek: 5, coordinator: "Dr. Nisha Verma",
    outcomes: ["Rational prescription writing", "Adverse drug reaction reporting"],
    prereq: ["MB102"], syllabus: ["General Pharm", "ANS", "Cardio", "Antibiotics", "Autacoids"],
    assessment: { IA: "20", Univ: "80", Practical: "30" }
  },
  { code: "MB204", name: "Pathology", program: "MBBS", sem: "3", department: "Pathology",
    tags: ["Core", "Lab"], ltp: { L: 4, T: 0, P: 2 }, credits: 6, hoursPerWeek: 6, coordinator: "Dr. Sameer Kulkarni",
    outcomes: ["Explain mechanisms of disease", "Perform peripheral smear & staining"],
    prereq: ["MB103"], syllabus: ["Cell injury", "Inflammation", "Neoplasia", "Hematology", "Systemic Path"],
    assessment: { IA: "20", Univ: "80", Practical: "50" }
  },
  { code: "MB205", name: "Microbiology", program: "MBBS", sem: "3", department: "Microbiology",
    tags: ["Core", "Lab"], ltp: { L: 3, T: 0, P: 2 }, credits: 5, hoursPerWeek: 5, coordinator: "Dr. Priyanka Sinha",
    outcomes: ["Interpret Gram stain", "Explain infection control principles"],
    prereq: ["MB103"], syllabus: ["Bacteriology", "Virology", "Mycology", "Immunology", "Antimicrobials"],
    assessment: { IA: "20", Univ: "80", Practical: "40" }
  },

  // MBBS – Sem 5
  { code: "MB305", name: "ENT (Otorhinolaryngology)", program: "MBBS", sem: "5", department: "ENT",
    tags: ["Core", "Clinical"], ltp: { L: 2, T: 0, P: 2 }, credits: 4, hoursPerWeek: 4, coordinator: "Dr. Abhijit Das",
    outcomes: ["Otoscopic & nasal examination", "Manage common ENT emergencies"],
    prereq: ["MB204", "MB205"], syllabus: ["Otology", "Rhinology", "Laryngology", "Head & Neck basics"],
    assessment: { IA: "20", Univ: "80", Practical: "50" }
  },
  { code: "MB306", name: "Ophthalmology", program: "MBBS", sem: "5", department: "Ophthalmology",
    tags: ["Core", "Clinical"], ltp: { L: 2, T: 0, P: 2 }, credits: 4, hoursPerWeek: 4, coordinator: "Dr. Megha Jain",
    outcomes: ["Visual acuity & slit lamp basics", "Red eye management"],
    prereq: ["MB204"], syllabus: ["Refraction", "Anterior segment", "Posterior segment", "Common disorders"],
    assessment: { IA: "20", Univ: "80", Practical: "50" }
  },

  // Nursing
  { code: "NU112", name: "Fundamentals of Nursing", program: "B.Sc Nursing", sem: "2", department: "Nursing",
    tags: ["Core", "Clinical"], ltp: { L: 3, T: 0, P: 3 }, credits: 6, hoursPerWeek: 6, coordinator: "Sr. Nisha Joseph",
    outcomes: ["Demonstrate basic nursing procedures", "Nursing process documentation"],
    prereq: [], syllabus: ["Nursing foundations", "Vitals", "Bed making", "Asepsis", "Communication"],
    assessment: { IA: "25", Univ: "75", Practical: "50" }
  },
  { code: "NU212", name: "Medical-Surgical Nursing I", program: "B.Sc Nursing", sem: "3", department: "Nursing",
    tags: ["Core", "Clinical"], ltp: { L: 3, T: 0, P: 3 }, credits: 6, hoursPerWeek: 6, coordinator: "Sr. Lavanya Rao",
    outcomes: ["Provide adult patient care", "Pre & post-op nursing"],
    prereq: ["NU112"], syllabus: ["CVS", "Resp", "GI", "Endocrine", "Renal"],
    assessment: { IA: "25", Univ: "75", Practical: "50" }
  },
  { code: "NU322", name: "Community Health Nursing", program: "B.Sc Nursing", sem: "4", department: "Community Medicine",
    tags: ["Core", "Field"], ltp: { L: 2, T: 0, P: 2 }, credits: 4, hoursPerWeek: 4, coordinator: "Dr. Alka Agarwal",
    outcomes: ["Conduct home visits", "Implement health education"],
    prereq: ["NU112"], syllabus: ["RCH", "National programs", "Epidemiology basics", "Field posting"],
    assessment: { IA: "25", Univ: "75", Practical: "40" }
  },

  // Allied Health (BPT)
  { code: "PT105", name: "Biomechanics", program: "Allied Health (BPT)", sem: "1", department: "Physiotherapy",
    tags: ["Core"], ltp: { L: 3, T: 0, P: 1 }, credits: 4, hoursPerWeek: 4, coordinator: "Dr. Manish Patel",
    outcomes: ["Explain joint kinematics", "Demonstrate posture assessment"],
    prereq: [], syllabus: ["Kinetics", "Gait", "Segments", "Posture", "Ergonomics"],
    assessment: { IA: "20", Univ: "80", Practical: "30" }
  },
  { code: "PT205", name: "Therapeutic Exercise", program: "Allied Health (BPT)", sem: "2", department: "Physiotherapy",
    tags: ["Core", "Lab"], ltp: { L: 2, T: 0, P: 2 }, credits: 4, hoursPerWeek: 4, coordinator: "Dr. Neha Kulkarni",
    outcomes: ["Plan basic exercise protocols", "Demonstrate ROM exercises"],
    prereq: ["PT105"], syllabus: ["ROM", "Stretching", "Strengthening", "PNF", "Balance"],
    assessment: { IA: "20", Univ: "80", Practical: "40" }
  },

  // Electives
  { code: "MBE01", name: "Medical Ethics & Communication", program: "MBBS", sem: "2", department: "Community Medicine",
    tags: ["Elective"], ltp: { L: 1, T: 1, P: 0 }, credits: 2, hoursPerWeek: 2, coordinator: "Dr. Shalini Joshi",
    outcomes: ["Break bad news ethically", "Discuss consent & confidentiality"],
    prereq: [], syllabus: ["Ethics principles", "Communication skills", "Consent", "Cultural competence"],
    assessment: { IA: "40 (Viva/OSCE)", Univ: "—", Practical: "—" }
  },
];

/* ------------------------------ Helpers & derivations ------------------------------ */
const cls = (...a) => a.filter(Boolean).join(" ");
const unique = (arr) => Array.from(new Set(arr));
const PROGRAMS = ["All", ...unique(COURSES.map(c => c.program))];

export default function Courses() {
  // Filters / UI state
  const [q, setQ] = useState("");
  const [prog, setProg] = useState("All");
  const [sem, setSem] = useState("All");
  const [dept, setDept] = useState("All");
  const [tag, setTag] = useState("All");
  const [sortBy, setSortBy] = useState("name"); // 'name' | 'code' | 'credits'
  const [openCode, setOpenCode] = useState(null); // syllabus modal

  // Derived filter options
  const semesters = useMemo(() => {
    const pool = COURSES.filter(c => prog === "All" || c.program === prog).map(c => c.sem);
    return ["All", ...unique(pool).sort((a,b)=>Number(a)-Number(b))];
  }, [prog]);

  const departments = useMemo(() => {
    const pool = COURSES
      .filter(c => (prog === "All" || c.program === prog) && (sem === "All" || c.sem === sem))
      .map(c => c.department);
    return ["All", ...unique(pool).sort()];
  }, [prog, sem]);

  const tags = useMemo(() => ["All", ...unique(COURSES.flatMap(c => c.tags))], []);

  // Filtering + sorting
  const list = useMemo(() => {
    let res = COURSES.filter(c =>
      (prog === "All" || c.program === prog) &&
      (sem === "All" || c.sem === sem) &&
      (dept === "All" || c.department === dept) &&
      (tag === "All" || c.tags.includes(tag)) &&
      `${c.code} ${c.name}`.toLowerCase().includes(q.toLowerCase())
    );

    res.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "code") return a.code.localeCompare(b.code);
      if (sortBy === "credits") return (b.credits ?? 0) - (a.credits ?? 0);
      return 0;
    });

    return res;
  }, [q, prog, sem, dept, tag, sortBy]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Courses</h1>

      {/* Animations */}
      <style>{`
        .card-in { animation: cardIn .28s ease both; }
        @keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .fade { animation: fade .25s ease both; }
        @keyframes fade { from { opacity:0 } to { opacity:1 } }
        .pill { transition: all .15s ease; }
      `}</style>

      {/* Filter bar */}
      <div className="card-in bg-white border rounded-xl p-4">
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-3">
          <div className="relative xl:col-span-2">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full"
              placeholder="Search by code or name…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select className="border rounded-lg px-3 py-2 text-sm w-full" value={prog} onChange={e => { setProg(e.target.value); setSem("All"); setDept("All"); }}>
              {PROGRAMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Semester:</span>
            <select className="border rounded-lg px-3 py-2 text-sm w-full" value={sem} onChange={e => { setSem(e.target.value); setDept("All"); }}>
              {semesters.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Department:</span>
            <select className="border rounded-lg px-3 py-2 text-sm w-full" value={dept} onChange={e => setDept(e.target.value)}>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FiTag className="text-gray-400" />
            <select className="border rounded-lg px-3 py-2 text-sm w-full" value={tag} onChange={e => setTag(e.target.value)}>
              {tags.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Sort:</span>
            <select className="border rounded-lg px-3 py-2 text-sm w-full" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Name (A–Z)</option>
              <option value="code">Code</option>
              <option value="credits">Credits</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card-in bg-white border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {list.map((c, i) => (
            <div key={c.code} className="border rounded-xl bg-white p-4 hover:shadow-sm transition card-in" style={{ animationDelay: `${i * 25}ms` }}>
              <div className="flex items-center justify-between">
                <div className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700">{c.program}</div>
                <div className="text-xs text-gray-500">Sem {c.sem}</div>
              </div>

              <div className="mt-2 text-lg font-semibold flex items-center gap-2">
                <span>{c.name}</span>
                {c.tags.includes("Elective") && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Elective</span>
                )}
              </div>

              <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                <span className="inline-flex items-center"><FiHash className="mr-1" />{c.code}</span>
                <span className="inline-flex items-center"><FiGrid className="mr-1" />{c.department}</span>
              </div>

              {/* chips */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Chip tone="blue"><FiBookOpen className="mr-1" /> L-T-P: {c.ltp.L}-{c.ltp.T}-{c.ltp.P}</Chip>
                <Chip tone="green"><FiAward className="mr-1" /> Credits: {c.credits}</Chip>
                <Chip tone="gray"><FiClock className="mr-1" /> {c.hoursPerWeek} hrs/week</Chip>
                {c.tags.map(t => <Chip key={t} tone={t === "Core" ? "indigo" : t === "Clinical" ? "rose" : "slate"}><FiTag className="mr-1" /> {t}</Chip>)}
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"
                  onClick={() => setOpenCode(c.code)}
                >
                  <FiFileText className="inline mr-1" /> Syllabus
                </button>
                <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm">View Batches</button>
                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Outline</button>
              </div>
            </div>
          ))}
        </div>

        {!list.length && (
          <div className="text-center text-gray-500 py-10">No courses match your filters.</div>
        )}
      </div>

      {/* Syllabus Modal */}
      <SyllabusModal
        course={list.find(x => x.code === openCode)}
        onClose={() => setOpenCode(null)}
      />
    </div>
  );
}

/* -------------------------------- Reusable UI -------------------------------- */
function Chip({ children, tone = "blue" }) {
  const map = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gray: "bg-slate-50 text-slate-700 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span className={cls("inline-flex items-center px-2 py-1 rounded-md border text-xs", map[tone])}>
      {children}
    </span>
  );
}

function SyllabusModal({ course, onClose }) {
  if (!course) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-3 sm:inset-x-8 md:inset-x-20 lg:inset-x-40 top-16 bg-white rounded-xl border shadow-2xl card-in">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Syllabus · {course.code}</div>
            <div className="text-lg font-semibold">{course.name}</div>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-50" onClick={onClose} aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Section title="Course Units">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {course.syllabus.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Section>

            <Section title="Intended Learning Outcomes">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {course.outcomes.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Section>
          </div>

          <div className="space-y-3">
            <Section title="Quick Info">
              <InfoRow icon={<FiLayers />} label="Program" value={course.program} />
              <InfoRow icon={<FiGrid />} label="Department" value={course.department} />
              <InfoRow icon={<FiBookOpen />} label="L-T-P" value={`${course.ltp.L}-${course.ltp.T}-${course.ltp.P}`} />
              <InfoRow icon={<FiAward />} label="Credits" value={course.credits} />
              <InfoRow icon={<FiClock />} label="Hours / Week" value={course.hoursPerWeek} />
              <InfoRow icon={<FiUsers />} label="Coordinator" value={course.coordinator} />
            </Section>

            <Section title="Prerequisites">
              {course.prereq.length
                ? <div className="flex flex-wrap gap-2">{course.prereq.map((p) => <Chip key={p}>{p}</Chip>)}</div>
                : <div className="text-sm text-gray-500">None</div>
              }
            </Section>

            <Section title="Assessment">
              <div className="text-sm text-gray-700 space-y-1">
                <div>Internal Assessment: <span className="font-medium">{course.assessment.IA}</span></div>
                <div>University Exam: <span className="font-medium">{course.assessment.Univ}</span></div>
                {course.assessment.Practical && (
                  <div>Practical/Clinical: <span className="font-medium">{course.assessment.Practical}</span></div>
                )}
              </div>
            </Section>
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm" onClick={onClose}>Close</button>
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Download Syllabus (PDF)</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="p-3 rounded-lg border bg-white">
      <div className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-gray-600">{icon}<span>{label}</span></div>
      <div className="font-medium text-gray-800">{value}</div>
    </div>
  );
}
