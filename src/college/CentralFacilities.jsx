import { useMemo, useState } from "react";
import {
  FiMapPin, FiClock, FiPhone, FiUsers, FiFilter, FiSearch,
  FiCheckCircle, FiX, FiCalendar, FiInfo, FiGlobe, FiChevronRight
} from "react-icons/fi";

/* ---------------------------------- Static data ---------------------------------- */
const FACILITIES = [
  {
    id: "f1",
    name: "Simulation & Skills Center",
    type: "Academic",
    loc: "Block C, Level 2",
    hours: "09:00 – 18:00",
    status: "By Booking",
    capacity: 40,
    contact: "+91-98765-10001",
    image: "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Task Trainers", "High-fidelity Mannequins", "AV Capture", "Debrief Rooms"],
    rules: ["Footwear covers mandatory", "Faculty supervisor for UG sessions", "No food/drinks inside labs"],
  },
  {
    id: "f2",
    name: "Anatomy Museum",
    type: "Academic",
    loc: "Block A, Level 1",
    hours: "10:00 – 17:00",
    status: "Open",
    capacity: 120,
    contact: "+91-98765-10002",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Wet Specimens", "Articulated Bones", "Embryology Models", "Interactive Kiosks"],
    rules: ["Bags to be kept outside", "Maintain silence", "Photography only with permission"],
  },
  {
    id: "f3",
    name: "Central Library",
    type: "Academic",
    loc: "Block B, Ground Floor",
    hours: "08:00 – 22:00",
    status: "Open",
    capacity: 300,
    contact: "+91-98765-10003",
    image: "https://images.unsplash.com/photo-1585432959449-b1c7b1c2d7d1?q=80&w=1600&auto=format&fit=crop",
    amenities: ["E-Resources", "Reading Hall", "Discussion Rooms", "Wi-Fi", "Issue/Return"],
    rules: ["ID card mandatory", "No loud conversations", "Return books on time"],
  },
  {
    id: "f4",
    name: "Main Auditorium",
    type: "Admin",
    loc: "Central Block",
    hours: "By Booking",
    status: "Slots Available",
    capacity: 600,
    contact: "+91-98765-10004",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Stage Lighting", "Projection", "Podium Mic", "Green Rooms"],
    rules: ["Booking approval required", "AV test one day prior", "No confetti or pyros"],
  },
  {
    id: "f5",
    name: "Sports Complex & Gym",
    type: "Student Support",
    loc: "East Campus",
    hours: "06:00 – 21:00",
    status: "Open",
    capacity: 150,
    contact: "+91-98765-10005",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Badminton Courts", "Gym", "Yoga Studio", "Table Tennis"],
    rules: ["Gym shoes required", "Carry own towel", "Book slots for peak hours"],
  },
  {
    id: "f6",
    name: "Hostel Office",
    type: "Admin",
    loc: "Hostel Block",
    hours: "09:00 – 17:00",
    status: "Open",
    capacity: 10,
    contact: "+91-98765-10006",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Room Allocation", "Visitor Pass", "Maintenance Desk"],
    rules: ["Submit ID proofs", "Follow hostel timings", "No late-night loud music"],
  },
  {
    id: "f7",
    name: "Biostatistics & Research Cell",
    type: "Academic",
    loc: "Block D, Level 3",
    hours: "10:00 – 18:00",
    status: "By Booking",
    capacity: 25,
    contact: "+91-98765-10007",
    image: "https://images.unsplash.com/photo-1581093458791-9d09c5a6c1d5?q=80&w=1600&auto=format&fit=crop",
    amenities: ["SPSS/R", "Consultation Desk", "Workstations"],
    rules: ["Prior appointment", "One project per slot", "Data privacy norms apply"],
  },
  {
    id: "f8",
    name: "Animal House (CPCSEA)",
    type: "Academic",
    loc: "Research Annex",
    hours: "09:00 – 17:00",
    status: "By Booking",
    capacity: 12,
    contact: "+91-98765-10008",
    image: "https://images.unsplash.com/photo-1581594549595-35f6edc3a2f7?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Quarantine", "Procedure Room", "Compliance Records"],
    rules: ["IAEC approval mandatory", "PPE required", "Entry logbook"],
  },
  {
    id: "f9",
    name: "Cafeteria & Food Court",
    type: "Student Support",
    loc: "Near Central Lawn",
    hours: "07:30 – 21:30",
    status: "Open",
    capacity: 200,
    contact: "+91-98765-10009",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Veg/Non-veg counters", "Hygiene certified", "UPI Payments"],
    rules: ["Keep area clean", "No outside food during events"],
  },
  {
    id: "f10",
    name: "Transport & Ambulance Desk",
    type: "Admin",
    loc: "Gate 2",
    hours: "24×7",
    status: "Open",
    capacity: 6,
    contact: "+91-98765-10010",
    image: "https://images.unsplash.com/photo-1588459468345-2d61b6689411?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Campus Shuttle", "Ambulance", "Inter-city Taxi Tie-ups"],
    rules: ["Maintain trip logs", "Emergency priority for Ambulance"],
  },
];

/* ------------------------------------ Helpers ----------------------------------- */
const cls = (...a) => a.filter(Boolean).join(" ");
const uniq = (arr) => Array.from(new Set(arr));
const TYPES = ["All", "Academic", "Admin", "Student Support"];
const AVAIL = ["All", "Open", "By Booking", "Slots Available"];

/* ================================== Component ================================== */
export default function CentralFacilities() {
  const [type, setType] = useState("All");
  const [avail, setAvail] = useState("All");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("A–Z");
  const [openId, setOpenId] = useState(null);
  const [bookId, setBookId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const types = useMemo(() => TYPES, []);
  const availOpts = useMemo(() => AVAIL, []);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = FACILITIES.filter(
      (f) =>
        (type === "All" || f.type === type) &&
        (avail === "All" || f.status === avail) &&
        (!needle ||
          `${f.name} ${f.loc} ${f.amenities.join(" ")}`.toLowerCase().includes(needle))
    );
    if (sortBy === "A–Z") list = list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Capacity") list = list.sort((a, b) => b.capacity - a.capacity);
    return list;
  }, [type, avail, q, sortBy]);

  const summary = useMemo(() => {
    const total = rows.length;
    const open = rows.filter((r) => r.status === "Open").length;
    const booking = rows.filter((r) => r.status === "By Booking" || r.status === "Slots Available").length;
    return { total, open, booking };
  }, [rows]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Central Facilities</h1>

        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <button
            className="sm:hidden px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center justify-center"
            onClick={() => setShowFilters((v) => !v)}
          >
            <FiFilter className="mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full sm:w-72"
              placeholder="Search name, location, amenity…"
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

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Summary label="Facilities" value={summary.total} />
        <Summary label="Currently Open" value={summary.open} />
        <Summary label="Bookable" value={summary.booking} />
      </div>

      {/* Filters */}
      <div className={cls("card-in bg-white border rounded-xl", showFilters ? "block" : "hidden sm:block")}>
        <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <Dropdown label="Type" value={type} onChange={setType} options={types} />
          <Dropdown label="Availability" value={avail} onChange={setAvail} options={availOpts} />
          <Dropdown label="Sort" value={sortBy} onChange={setSortBy} options={["A–Z", "Capacity"]} />
          <div className="flex items-center gap-2">
            <FiGlobe className="text-gray-500" />
            <span className="text-sm text-gray-600">Campus:</span>
            <select className="border rounded-lg px-3 py-2 text-sm w-full" defaultValue="Main">
              <option>Main</option>
              <option>City</option>
            </select>
          </div>
          <div className="text-[12px] text-gray-500 flex items-center">Tip: Click a card for details.</div>
        </div>
      </div>

      {/* Cards */}
      <div className="card-in bg-white border rounded-xl">
        <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
          {rows.map((f, i) => (
            <article
              key={f.id}
              className="border rounded-xl overflow-hidden bg-white hover:shadow-sm transition card-in"
              style={{ animationDelay: `${i * 20}ms` }}
            >
              <div className="relative">
                <div className="aspect-video overflow-hidden">
                  <img src={f.image} alt={f.name} className="w-full h-full object-cover img-zoom" loading="lazy" />
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge tone={badgeTone(f.status)}>{f.status}</Badge>
                  <Badge tone="slate">{f.type}</Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold">{f.name}</h3>
                <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                  <FiMapPin /> {f.loc}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <FiClock /> {f.hours}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
                  <Chip icon={<FiUsers />} text={`${f.capacity} capacity`} />
                  <Chip icon={<FiPhone />} text={f.contact} />
                </div>

                <ul className="mt-3 text-sm text-gray-700 space-y-1 list-disc list-inside">
                  {f.amenities.slice(0, 3).map((a) => <li key={a}>{a}</li>)}
                </ul>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm inline-flex items-center justify-center"
                    onClick={() => setOpenId(f.id)}
                  >
                    <FiInfo className="mr-2" /> View
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm inline-flex items-center justify-center"
                    onClick={() => setBookId(f.id)}
                  >
                    <FiCalendar className="mr-2" /> Book Slot
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!rows.length && (
          <div className="px-4 pb-6 text-center text-gray-500">No facilities match your filters.</div>
        )}
      </div>

      {/* Details & Booking */}
      <DetailsModal
        item={rows.find((x) => x.id === openId) || FACILITIES.find((x) => x.id === openId)}
        onClose={() => setOpenId(null)}
      />
      <BookingModal
        item={rows.find((x) => x.id === bookId) || FACILITIES.find((x) => x.id === bookId)}
        onClose={() => setBookId(null)}
      />
    </div>
  );
}

/* -------------------------------- Subcomponents -------------------------------- */
function Summary({ label, value }) {
  return (
    <div className="card-in bg-white border rounded-xl p-3 sm:p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg sm:text-xl font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function Dropdown({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2">
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

function Chip({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border bg-gray-50 text-[12px]">
      {icon} {text}
    </span>
  );
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return <span className={`px-2 py-0.5 border rounded-md text-[11px] ${tones[tone]}`}>{children}</span>;
}

function badgeTone(status) {
  switch (status) {
    case "Open": return "emerald";
    case "Slots Available": return "indigo";
    case "By Booking": return "amber";
    default: return "slate";
  }
}

function DetailsModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="
          absolute left-80 -translate-x-1/2 top-4 sm:top-10
          w-[calc(100%-1.5rem)] sm:w-[calc(100%-4rem)] lg:w-[min(100%-8rem,980px)]
          max-h-[88vh] sm:max-h-[86vh] rounded-xl border bg-white shadow-2xl card-in
          flex flex-col overflow-hidden
        "
        role="dialog" aria-modal="true"
      >
        <div className="p-3 sm:p-4 border-b flex items-center justify-between">
          <div>
            <div className="text-xs sm:text-sm text-gray-500">{item.type} · {item.status}</div>
            <div className="text-base sm:text-lg font-semibold">{item.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2 mt-0.5">
              <FiMapPin /> {item.loc} • <FiClock /> {item.hours}
            </div>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-50" onClick={onClose} aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="w-full aspect-video bg-gray-100">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>

          <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Amenities</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {item.amenities.map((a) => (
                    <span key={a} className="px-2 py-1 rounded-md border bg-gray-50">{a}</span>
                  ))}
                </div>
              </section>

              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Rules</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {item.rules.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </section>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Quick Info</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex items-center gap-2"><FiUsers className="text-gray-500" /> Capacity: {item.capacity}</div>
                  <div className="flex items-center gap-2"><FiPhone className="text-gray-500" /> {item.contact}</div>
                </div>
              </section>

              <section className="p-3 rounded-lg border bg-white">
                <div className="text-sm font-semibold text-gray-800 mb-2">Need to Book?</div>
                <button
                  className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm inline-flex items-center justify-center"
                  onClick={() => alert("Booking is available from the main page via 'Book Slot'.")}
                >
                  <FiCalendar className="mr-2" /> Proceed to Booking
                </button>
              </section>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t flex justify-end">
          <button className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ item, onClose }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState("10:00–12:00");
  const [count, setCount] = useState(10);
  const [purpose, setPurpose] = useState("");

  if (!item) return null;

  const submit = () => {
    alert(
      `Booking requested:\n${item.name}\nDate: ${date}\nSlot: ${slot}\nAttendees: ${count}\nPurpose: ${purpose || "-"}\n\n(This is a demo action.)`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="
          absolute left-80 -translate-x-1/2 top-6 sm:top-14
          w-[calc(100%-1.5rem)] sm:w-[calc(100%-4rem)] lg:w-[min(100%-8rem,720px)]
          rounded-xl border bg-white shadow-2xl card-in
          overflow-hidden
        "
        role="dialog" aria-modal="true"
      >
        <div className="p-3 sm:p-4 border-b flex items-center justify-between">
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Booking · {item.type}</div>
            <div className="text-base sm:text-lg font-semibold">{item.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2 mt-0.5">
              <FiMapPin /> {item.loc}
            </div>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-50" onClick={onClose} aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-600 mb-1">Date</div>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Time Slot</div>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option>08:00–10:00</option>
              <option>10:00–12:00</option>
              <option>12:00–14:00</option>
              <option>14:00–16:00</option>
              <option>16:00–18:00</option>
            </select>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Attendees</div>
            <input
              type="number"
              min={1}
              max={item.capacity}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
            <div className="text-[12px] text-gray-500 mt-1">Max capacity: {item.capacity}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Purpose</div>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g., OSCE dry run, Journal club"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
          <button className="w-full sm:w-auto px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="w-full sm:w-auto px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm inline-flex items-center justify-center" onClick={submit}>
            <FiCheckCircle className="mr-2" /> Request Booking
          </button>
        </div>
      </div>
    </div>
  );
}
