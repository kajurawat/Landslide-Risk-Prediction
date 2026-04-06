export const DEFAULT_PAGE_SIZE = 25;

export const IMPORTANT_COLUMNS = [
  "S.No",
  "Latitude",
  "Longitude",
  "Slide_Name",
  "State",
  "District",
  "Subdivision Or Taluk",
  "Material Involved",
  "Movement Type",
  "Initiation_Year",
  "History_date",
];

export const INITIAL_RESULT = {
  query: "",
  page: 1,
  page_size: DEFAULT_PAGE_SIZE,
  total_matches: 0,
  total_pages: 0,
  columns: IMPORTANT_COLUMNS,
  rows: [],
};

export const PAGE_SIZE_OPTIONS = [25, 50, 100];

export const DOWNLOAD_FORMATS = ["csv", "xlsx", "json"];
