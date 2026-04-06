import AnalyticsSection from "./HomePage/AnalyticsSection";
import HeroSliderSection from "./HomePage/HeroSliderSection";
import MapsSection from "./HomePage/MapsSection";
import StatsSection from "./HomePage/StatsSection";
import { MAP_ITEMS, SLIDE_ITEMS } from "./HomePage/constants";
import { useHomeAnalytics } from "./HomePage/useHomeAnalytics";

export default function HomePage() {
  const {
    analytics,
    loadingStats,
    statsError,
    derivedStats,
    movementChartData,
  } = useHomeAnalytics();

  return (
    <main className="portal-home">
      <HeroSliderSection slideItems={SLIDE_ITEMS} />
      <StatsSection derivedStats={derivedStats} />
      <AnalyticsSection
        loadingStats={loadingStats}
        statsError={statsError}
        analytics={analytics}
        movementChartData={movementChartData}
      />
      <MapsSection mapItems={MAP_ITEMS} />
    </main>
  );
}
