import csv
import json
from collections import Counter
from io import BytesIO
from pathlib import Path

from fastapi import HTTPException


BASE_DIR = Path(__file__).resolve().parents[3]
REPORT_RECORDS_CSV_PATH = BASE_DIR / "data" / "reports" / "india_landslides_records.csv"
TRAINING_DATASET_PATH = BASE_DIR / "data" / "raw" / "landslide_dataset.csv"

IMPORTANT_FIELDS = [
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
]

TRAINING_MODEL_NAMES = [
    "Logistic Regression",
    "Random Forest",
    "Gradient Boosting",
    "Neural Network",
]


def _get_training_dataset_stats() -> dict[str, int]:
    if not TRAINING_DATASET_PATH.exists():
        return {"total_rows": 0, "landslide_rows": 0}

    total_rows = 0
    landslide_rows = 0

    try:
        with TRAINING_DATASET_PATH.open("r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for raw in reader:
                total_rows += 1
                value = str(raw.get("Landslide", "")).strip()
                try:
                    if int(float(value)) == 1:
                        landslide_rows += 1
                except ValueError:
                    continue
    except Exception:
        return {"total_rows": 0, "landslide_rows": 0}

    return {"total_rows": total_rows, "landslide_rows": landslide_rows}


def _read_filtered_rows(query: str) -> list[dict[str, str]]:
    if not REPORT_RECORDS_CSV_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Structured report CSV not found: {REPORT_RECORDS_CSV_PATH}",
        )

    normalized_query = (query or "").strip().lower()
    filtered_rows: list[dict[str, str]] = []

    try:
        with REPORT_RECORDS_CSV_PATH.open("r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for raw in reader:
                row_data = {field: (raw.get(field) or "").strip() for field in IMPORTANT_FIELDS}
                searchable_blob = " ".join(row_data.values()).lower()

                if normalized_query and normalized_query not in searchable_blob:
                    continue

                filtered_rows.append(row_data)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to read report data: {exc}") from exc

    return filtered_rows


def get_india_landslides_page(query: str, page: int, page_size: int) -> dict:
    if page < 1:
        raise HTTPException(status_code=422, detail="page must be >= 1")
    if page_size < 1 or page_size > 200:
        raise HTTPException(status_code=422, detail="page_size must be between 1 and 200")

    offset = (page - 1) * page_size
    filtered_rows = _read_filtered_rows(query)
    matched_count = len(filtered_rows)
    paged_rows = filtered_rows[offset : offset + page_size]
    total_pages = (matched_count + page_size - 1) // page_size if matched_count else 0

    return {
        "query": query,
        "page": page,
        "page_size": page_size,
        "total_matches": matched_count,
        "total_pages": total_pages,
        "columns": IMPORTANT_FIELDS,
        "rows": paged_rows,
    }


def build_download_payload(query: str, file_format: str) -> tuple[bytes, str, str]:
    rows = _read_filtered_rows(query)
    suffix = f"_filtered_{query.strip().replace(' ', '_')}" if query.strip() else "_all"

    if file_format == "json":
        payload = json.dumps(rows, ensure_ascii=False, indent=2).encode("utf-8")
        return payload, "application/json", f"india_landslides{suffix}.json"

    if file_format == "csv":
        output = BytesIO()
        text = output.write
        # Build CSV in memory with utf-8 BOM for spreadsheet compatibility.
        csv_str = "\ufeff"
        csv_str += ",".join(IMPORTANT_FIELDS) + "\n"
        for row in rows:
            values = [row.get(field, "").replace('"', '""') for field in IMPORTANT_FIELDS]
            csv_str += ",".join([f'"{value}"' for value in values]) + "\n"
        text(csv_str.encode("utf-8"))
        return output.getvalue(), "text/csv", f"india_landslides{suffix}.csv"

    if file_format == "xlsx":
        try:
            import pandas as pd
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"xlsx export unavailable: {exc}") from exc

        output = BytesIO()
        df = pd.DataFrame(rows, columns=IMPORTANT_FIELDS)
        df.to_excel(output, index=False, engine="openpyxl")
        output.seek(0)
        return (
            output.getvalue(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            f"india_landslides{suffix}.xlsx",
        )

    raise HTTPException(status_code=422, detail="format must be one of: csv, json, xlsx")


def get_india_landslides_analytics(top_n: int = 10) -> dict:
    if top_n < 3 or top_n > 25:
        raise HTTPException(status_code=422, detail="top_n must be between 3 and 25")

    rows = _read_filtered_rows("")
    training_stats = _get_training_dataset_stats()

    total_records = len(rows)
    valid_geo_points = 0
    unknown_state = 0

    state_counter: Counter[str] = Counter()
    material_counter: Counter[str] = Counter()
    movement_counter: Counter[str] = Counter()
    year_counter: Counter[str] = Counter()

    for row in rows:
        state = row.get("State", "").strip() or "Unknown"
        district = row.get("District", "").strip() or "Unknown"
        material = row.get("Material Involved", "").strip() or "Unknown"
        movement = row.get("Movement Type", "").strip() or "Unknown"
        year = row.get("Initiation_Year", "").strip()
        lat = row.get("Latitude", "").strip()
        lon = row.get("Longitude", "").strip()

        state_counter[state] += 1
        material_counter[material] += 1
        movement_counter[movement] += 1

        normalized_year = year.lower()
        is_unknown_year = normalized_year in {
            "",
            "unknown",
            "na",
            "n/a",
            "none",
            "nil",
            "not known",
            "not_known",
            "0",
            "00",
            "0000",
            "0.0",
        }
        if not is_unknown_year:
            year_counter[year] += 1

        if state == "Unknown":
            unknown_state += 1

        try:
            if lat and lon:
                float(lat)
                float(lon)
                valid_geo_points += 1
        except ValueError:
            pass

        # district kept for potential future analytics; counting states is primary here.
        _ = district

    top_states = [
        {"name": name, "count": count}
        for name, count in state_counter.most_common(top_n)
    ]
    top_materials = [
        {"name": name, "count": count}
        for name, count in material_counter.most_common(top_n)
    ]
    top_movements = [
        {"name": name, "count": count}
        for name, count in movement_counter.most_common(top_n)
    ]

    # Keep only 10 most frequent years and sort numerically where possible.
    top_years_raw = year_counter.most_common(10)
    def _year_sort_key(item: tuple[str, int]):
        y = item[0]
        return int(y) if y.isdigit() else 999999

    top_years = [
        {"year": year, "count": count}
        for year, count in sorted(top_years_raw, key=_year_sort_key)
    ]

    return {
        "total_records": total_records,
        "valid_geo_points": valid_geo_points,
        "unknown_state_records": unknown_state,
        "model_count": len(TRAINING_MODEL_NAMES),
        "model_names": TRAINING_MODEL_NAMES,
        "training_rows": training_stats["total_rows"],
        "training_landslide_rows": training_stats["landslide_rows"],
        "india_reported_landslides": total_records,
        "top_states": top_states,
        "top_materials": top_materials,
        "top_movements": top_movements,
        "year_distribution": top_years,
    }
