// CivIQ synthetic civic dataset — Hyderabad wards
// In production this is replaced by BigQuery views / Looker models fed from
// real sensor, transit, utility and citizen-feedback pipelines.

const ZONES = ["Banjara Hills", "Gachibowli", "Secunderabad", "Kukatpally", "LB Nagar"];

const AQI_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const AQI_DATA = {
  "Banjara Hills":   [92, 98, 101, 95, 88, 90, 93],
  "Gachibowli":      [110, 118, 125, 140, 162, 158, 145],
  "Secunderabad":    [130, 128, 135, 132, 138, 141, 137],
  "Kukatpally":      [105, 109, 112, 118, 121, 119, 115],
  "LB Nagar":        [95, 99, 102, 100, 97, 101, 98]
};
// Gachibowli AQI spikes Thu/Fri — this is the planted anomaly (construction dust + low wind)

const ENERGY_HOURS = ["00", "03", "06", "09", "12", "15", "18", "21", "24"];
const ENERGY_FORECAST = {
  "Banjara Hills":  [40, 35, 38, 62, 70, 68, 88, 95, 60],
  "Gachibowli":      [55, 48, 52, 80, 92, 90, 110, 118, 75],
  "Secunderabad":    [50, 44, 47, 75, 85, 82, 100, 108, 70],
  "Kukatpally":      [45, 40, 42, 68, 78, 75, 96, 104, 65],
  "LB Nagar":        [38, 33, 36, 58, 66, 64, 84, 90, 56]
};
const GRID_SAFE_CAPACITY = 100; // arbitrary unit threshold per zone

const TRANSIT_CORRIDORS = [
  "ORR — Gachibowli Loop",
  "Begumpet — Secunderabad",
  "Kukatpally — Miyapur",
  "LB Nagar — Dilsukhnagar",
  "Banjara Hills — Jubilee Hills"
];
const TRANSIT_DELAYS = [38, 14, 22, 27, 11]; // minutes avg delay
const TRANSIT_THRESHOLD = 30; // anomaly if delay exceeds this

const COMPLAINT_CATEGORIES = ["Water supply", "Road/potholes", "Streetlights", "Waste collection", "Drainage"];
const COMPLAINT_COUNTS = [142, castInt(210), 88, 156, 174];
function castInt(n){ return n; }

const KPIS = [
  { label: "City-wide avg AQI", value: 121, unit: "", sub: "+14 vs last week", status: "warn", ticket: "ENV-01" },
  { label: "Peak grid load (forecast)", value: 118, unit: "%", sub: "Gachibowli nearing capacity at 18:00", status: "crit", ticket: "PWR-04" },
  { label: "Avg transit delay", value: 22.4, unit: " min", sub: "ORR corridor flagged anomalous", status: "warn", ticket: "TRN-09" },
  { label: "Open citizen requests", value: 770, unit: "", sub: "Road/potholes leading category", status: "ok", ticket: "CIT-12" }
];

const ANOMALIES = [
  { level: "crit", zone: "Gachibowli", text: "AQI rose <b>43 points</b> over 3 days (118 → 162), correlating with active construction sites and low wind speed (under 4 km/h). Pattern matches a known dust-suspension signature." },
  { level: "crit", zone: "Gachibowli", text: "Forecast electricity load reaches <b>118% of safe capacity</b> at 18:00–21:00, driven by commercial AC load plus EV charging peak overlap." },
  { level: "warn", zone: "ORR Loop", text: "Transit delay on the ORR — Gachibowli Loop is <b>38 minutes</b>, 27% above the 5-corridor average, consistent for 4 consecutive days — signals a structural bottleneck, not a one-off incident." },
  { level: "warn", zone: "Kukatpally", text: "Road/potholes complaints rose <b>31% week-on-week</b>, concentrated in a 2km radius near a recent water-pipeline repair — likely resurfacing left incomplete." },
  { level: "ok", zone: "Banjara Hills", text: "All monitored indicators within normal range; AQI and grid load trending flat." }
];

const RECOMMENDATIONS = [
  "Issue a temporary dust-suppression order (water sprinkling, speed caps) for active Gachibowli construction sites during low-wind hours (6–10am), where AQI exceedance risk is highest.",
  "Pre-emptively shift 10–15% of Gachibowli's commercial cooling load to off-peak hours via demand-response signaling, to avoid the forecast 18:00 grid breach.",
  "Deploy a temporary signal-timing adjustment on the ORR — Gachibowli Loop during 8–10am and 6–8pm; sustained 4-day delay pattern indicates a fixable junction bottleneck rather than ad-hoc congestion.",
  "Dispatch a road-quality inspection crew to the Kukatpally pipeline-repair zone within 5 days; complaint clustering suggests incomplete resurfacing, and early fix avoids compounding repair cost.",
  "Publish a same-week public AQI advisory for Gachibowli residents (especially outdoor workers and schools), given the sustained upward trend."
];
