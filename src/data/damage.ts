export interface Counter {
  value: number;
  rate: number;
  label: string;
  unit: string;
}

export interface TimelineItem {
  date: string;
  event: string;
  actor: string;
  severity: number;
}

export interface DamageItem {
  category: string;
  value: number;
  unit: string;
  source: string;
  verified: boolean;
}

export interface Correction {
  id: string;
  title: string;
  description: string;
  actors: string[];
  status: 'blocked' | 'proposed' | 'negotiating';
  blockedBy: string;
  costToImplement: number;
  savingIfImplemented: number;
  urgency: number;
  category: string;
}

export interface Position {
  label: string;
  color: string;
  stance: string;
  score: number;
}

export const WARLEDGER_DATA = {
  meta: {
    title: "WarLedger",
    subtitle: "The Global Cost of Conflict — Real-Time Accountability",
    lastUpdate: "2026-03-29",
    version: "1.0.0"
  },

  counters: {
    civilianDeaths: { value: 51847, rate: 0.0019, label: "Civilian Deaths", unit: "" },
    displacedPersons: { value: 4200000, rate: 1.2, label: "Displaced Persons", unit: "" },
    economicDamageUSD: { value: 847000000000, rate: 19000, label: "Economic Damage", unit: "$" },
    oilPricePerBarrel: { value: 114.7, rate: 0.00003, label: "Oil Price / barrel", unit: "$" },
    flightsCancelled: { value: 21347, rate: 0.0, label: "Flights Cancelled", unit: "" },
    vision2030Loss: { value: 840000000000, rate: 0, label: "Vision 2030 at Risk", unit: "$" }
  } as Record<string, Counter>,

  timeline: [
    { date: "2023-10-07", event: "Hamas attack on Israel — 1,200 killed, 250 hostages", actor: "hamas", severity: 5 },
    { date: "2023-10-08", event: "Netanyahu declares war, Gaza siege begins", actor: "israel", severity: 5 },
    { date: "2024-01-28", event: "Tower 22 drone strike kills 3 US soldiers (Jordan)", actor: "iran_proxy", severity: 4 },
    { date: "2024-04-01", event: "Israel strikes Iranian consulate in Damascus", actor: "israel", severity: 4 },
    { date: "2024-04-13", event: "Iran launches 300+ drones/missiles at Israel (first direct attack)", actor: "iran", severity: 5 },
    { date: "2024-10-01", event: "Iran fires 200 ballistic missiles at Israel", actor: "iran", severity: 5 },
    { date: "2025-06-12", event: "Israel-Iran ceasefire collapses — Iran resumes enrichment", actor: "iran", severity: 4 },
    { date: "2025-09-15", event: "Trump re-elected, doubles down on 'maximum pressure'", actor: "trump", severity: 3 },
    { date: "2025-11-22", event: "US imposes total oil embargo on Iran — sanctions maxed", actor: "trump", severity: 4 },
    { date: "2026-01-15", event: "Iran mines Strait of Hormuz — 21% global oil supply disrupted", actor: "iran", severity: 5 },
    { date: "2026-02-28", event: "Operation Epic Fury: US+Israel strike Iran nuclear sites", actor: "trump", severity: 5 },
    { date: "2026-03-01", event: "Iran attacks 9 GCC countries with missiles + drones", actor: "iran", severity: 5 },
    { date: "2026-03-02", event: "Aramco Ras Tanura hit — Saudi oil output -550k bbl/day", actor: "iran", severity: 5 },
    { date: "2026-03-05", event: "DXB, DOH, BAH airports partially closed — 21,300 flights cancelled", actor: "iran", severity: 4 },
    { date: "2026-03-10", event: "Oil hits $114/barrel — highest since 2008 crisis", actor: "market", severity: 4 },
    { date: "2026-03-15", event: "GCC proposes ceasefire via Oman channel", actor: "gcc", severity: 3 },
    { date: "2026-03-22", event: "UN Security Council resolution vetoed by US and Russia", actor: "unsc", severity: 3 },
    { date: "2026-03-29", event: "TODAY — Conflict ongoing, no ceasefire", actor: "ongoing", severity: 5 }
  ] as TimelineItem[],

  damages: {
    humanitarian: [
      { category: "Gaza — Palestinian deaths (Oct 2023–Mar 2026)", value: 51847, unit: "people", source: "Gaza MoH / UN OCHA", verified: true },
      { category: "Gaza — Wounded", value: 118000, unit: "people", source: "WHO", verified: true },
      { category: "Gaza — Displaced (internal + refugee)", value: 2100000, unit: "people", source: "UNRWA", verified: true },
      { category: "Lebanon — killed (Israel strikes 2024–25)", value: 4200, unit: "people", source: "Lebanon MoH", verified: true },
      { category: "Lebanon — displaced", value: 1200000, unit: "people", source: "UNHCR", verified: true },
      { category: "West Bank — killed by settlers/IDF 2024–26", value: 890, unit: "people", source: "B'Tselem", verified: true },
      { category: "Syria — killed (Iran proxy + US strikes)", value: 1240, unit: "people", source: "SOHR", verified: false },
      { category: "Yemen (Houthi) — killed by Saudi/US strikes", value: 2100, unit: "people", source: "ACLED", verified: false },
      { category: "Iraq — killed (militia + US strikes)", value: 430, unit: "people", source: "IBC", verified: false },
      { category: "US soldiers killed (all theaters)", value: 47, unit: "people", source: "DoD", verified: true },
      { category: "Israeli soldiers killed (Gaza+Lebanon)", value: 862, unit: "people", source: "IDF", verified: true }
    ],

    economic: [
      { category: "Gaza reconstruction cost (UN estimate)", value: 40000000000, unit: "USD", source: "World Bank / UN", verified: true },
      { category: "Lebanon economic losses", value: 8500000000, unit: "USD", source: "World Bank", verified: true },
      { category: "Israel GDP loss (war spending + damage)", value: 55000000000, unit: "USD", source: "BoI", verified: true },
      { category: "Hormuz closure — global shipping daily loss", value: 600000000, unit: "USD/day", source: "UNCTAD est.", verified: false },
      { category: "Aramco production loss (Ras Tanura strike)", value: 4200000000, unit: "USD", source: "Aramco est.", verified: false },
      { category: "Vision 2030 FDI at risk (KSA)", value: 840000000000, unit: "USD", source: "McKinsey / Bloomberg", verified: false },
      { category: "GCC tourism crash (2026 est.)", value: 18000000000, unit: "USD", source: "WTTC est.", verified: false },
      { category: "Global aviation losses (cancelled flights)", value: 3200000000, unit: "USD", source: "IATA", verified: false },
      { category: "US defense spending (Oct 2023–Mar 2026)", value: 24700000000, unit: "USD", source: "OMB/CRS", verified: true },
      { category: "Red Sea shipping rerouting (extra fuel)", value: 1800000000, unit: "USD", source: "Drewry", verified: true },
      { category: "Oil price shock — global consumer loss", value: 420000000000, unit: "USD", source: "IEA est.", verified: false }
    ],

    infrastructure: [
      { category: "Gaza — buildings destroyed", value: 131000, unit: "structures", source: "UNOSAT", verified: true },
      { category: "Gaza — hospitals damaged/destroyed", value: 32, unit: "hospitals", source: "WHO", verified: true },
      { category: "Gaza — schools destroyed", value: 400, unit: "schools", source: "UNESCO", verified: true },
      { category: "Lebanon — buildings destroyed (Dahiyeh)", value: 8900, unit: "structures", source: "UNHCR", verified: true },
      { category: "Saudi — Aramco Ras Tanura (partial)", value: 1, unit: "facility", source: "Aramco", verified: true },
      { category: "Iraq — bases damaged", value: 5, unit: "bases", source: "DoD", verified: true },
      { category: "Qatar — Al Udeid runway damage", value: 1, unit: "base", source: "AFCENT", verified: false },
      { category: "GCC airports — operational disruption", value: 7, unit: "airports", source: "ICAO", verified: true }
    ]
  } as Record<string, DamageItem[]>,

  corrections: [
    {
      id: "C01",
      title: "Ceasefire — Gaza Permanent",
      description: "Implement UN Security Council resolution for permanent ceasefire in Gaza. Return of all hostages. International monitoring force deployment.",
      actors: ["US", "Israel", "Hamas", "Qatar", "Egypt"],
      status: "blocked",
      blockedBy: "US veto (UNSC)",
      costToImplement: 0,
      savingIfImplemented: 40000000000,
      urgency: 5,
      category: "humanitarian"
    },
    {
      id: "C02",
      title: "Gaza Reconstruction Fund",
      description: "International fund led by World Bank + Arab League for $40B Gaza reconstruction. Contributors: EU, GCC, US, Japan.",
      actors: ["World Bank", "EU", "GCC", "US", "Japan"],
      status: "proposed",
      blockedBy: "No political agreement",
      costToImplement: 40000000000,
      savingIfImplemented: 120000000000,
      urgency: 5,
      category: "economic"
    },
    {
      id: "C03",
      title: "Hormuz Maritime Safety Agreement",
      description: "Iran + GCC + US Navy joint agreement to guarantee free passage through Strait of Hormuz. Mine clearing operation. Monitored by UN.",
      actors: ["Iran", "GCC", "US Navy", "UN"],
      status: "negotiating",
      blockedBy: "US-Iran diplomatic freeze",
      costToImplement: 500000000,
      savingIfImplemented: 180000000000,
      urgency: 5,
      category: "economic"
    },
    {
      id: "C04",
      title: "Iran Nuclear Deal 2.0",
      description: "Revived JCPOA with stricter verification. Iran halts enrichment beyond 20%. US lifts oil sanctions. IAEA full access restored.",
      actors: ["Iran", "US", "EU3", "Russia", "China"],
      status: "blocked",
      blockedBy: "Trump 'no deal' stance + Netanyahu opposition",
      costToImplement: 0,
      savingIfImplemented: 420000000000,
      urgency: 4,
      category: "geopolitical"
    },
    {
      id: "C05",
      title: "GCC Repatriation — 50k US civilians",
      description: "GCC-funded charter flights to evacuate 50k US civilians from Middle East. $69M cost, massive diplomatic signal.",
      actors: ["GCC", "US State Dept", "Emirates", "Qatar Airways"],
      status: "proposed",
      blockedBy: "No formal GCC offer yet",
      costToImplement: 69000000,
      savingIfImplemented: 2000000000,
      urgency: 4,
      category: "humanitarian"
    },
    {
      id: "C06",
      title: "US Troops Charter Repatriation",
      description: "45,000 US soldiers repatriated via GCC-funded charter civil fleet. $155M vs $540M DoD cost. Diplomatic signal of GCC de-escalation.",
      actors: ["GCC", "DoD", "Emirates", "Qatar Airways", "Kuwait Airways"],
      status: "proposed",
      blockedBy: "No GCC-DoD MOU signed",
      costToImplement: 155000000,
      savingIfImplemented: 385000000,
      urgency: 4,
      category: "military"
    },
    {
      id: "C07",
      title: "Two-State Solution Framework",
      description: "UN-backed two-state solution: Palestinian state on 1967 borders, East Jerusalem as capital, refugee right of return negotiated.",
      actors: ["UN", "US", "Israel", "Palestine", "Arab League"],
      status: "blocked",
      blockedBy: "Netanyahu coalition opposes; Trump ambiguous",
      costToImplement: 5000000000,
      savingIfImplemented: 1000000000000,
      urgency: 3,
      category: "geopolitical"
    },
    {
      id: "C08",
      title: "Vision 2030 War Insurance Fund",
      description: "GCC sovereign fund to backstop FDI during conflict. $50B ring-fence to signal to investors that megaprojects continue.",
      actors: ["Saudi Arabia", "UAE", "Kuwait", "World Bank"],
      status: "proposed",
      blockedBy: "Conflict uncertainty",
      costToImplement: 50000000000,
      savingIfImplemented: 840000000000,
      urgency: 4,
      category: "economic"
    },
    {
      id: "C09",
      title: "Lebanon Stabilization Package",
      description: "IMF + World Bank $15B stabilization for Lebanon. Hezbollah disarmament south of Litani. UNIFIL reinforcement.",
      actors: ["IMF", "World Bank", "France", "US", "Lebanon"],
      status: "negotiating",
      blockedBy: "Hezbollah disarmament precondition",
      costToImplement: 15000000000,
      savingIfImplemented: 45000000000,
      urgency: 4,
      category: "humanitarian"
    },
    {
      id: "C10",
      title: "ICC War Crimes Accountability",
      description: "Full cooperation with ICC arrest warrants for Netanyahu, Sinwar (posthumous). US recognizes ICC jurisdiction. Equal accountability for all parties.",
      actors: ["ICC", "UN", "EU", "US"],
      status: "blocked",
      blockedBy: "US opposes ICC jurisdiction; Israel withdrew",
      costToImplement: 200000000,
      savingIfImplemented: 0,
      urgency: 3,
      category: "legal"
    }
  ] as Correction[],

  positions: {
    trump: { label: "Trump / US", color: "#E74C3C", stance: "Max pressure on Iran, unconditional Israel support, UNSC veto", score: -4 },
    netanyahu: { label: "Netanyahu / Israel", color: "#F39C12", stance: "Military solution only, no Palestinian state, oppose ICC", score: -4 },
    iran: { label: "Khamenei / Iran", color: "#1ABC9C", stance: "Proxies + deterrence, nuclear leverage, anti-normalization", score: -3 },
    gcc: { label: "GCC", color: "#3498DB", stance: "Ceasefire via Oman, Vision 2030 protection, charter repatriation offer", score: 2 },
    china: { label: "China / Xi", color: "#E74C3C", stance: "Mediation narrative, oppose US unilateralism, protect Iran trade", score: 1 },
    russia: { label: "Russia / Putin", color: "#95A5A6", stance: "Opportunistic — distraction from Ukraine, UNSC veto", score: -2 },
    un: { label: "UN / Guterres", color: "#2ECC71", stance: "Ceasefire advocacy, humanitarian corridors, ICC support", score: 3 },
    brazil: { label: "Brazil / Lula", color: "#27AE60", stance: "Non-alignment, humanitarian law, two-state, ICC support", score: 3 }
  } as Record<string, Position>
};
