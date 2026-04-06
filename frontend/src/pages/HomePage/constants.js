export const INITIAL_ANALYTICS = {
  total_records: 0,
  valid_geo_points: 0,
  unknown_state_records: 0,
  model_count: 0,
  model_names: [],
  training_rows: 0,
  training_landslide_rows: 0,
  india_reported_landslides: 0,
  top_states: [],
  top_materials: [],
  top_movements: [],
  year_distribution: [],
};

export const SLIDE_ITEMS = [
  {
    title: "Hill Corridor Live Monitoring",
    subtitle:
      "Rainfall and slope movement surveillance across vulnerable terrain.",
    image: "/images/landslide/slide-1.svg",
  },
  {
    title: "Hydrometeorological Watch",
    subtitle: "Continuous weather-triggered landslide threat assessment.",
    image: "/images/landslide/slide-2.svg",
  },
  {
    title: "Emergency Coordination Feed",
    subtitle:
      "Command-center view for operational alerting and response planning.",
    image: "/images/landslide/slide-3.svg",
  },
];

export const MAP_ITEMS = [
  {
    title: "India Disaster Map",
    image: "https://bhusanket.gsi.gov.in/pics/LFS/LFS1.jpg",
    note: "Click image to open the official National Landslide Forecasting page.",
    link: "https://bhusanket.gsi.gov.in/lfs.html",
  },
  {
    title: "Uttarakhand Susceptibility",
    image: "/images/maps/uttarakhand_map.png",
    note: "Uttarakhand susceptibility map from the Bhusanket source.",
  },
  {
    title: "Meso Scale (1:10k) Sector Map",
    image: "https://bhusanket.gsi.gov.in/pics/home_page/Sector_Map3.png",
    note: "Click image to open the official Sector Map viewer.",
    link: "https://bhusanket.gsi.gov.in/sectormap.html",
  },
];

export const CHART_COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

export const MOVEMENT_LABELS = {
  slide: {
    short: "Slope Slide",
    desc: "Mass of soil/rock moving down a slope.",
  },
  fall: {
    short: "Rock Fall",
    desc: "Rock fragments falling from steep slopes.",
  },
  flow: {
    short: "Debris Flow",
    desc: "Water-mixed soil/debris flowing downhill.",
  },
  subsidence: {
    short: "Ground Subsidence",
    desc: "Ground surface sinking or settling.",
  },
  composite: {
    short: "Mixed Movement",
    desc: "Combination of multiple movement types.",
  },
  topple: {
    short: "Topple",
    desc: "Forward rotation/fall of rock columns.",
  },
  unknown: {
    short: "Unclassified",
    desc: "Movement type not clearly identified.",
  },
};
