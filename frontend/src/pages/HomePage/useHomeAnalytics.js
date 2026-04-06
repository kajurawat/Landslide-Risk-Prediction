import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../config";
import { INITIAL_ANALYTICS, MOVEMENT_LABELS } from "./constants";

export function useHomeAnalytics() {
  const [analytics, setAnalytics] = useState(INITIAL_ANALYTICS);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoadingStats(true);
        setStatsError("");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/india-landslides/analytics?top_n=8`,
        );
        const isJson = (response.headers.get("content-type") || "").includes(
          "application/json",
        );
        const body = isJson ? await response.json() : null;

        if (!response.ok) {
          throw new Error(
            `Failed to fetch landslide analytics (${response.status})`,
          );
        }

        if (!cancelled) {
          setAnalytics({
            total_records: body?.total_records ?? 0,
            valid_geo_points: body?.valid_geo_points ?? 0,
            unknown_state_records: body?.unknown_state_records ?? 0,
            model_count: body?.model_count ?? 0,
            model_names: Array.isArray(body?.model_names)
              ? body.model_names
              : [],
            training_rows: body?.training_rows ?? 0,
            training_landslide_rows: body?.training_landslide_rows ?? 0,
            india_reported_landslides: body?.india_reported_landslides ?? 0,
            top_states: Array.isArray(body?.top_states) ? body.top_states : [],
            top_materials: Array.isArray(body?.top_materials)
              ? body.top_materials
              : [],
            top_movements: Array.isArray(body?.top_movements)
              ? body.top_movements
              : [],
            year_distribution: Array.isArray(body?.year_distribution)
              ? body.year_distribution
              : [],
          });
        }
      } catch (error) {
        if (!cancelled) {
          setStatsError(error?.message || "Unable to load landslide analytics");
        }
      } finally {
        if (!cancelled) {
          setLoadingStats(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const derivedStats = useMemo(() => {
    const total = analytics.total_records || 0;
    const geo = analytics.valid_geo_points || 0;
    const unknown = analytics.unknown_state_records || 0;

    return {
      modelCount: analytics.model_count || 0,
      modelNames: analytics.model_names || [],
      trainingRows: analytics.training_rows || 0,
      trainingLandslideRows: analytics.training_landslide_rows || 0,
      indiaLandslideRecords: analytics.india_reported_landslides || total,
      geoCoverage: total ? (geo / total) * 100 : 0,
      unknownRows: unknown,
    };
  }, [analytics]);

  const movementChartData = useMemo(() => {
    const total = analytics.top_movements.reduce(
      (sum, item) => sum + Number(item.count || 0),
      0,
    );

    return analytics.top_movements.map((item) => {
      const key = String(item.name || "").toLowerCase();
      const friendly = MOVEMENT_LABELS[key] || {
        short: item.name,
        desc: "General landslide movement category.",
      };
      const count = Number(item.count || 0);

      return {
        ...item,
        count,
        displayName: friendly.short,
        description: friendly.desc,
        share: total ? (count / total) * 100 : 0,
      };
    });
  }, [analytics.top_movements]);

  return {
    analytics,
    loadingStats,
    statsError,
    derivedStats,
    movementChartData,
  };
}
