import { useMemo, useState } from "react";
import {
  FiChevronDown, FiUser, FiUsers, FiGrid, FiBookOpen, FiAward,
  FiMapPin, FiMail, FiPhone, FiClock, FiSearch, FiFilter,
  FiExternalLink, FiFileText, FiDownload
} from "react-icons/fi";

/* ------------------------ Static data (20 departments) ------------------------ */
const DEPTS = [
  {
    name: "Anatomy",
    hod: "Dr. Kavita Sharma",
    staff: 22, labs: 4, ugIntake: 150, pgPrograms: 2,
    cluster: "Pre-Clinical",
    desc: "Gross anatomy, histology, and embryology with dedicated museum and prosection sets.",
    location: "Block A · Level 1", phone: "011-4000-1001", email: "anatomy@mc.edu", hours: "09:00–17:00",
    facilities: ["Dissection Hall", "Histology Lab", "Anatomy Museum", "Skill Lab"],
    programs: ["UG (MBBS)", "MD Anatomy"],
    faculty: [
      { name: "Dr. Reena Kapoor", role: "Associate Professor" },
      { name: "Dr. Manish Patel", role: "Assistant Professor" },
      { name: "Dr. Sunita Desai", role: "Tutor" },
    ],
  },
  {
    name: "Physiology",
    hod: "Dr. Arvind Rao",
    staff: 18, labs: 3, ugIntake: 150, pgPrograms: 2,
    cluster: "Pre-Clinical",
    desc: "Neurophysiology, cardiovascular and respiratory labs with simulation stations.",
    location: "Block A · Level 2", phone: "011-4000-1002", email: "physiology@mc.edu", hours: "09:00–17:00",
    facilities: ["Neuro Lab", "Cardio-Resp Lab", "Simulation Stations"],
    programs: ["UG (MBBS)", "MD Physiology"],
    faculty: [
      { name: "Dr. Shweta Bansal", role: "Associate Professor" },
      { name: "Dr. Raj Mehra", role: "Assistant Professor" },
      { name: "Dr. Aisha Khan", role: "Tutor" },
    ],
  },
  {
    name: "Biochemistry",
    hod: "Dr. Pooja Khanna",
    staff: 16, labs: 3, ugIntake: 150, pgPrograms: 2,
    cluster: "Pre-Clinical",
    desc: "Clinical biochemistry and molecular techniques with automation.",
    location: "Block A · Level 3", phone: "011-4000-1003", email: "biochem@mc.edu", hours: "09:00–17:00",
    facilities: ["Wet Lab", "Molecular Room", "Automated Analyzers"],
    programs: ["UG (MBBS)", "MD Biochemistry"],
    faculty: [
      { name: "Dr. Neeraj Saxena", role: "Associate Professor" },
      { name: "Dr. Isha Malhotra", role: "Assistant Professor" },
      { name: "Dr. Parth Gupta", role: "Tutor" },
    ],
  },
  {
    name: "Pathology",
    hod: "Dr. Sameer Kulkarni",
    staff: 24, labs: 5, ugIntake: 150, pgPrograms: 3,
    cluster: "Para-Clinical",
    desc: "Histopathology, cytology and hematology with on-site frozen section service.",
    location: "Block B · Level 1", phone: "011-4000-2001", email: "pathology@mc.edu", hours: "09:00–18:00",
    facilities: ["Histopath Lab", "Cytology", "Hematology", "Frozen Section", "Blood Bank Liaison"],
    programs: ["UG (MBBS)", "MD Pathology"],
    faculty: [
      { name: "Dr. Radhika Iyer", role: "Associate Professor" },
      { name: "Dr. Saurabh Jain", role: "Assistant Professor" },
      { name: "Dr. Meenal Chauhan", role: "Senior Resident" },
    ],
  },
  {
    name: "Microbiology",
    hod: "Dr. Priyanka Sinha",
    staff: 20, labs: 4, ugIntake: 150, pgPrograms: 2,
    cluster: "Para-Clinical",
    desc: "Bacteriology, virology and mycology with biosafety level-2 benches.",
    location: "Block B · Level 2", phone: "011-4000-2002", email: "micro@mc.edu", hours: "09:00–18:00",
    facilities: ["Bacteriology", "Virology", "Mycology", "Biosafety Level-2"],
    programs: ["UG (MBBS)", "MD Microbiology"],
    faculty: [
      { name: "Dr. Amanpreet Kaur", role: "Associate Professor" },
      { name: "Dr. Vikram Bhat", role: "Assistant Professor" },
      { name: "Dr. Juhi Tiwari", role: "Senior Resident" },
    ],
  },
  {
    name: "Pharmacology",
    hod: "Dr. Nisha Verma",
    staff: 15, labs: 2, ugIntake: 150, pgPrograms: 2,
    cluster: "Para-Clinical",
    desc: "Clinical pharmacology, therapeutics and prescription writing with simulation.",
    location: "Block B · Level 3", phone: "011-4000-2003", email: "pharma@mc.edu", hours: "09:00–17:00",
    facilities: ["Clinical Pharm Lab", "Prescription Simulation"],
    programs: ["UG (MBBS)", "MD Pharmacology"],
    faculty: [
      { name: "Dr. Ashish Vora", role: "Associate Professor" },
      { name: "Dr. Rhea Ghosh", role: "Assistant Professor" },
      { name: "Dr. Kunal Sethi", role: "Senior Resident" },
    ],
  },
  {
    name: "Forensic Medicine",
    hod: "Dr. Rajeev Bhatia",
    staff: 12, labs: 2, ugIntake: 150, pgPrograms: 1,
    cluster: "Para-Clinical",
    desc: "Medico-legal workup, toxicology and mortuary services.",
    location: "Block B · Ground", phone: "011-4000-2004", email: "forensic@mc.edu", hours: "09:00–17:00",
    facilities: ["Toxicology Lab", "Mortuary", "Medico-legal Cell"],
    programs: ["UG (MBBS)", "MD Forensic Medicine"],
    faculty: [
      { name: "Dr. Mehul Trivedi", role: "Associate Professor" },
      { name: "Dr. Ipsita Roy", role: "Assistant Professor" },
      { name: "Dr. Rohit Arora", role: "Senior Resident" },
    ],
  },
  {
    name: "Community Medicine",
    hod: "Dr. Alka Agarwal",
    staff: 14, labs: 2, ugIntake: 150, pgPrograms: 2,
    cluster: "Para-Clinical",
    desc: "Rural/urban health training centres, epidemiology and public health projects.",
    location: "Block C · Level 1", phone: "011-4000-3001", email: "psm@mc.edu", hours: "09:00–17:00",
    facilities: ["RHTC", "UHTC", "Epidemiology Unit"],
    programs: ["UG (MBBS)", "MD Community Medicine"],
    faculty: [
      { name: "Dr. Shalini Joshi", role: "Associate Professor" },
      { name: "Dr. Nitin Khedekar", role: "Assistant Professor" },
      { name: "Dr. Pritika Sood", role: "Senior Resident" },
    ],
  },
  {
    name: "General Medicine",
    hod: "Dr. Sandeep Chaturvedi",
    staff: 40, labs: 6, ugIntake: 150, pgPrograms: 5,
    cluster: "Clinical",
    desc: "Inpatient wards, ICU, and subspecialty clinics with evidence-based rounds.",
    location: "Hospital Tower · Levels 3–5", phone: "011-4000-4001", email: "medicine@mc.edu", hours: "24×7 (Clinical)",
    facilities: ["MICU", "Dialysis", "Echo Suite", "Endoscopy"],
    programs: ["UG (MBBS)", "MD General Medicine", "DM (select)"],
    faculty: [
      { name: "Dr. Raghav Ahuja", role: "Professor" },
      { name: "Dr. Pallavi Joshi", role: "Associate Professor" },
      { name: "Dr. Varun Nanda", role: "Assistant Professor" },
    ],
  },
  {
    name: "General Surgery",
    hod: "Dr. Hemant Joshi",
    staff: 38, labs: 6, ugIntake: 150, pgPrograms: 5,
    cluster: "Clinical",
    desc: "Modular OTs, surgical ICU, endoscopy and laparoscopy training.",
    location: "OT Block · Level 2", phone: "011-4000-4002", email: "surgery@mc.edu", hours: "24×7 (Clinical)",
    facilities: ["Modular OTs", "SICU", "Laparoscopy", "Endoscopy"],
    programs: ["UG (MBBS)", "MS General Surgery", "MCh (select)"],
    faculty: [
      { name: "Dr. Akshay Raina", role: "Professor" },
      { name: "Dr. Ritu Kaur", role: "Associate Professor" },
      { name: "Dr. Ajay Singh", role: "Assistant Professor" },
    ],
  },
  {
    name: "Orthopedics",
    hod: "Dr. Vivek Malhotra",
    staff: 22, labs: 3, ugIntake: 150, pgPrograms: 3,
    cluster: "Clinical",
    desc: "Trauma services, arthroscopy, arthroplasty and spinal surgery.",
    location: "Hospital Tower · Level 6", phone: "011-4000-4003", email: "ortho@mc.edu", hours: "24×7 (Clinical)",
    facilities: ["Trauma OT", "Arthroscopy", "Arthroplasty"],
    programs: ["UG (MBBS)", "MS Orthopedics"],
    faculty: [
      { name: "Dr. Saurav Goyal", role: "Associate Professor" },
      { name: "Dr. Neha Taneja", role: "Assistant Professor" },
      { name: "Dr. Keshav Rao", role: "Senior Resident" },
    ],
  },
  {
    name: "Obstetrics & Gynaecology",
    hod: "Dr. Neelam Gupta",
    staff: 30, labs: 5, ugIntake: 150, pgPrograms: 4,
    cluster: "Clinical",
    desc: "Labour suites, high-risk clinics, endoscopy and fertility services.",
    location: "Women & Child Block · Level 2", phone: "011-4000-4004", email: "obg@mc.edu", hours: "24×7 (Clinical)",
    facilities: ["Labour OT", "Fetal Medicine", "Endoscopy"],
    programs: ["UG (MBBS)", "MS OBG"],
    faculty: [
      { name: "Dr. Shreya Nambiar", role: "Associate Professor" },
      { name: "Dr. Monica Jain", role: "Assistant Professor" },
      { name: "Dr. Ishaan Roy", role: "Senior Resident" },
    ],
  },
  {
    name: "Pediatrics",
    hod: "Dr. Ritu Mahajan",
    staff: 28, labs: 4, ugIntake: 150, pgPrograms: 3,
    cluster: "Clinical",
    desc: "NICU, PICU and immunization clinics with growth & development units.",
    location: "Women & Child Block · Level 3", phone: "011-4000-4005", email: "peds@mc.edu", hours: "24×7 (Clinical)",
    facilities: ["NICU", "PICU", "Immunization"],
    programs: ["UG (MBBS)", "MD Pediatrics"],
    faculty: [
      { name: "Dr. Mahesh Jagtap", role: "Associate Professor" },
      { name: "Dr. Nandini Iyer", role: "Assistant Professor" },
      { name: "Dr. Zoya Khan", role: "Senior Resident" },
    ],
  },
  {
    name: "ENT (Otorhinolaryngology)",
    hod: "Dr. Abhijit Das",
    staff: 16, labs: 2, ugIntake: 150, pgPrograms: 2,
    cluster: "Clinical",
    desc: "Microscopic ear surgery, endoscopic sinus surgery, and voice clinics.",
    location: "OPD Block · Level 1", phone: "011-4000-4006", email: "ent@mc.edu", hours: "09:00–17:00",
    facilities: ["Microscope", "Endoscopy", "Audiology"],
    programs: ["UG (MBBS)", "MS ENT"],
    faculty: [
      { name: "Dr. Prerna Sood", role: "Associate Professor" },
      { name: "Dr. Karthik Pillai", role: "Assistant Professor" },
      { name: "Dr. Vandana Rao", role: "Senior Resident" },
    ],
  },
  {
    name: "Ophthalmology",
    hod: "Dr. Megha Jain",
    staff: 18, labs: 2, ugIntake: 150, pgPrograms: 2,
    cluster: "Clinical",
    desc: "Phacoemulsification, retina services and pediatric ophthalmology.",
    location: "OPD Block · Level 2", phone: "011-4000-4007", email: "eye@mc.edu", hours: "09:00–17:00",
    facilities: ["Phaco Suite", "Retina Unit", "Optometry"],
    programs: ["UG (MBBS)", "MS Ophthalmology"],
    faculty: [
      { name: "Dr. Nikhil Taneja", role: "Associate Professor" },
      { name: "Dr. Pooja Arora", role: "Assistant Professor" },
      { name: "Dr. Jatin Shah", role: "Senior Resident" },
    ],
  },
  {
    name: "Dermatology",
    hod: "Dr. Kiran Kulkarni",
    staff: 12, labs: 1, ugIntake: 150, pgPrograms: 1,
    cluster: "Clinical",
    desc: "Medical dermatology, cosmetology and phototherapy.",
    location: "OPD Block · Level 3", phone: "011-4000-4008", email: "derma@mc.edu", hours: "09:00–17:00",
    facilities: ["Phototherapy", "Dermatosurgery", "Cosmetology"],
    programs: ["UG (MBBS)", "MD Dermatology"],
    faculty: [
      { name: "Dr. Rhea Mathur", role: "Associate Professor" },
      { name: "Dr. Abhishek Kaul", role: "Assistant Professor" },
      { name: "Dr. Tanya Singh", role: "Senior Resident" },
    ],
  },
  {
    name: "Psychiatry",
    hod: "Dr. Anupama Sen",
    staff: 14, labs: 1, ugIntake: 150, pgPrograms: 1,
    cluster: "Clinical",
    desc: "Outpatient and inpatient psychiatry with de-addiction and counseling.",
    location: "OPD Block · Level 4", phone: "011-4000-4009", email: "psych@mc.edu", hours: "09:00–17:00",
    facilities: ["De-addiction", "Counseling Rooms"],
    programs: ["UG (MBBS)", "MD Psychiatry"],
    faculty: [
      { name: "Dr. Sameera Ali", role: "Associate Professor" },
      { name: "Dr. Naman Bose", role: "Assistant Professor" },
      { name: "Dr. Riddhi Shah", role: "Senior Resident" },
    ],
  },
  {
    name: "Radiology",
    hod: "Dr. Prakash Menon",
    staff: 26, labs: 3, ugIntake: 150, pgPrograms: 3,
    cluster: "Clinical",
    desc: "CT, MRI, ultrasound and interventional radiology with PACS.",
    location: "Diagnostics Block", phone: "011-4000-4010", email: "radio@mc.edu", hours: "24×7 (Clinical)",
    facilities: ["1.5T MRI", "128-slice CT", "USG", "IR Suite"],
    programs: ["UG (MBBS)", "MD Radiology"],
    faculty: [
      { name: "Dr. Sanya Kapoor", role: "Associate Professor" },
      { name: "Dr. Rohit Iyer", role: "Assistant Professor" },
      { name: "Dr. Jaya Menon", role: "Senior Resident" },
    ],
  },
  {
    name: "Anaesthesiology",
    hod: "Dr. Seema Raina",
    staff: 25, labs: 2, ugIntake: 150, pgPrograms: 3,
    cluster: "Clinical",
    desc: "Perioperative services, ICU sedation and pain clinic.",
    location: "OT Block · Level 2", phone: "011-4000-4011", email: "anaes@mc.edu", hours: "24×7 (Clinical)",
    facilities: ["OT Coverage", "ICU Cover", "Pain Clinic"],
    programs: ["UG (MBBS)", "MD Anaesthesiology"],
    faculty: [
      { name: "Dr. Varsha Nair", role: "Associate Professor" },
      { name: "Dr. Deepak Sood", role: "Assistant Professor" },
      { name: "Dr. Prachi Jain", role: "Senior Resident" },
    ],
  },
  {
    name: "Emergency Medicine",
    hod: "Dr. Arjun Bhatt",
    staff: 20, labs: 2, ugIntake: 150, pgPrograms: 2,
    cluster: "Clinical",
    desc: "24×7 ER with trauma bays, point-of-care ultrasound and triage.",
    location: "ER Complex", phone: "011-4000-4012", email: "er@mc.edu", hours: "24×7 (Clinical)",
    facilities: ["Triage", "Resus Bays", "POCUS"],
    programs: ["UG (MBBS)", "MD Emergency Medicine"],
    faculty: [
      { name: "Dr. Mohit Rawal", role: "Associate Professor" },
      { name: "Dr. Trisha Sen", role: "Assistant Professor" },
      { name: "Dr. Nirav Patel", role: "Senior Resident" },
    ],
  },
];

/* ----------------------------- Helpers & UI bits ----------------------------- */
const CLUSTERS = ["All", "Pre-Clinical", "Para-Clinical", "Clinical"];

const cls = (...a) => a.filter(Boolean).join(" ");
const initials = (name) =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

/* ---------------------------------- View ---------------------------------- */
export default function Departments() {
  const [open, setOpen] = useState(() =>
    Object.fromEntries(DEPTS.map(d => [d.name, false]))
  );
  const [q, setQ] = useState("");
  const [cluster, setCluster] = useState("All");
  const [minStaff, setMinStaff] = useState(0);

  // Summary
  const summary = useMemo(() => {
    const totalDepts = DEPTS.length;
    const totalStaff = DEPTS.reduce((a, d) => a + d.staff, 0);
    const totalLabs = DEPTS.reduce((a, d) => a + d.labs, 0);
    return { totalDepts, totalStaff, totalLabs };
  }, []);

  // Filtered list
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return DEPTS.filter(d =>
      (cluster === "All" || d.cluster === cluster) &&
      d.staff >= Number(minStaff || 0) &&
      (
        !needle ||
        `${d.name} ${d.hod} ${d.desc} ${d.location} ${d.email} ${d.phone}`
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [q, cluster, minStaff]);

  const expandAll = () => setOpen(Object.fromEntries(list.map(d => [d.name, true])));
  const collapseAll = () => setOpen(Object.fromEntries(list.map(d => [d.name, false])));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Departments</h1>

      {/* Animations */}
      <style>{`
        .card-in { animation: cardIn .28s ease both; }
        @keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .fade { animation: fade .25s ease both; }
        @keyframes fade { from { opacity:0 } to { opacity:1 } }
        .pill { transition: all .15s ease; }
      `}</style>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard icon={<FiUsers className="h-5 w-5" />} title="Total Staff" value={summary.totalStaff} />
        <SummaryCard icon={<FiGrid className="h-5 w-5" />} title="Total Labs" value={summary.totalLabs} />
        <SummaryCard icon={<FiBookOpen className="h-5 w-5" />} title="Departments" value={summary.totalDepts} />
      </div>

      {/* Filters bar */}
      <div className="card-in bg-white border rounded-xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
              placeholder="Search name, HOD, location…"
            />
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select className="border rounded-lg px-3 py-2 text-sm w-full" value={cluster} onChange={(e) => setCluster(e.target.value)}>
              {CLUSTERS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Min Staff:</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2 text-sm w-full"
              value={minStaff}
              onChange={(e) => setMinStaff(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={expandAll} className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm w-full">Expand All</button>
            <button onClick={collapseAll} className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm w-full">Collapse All</button>
          </div>
        </div>
      </div>

      {/* Departments list */}
      <div className="space-y-3">
        {list.map((d, i) => {
          const isOpen = open[d.name];
          return (
            <div key={d.name} className="card-in bg-white border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(o => ({ ...o, [d.name]: !o[d.name] }))}
                className="w-full px-4 py-3 flex items-center justify-between"
              >
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{d.name}</span>
                    <ClusterBadge cluster={d.cluster} />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">HOD: {d.hod}</div>
                </div>
                <FiChevronDown className={"h-5 w-5 transition " + (isOpen ? "rotate-180" : "")} />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 fade">
                  {/* Description */}
                  <p className="text-sm text-gray-700">{d.desc}</p>

                  {/* Stats */}
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-6 gap-3">
                    <Stat label="Staff" value={d.staff} icon={<FiUsers />} />
                    <Stat label="Labs" value={d.labs} icon={<FiGrid />} />
                    <Stat label="UG Intake" value={d.ugIntake} icon={<FiBookOpen />} />
                    <Stat label="PG Programs" value={d.pgPrograms} icon={<FiAward />} />
                    <Stat label="Location" value={d.location} icon={<FiMapPin />} />
                    <Stat label="Timings" value={d.hours} icon={<FiClock />} />
                  </div>

                  {/* Programs & Facilities */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CardSection title="Programs Offered" icon={<FiBookOpen className="mr-2" />}>
                      <div className="flex flex-wrap gap-2">
                        {d.programs.map(p => <Chip key={p} text={p} />)}
                      </div>
                    </CardSection>

                    <CardSection title="Facilities" icon={<FiGrid className="mr-2" />}>
                      <div className="flex flex-wrap gap-2">
                        {d.facilities.map(f => <Chip key={f} text={f} tone="gray" />)}
                      </div>
                    </CardSection>
                  </div>

                  {/* Contact */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <CardSection title="Contact" icon={<FiPhone className="mr-2" />}>
                      <div className="text-sm text-gray-700 flex items-center"><FiPhone className="mr-2" /> {d.phone}</div>
                      <div className="text-sm text-gray-700 flex items-center"><FiMail className="mr-2" /> {d.email}</div>
                      <div className="text-sm text-gray-700 flex items-center"><FiMapPin className="mr-2" /> {d.location}</div>
                    </CardSection>

                    <CardSection title="Actions" icon={<FiFileText className="mr-2" />}>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"><FiFileText className="inline mr-1" /> View Courses</button>
                        <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"><FiExternalLink className="inline mr-1" /> Timetable</button>
                        <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"><FiDownload className="inline mr-1" /> Brochure</button>
                      </div>
                    </CardSection>

                    <CardSection title="At a Glance" icon={<FiAward className="mr-2" />}>
                      <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        <li>Active mentorship & bedside teaching</li>
                        <li>Internal assessments as per NMC competencies</li>
                        <li>Regular CME / Journal Clubs</li>
                      </ul>
                    </CardSection>
                  </div>

                  {/* Faculty */}
                  <div className="mt-3">
                    <div className="font-medium mb-2 text-gray-800">Key Faculty</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {d.faculty.map(f => (
                        <div key={f.name} className="p-3 rounded-lg border bg-gray-50 flex items-center">
                          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold mr-3">
                            {initials(f.name)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{f.name}</div>
                            <div className="text-xs text-gray-600">{f.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!list.length && (
          <div className="text-center text-gray-500 py-10">No departments match your filters.</div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Reusable UI ------------------------------ */
function SummaryCard({ icon, title, value }) {
  return (
    <div className="card-in bg-white border rounded-xl p-4 flex items-center gap-3">
      <div className="p-3 rounded-lg bg-blue-50 text-blue-700">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="p-3 rounded-lg border bg-gray-50">
      <div className="text-xs text-gray-500 flex items-center gap-2">
        {icon} <span>{label}</span>
      </div>
      <div className="text-sm md:text-base font-semibold mt-1">{value}</div>
    </div>
  );
}

function CardSection({ title, children, icon }) {
  return (
    <div className="p-3 rounded-lg border bg-white">
      <div className="text-sm font-semibold text-gray-800 flex items-center mb-2">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function Chip({ text, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-slate-50 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={cls("inline-flex items-center px-2 py-1 rounded-md border text-xs", tones[tone] || tones.blue)}>
      {text}
    </span>
  );
}

function ClusterBadge({ cluster }) {
  const map = {
    "Pre-Clinical": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Para-Clinical": "bg-amber-50 text-amber-700 border-amber-200",
    "Clinical": "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={cls("text-xs px-2 py-0.5 rounded-md border", map[cluster])}>
      {cluster}
    </span>
  );
}
