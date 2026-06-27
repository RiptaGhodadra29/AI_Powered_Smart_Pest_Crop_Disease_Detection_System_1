import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getHistory,
  deletePrediction,
} from "../../services/historyService";
import { exportToCsv } from "../../utils/exportCsv";

import { Page, PageHeader } from "../../components/ui/Page";
import { Card } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import AnimatedBar from "../../components/ui/AnimatedBar";
import { cn } from "../../components/ui/cn";

const columns = ["ID", "Type", "Prediction", "Confidence", "Model", "Date", ""];
const PAGE_SIZE = 8;
const filters = [
  { key: "all", label: "All" },
  { key: "disease", label: "Disease" },
  { key: "pest", label: "Pest" },
];

const ConfidenceCell = ({ value }) => {
  const n = Number(value);
  const color =
    n >= 80 ? "bg-emerald-500" : n >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-16">
        <AnimatedBar
          value={value}
          className="h-1.5"
          barClassName={color}
          label={`Confidence ${value}%`}
        />
      </div>
      <span className="tabular-nums text-sm font-medium text-neutral-700">
        {value}%
      </span>
    </div>
  );
};

const History = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getHistory(1);
        if (mounted) setHistory(data.history);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Reset to the first page whenever the result set changes.
  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  const handleFilterChange = (value) => {
    setTypeFilter(value);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((item) => {
      const matchesType =
        typeFilter === "all" || item.prediction_type === typeFilter;
      const matchesQuery =
        !q ||
        item.class_name?.toLowerCase().includes(q) ||
        item.model_name?.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [history, query, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this prediction? This cannot be undone."))
      return;

    setDeletingId(id);
    try {
      await deletePrediction(id);
      setHistory((prev) => prev.filter((p) => p.prediction_id !== id));
      toast.success("Prediction deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete prediction");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.info("Nothing to export");
      return;
    }
    exportToCsv(
      "prediction-history.csv",
      filtered.map((item) => ({
        id: item.prediction_id,
        type: item.prediction_type,
        prediction: item.class_name,
        confidence: item.confidence,
        model: item.model_name,
        date: item.created_at
          ? new Date(item.created_at).toLocaleString()
          : "",
      })),
      [
        { key: "id", label: "ID" },
        { key: "type", label: "Type" },
        { key: "prediction", label: "Prediction" },
        { key: "confidence", label: "Confidence (%)" },
        { key: "model", label: "Model" },
        { key: "date", label: "Date" },
      ]
    );
    toast.success("Exported to CSV");
  };

  return (
    <Page width="xl">
      <PageHeader
        eyebrow="Activity"
        title="Prediction history"
        description="Search, filter and manage your past pest and disease detections."
        action={
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={loading || filtered.length === 0}
          >
            <Icon name="download" className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search prediction or model…"
            aria-label="Search history"
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-900 shadow-soft transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>

        {/* Segmented type filter */}
        <div
          role="tablist"
          aria-label="Filter by type"
          className="inline-flex rounded-xl border border-neutral-200 bg-white p-1 shadow-soft"
        >
          {filters.map((f) => {
            const active = typeFilter === f.key;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={active}
                onClick={() => handleFilterChange(f.key)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-brand-600 text-white shadow-soft"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageRows.length > 0 ? (
                pageRows.map((item, index) => {
                  const isPest = item.prediction_type === "pest";
                  return (
                    <tr
                      key={item.prediction_id}
                      onClick={() =>
                        navigate(`/history/${item.prediction_id}`)
                      }
                      className="animate-rise cursor-pointer transition-colors duration-150 hover:bg-neutral-50/80"
                      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-neutral-400">
                        #{item.prediction_id}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          tone={isPest ? "warning" : "brand"}
                          icon={
                            <Icon
                              name={isPest ? "bug" : "leaf"}
                              className="h-3.5 w-3.5"
                            />
                          }
                        >
                          <span className="capitalize">
                            {item.prediction_type}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-5 py-4 font-medium text-neutral-900">
                        {item.class_name}
                      </td>
                      <td className="px-5 py-4">
                        <ConfidenceCell value={item.confidence} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-neutral-600">
                        {item.model_name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-neutral-500">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) =>
                            handleDelete(e, item.prediction_id)
                          }
                          disabled={deletingId === item.prediction_id}
                          aria-label={`Delete prediction ${item.prediction_id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      icon="history"
                      title={
                        history.length === 0
                          ? "No prediction history yet"
                          : "No results match your filters"
                      }
                      description={
                        history.length === 0
                          ? "Once you run a detection, your results will appear here."
                          : "Try a different search term or filter."
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between gap-4 border-t border-neutral-100 px-5 py-3.5">
            <p className="text-sm text-neutral-500">
              Showing{" "}
              <span className="font-medium text-neutral-700">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-neutral-700">
                {filtered.length}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="chevronLeft" className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm tabular-nums text-neutral-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="chevronRight" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </Page>
  );
};

export default History;
