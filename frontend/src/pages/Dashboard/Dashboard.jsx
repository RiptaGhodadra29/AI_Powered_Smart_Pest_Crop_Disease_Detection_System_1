import { useEffect, useMemo, useState } from "react";
import { getDashboardData } from "../../services/dashboardService";
import { getHistory } from "../../services/historyService";

import { Page, PageHeader } from "../../components/ui/Page";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import Skeleton from "../../components/ui/Skeleton";
import Reveal from "../../components/ui/Reveal";
import { AreaChart, Donut, BarList } from "../../components/ui/Charts";
import { useCountUp } from "../../hooks/useCountUp";

const StatCard = ({ icon, label, value, suffix = "", decimals = 0 }) => {
  const display = useCountUp(value, { decimals });

  return (
    <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-200/0 blur-2xl transition-all duration-500 group-hover:bg-brand-200/50"
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <h2 className="text-sm font-medium text-neutral-500">{label}</h2>
      </div>
      <p className="relative mt-4 text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">
        {display}
        {suffix}
      </p>
    </Card>
  );
};

const StatSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-4 w-28" />
    </div>
    <Skeleton className="mt-4 h-9 w-20" />
  </Card>
);

// ---- aggregations from raw history ----
const buildTrend = (items, days = 14) => {
  const today = new Date();
  const buckets = new Map();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  items.forEach((it) => {
    if (!it.created_at) return;
    const key = new Date(it.created_at).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, buckets.get(key) + 1);
  });
  return [...buckets.entries()].map(([label, value]) => ({ label, value }));
};

const buildTypeSplit = (items) => [
  {
    label: "Disease",
    value: items.filter((i) => i.prediction_type === "disease").length,
    color: "#16a34a",
  },
  {
    label: "Pest",
    value: items.filter((i) => i.prediction_type === "pest").length,
    color: "#f59e0b",
  },
];

const buildTopDetections = (items, limit = 5) => {
  const counts = new Map();
  items.forEach((i) => {
    counts.set(i.class_name, (counts.get(i.class_name) || 0) + 1);
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const result = await getDashboardData(1);
        if (mounted) setData(result);
      } catch (error) {
        console.error(error);
      }
    })();

    (async () => {
      try {
        const result = await getHistory(1);
        if (mounted) setHistory(result.history || []);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setHistoryLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const trend = useMemo(() => buildTrend(history), [history]);
  const typeSplit = useMemo(() => buildTypeSplit(history), [history]);
  const topDetections = useMemo(() => buildTopDetections(history), [history]);

  return (
    <Page width="xl">
      <PageHeader
        eyebrow="Overview"
        title="Analytics dashboard"
        description="A snapshot of your detection activity and model performance."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!data ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <Reveal>
              <StatCard
                icon="layers"
                label="Total Predictions"
                value={data.total_predictions}
              />
            </Reveal>
            <Reveal delay={120}>
              <StatCard
                icon="microscope"
                label="Most Detected Disease"
                value={data.most_detected_disease}
              />
            </Reveal>
            <Reveal delay={240}>
              <StatCard
                icon="trendingUp"
                label="Average Confidence"
                value={data.average_confidence}
                suffix="%"
              />
            </Reveal>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader
              icon={<Icon name="trendingUp" className="h-5 w-5" />}
              title="Detections over time"
              description="Last 14 days"
            />
            <CardBody>
              {historyLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <AreaChart data={trend} label="Detections over the last 14 days" />
              )}
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={120}>
          <Card className="h-full">
            <CardHeader
              icon={<Icon name="layers" className="h-5 w-5" />}
              title="By type"
            />
            <CardBody>
              {historyLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <Donut segments={typeSplit} label="Predictions by type" />
              )}
            </CardBody>
          </Card>
        </Reveal>
      </div>

      <div className="mt-6">
        <Reveal>
          <Card>
            <CardHeader
              icon={<Icon name="microscope" className="h-5 w-5" />}
              title="Top detections"
              description="Most frequent classes"
            />
            <CardBody>
              {historyLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                <BarList items={topDetections} />
              )}
            </CardBody>
          </Card>
        </Reveal>
      </div>
    </Page>
  );
};

export default Dashboard;
