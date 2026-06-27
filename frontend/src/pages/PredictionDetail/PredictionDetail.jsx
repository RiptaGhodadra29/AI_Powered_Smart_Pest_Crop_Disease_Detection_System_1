import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getPredictionDetail,
  deletePrediction,
} from "../../services/historyService";

import { Page, PageHeader } from "../../components/ui/Page";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Icon from "../../components/ui/Icon";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import AnimatedBar from "../../components/ui/AnimatedBar";
import { useCountUp } from "../../hooks/useCountUp";
import { useLanguage } from "../../context/LanguageContext";

const severityTone = (value) => {
  const v = String(value || "").toLowerCase();
  if (v.includes("high") || v.includes("severe")) return "danger";
  if (v.includes("medium") || v.includes("moderate")) return "warning";
  if (v.includes("low") || v.includes("mild")) return "success";
  return "neutral";
};

const confidenceTone = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return "neutral";
  if (n >= 80) return "success";
  if (n >= 50) return "warning";
  return "danger";
};

const barColor = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  neutral: "bg-neutral-400",
};

const ConfidenceMeter = ({ value, tone, label = "Confidence" }) => {
  const count = useCountUp(value, { duration: 1200 });
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-600">{label}</span>
        <span className="font-semibold tabular-nums text-neutral-900">
          {count}%
        </span>
      </div>
      <AnimatedBar value={value} label={label} barClassName={barColor[tone]} />
    </div>
  );
};

const DetailRow = ({ icon, label, children }) => (
  <div className="flex gap-3 border-b border-neutral-100 py-3 last:border-0">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
      <Icon name={icon} className="h-4 w-4" />
    </span>
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm leading-relaxed text-neutral-800">
        {children}
      </dd>
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className="grid gap-6 lg:grid-cols-5">
    <div className="lg:col-span-2">
      <Card>
        <CardBody className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-6 w-32" />
        </CardBody>
      </Card>
    </div>
    <div className="lg:col-span-3">
      <Card>
        <CardBody className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardBody>
      </Card>
    </div>
  </div>
);

const PredictionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const detail = await getPredictionDetail(id);
        if (mounted) setData(detail);
      } catch (error) {
        console.error(error);
        if (mounted) setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(t.detail_confirmDelete)) return;
    setDeleting(true);
    try {
      await deletePrediction(id);
      toast.success(t.detail_deleted);
      navigate("/history");
    } catch (error) {
      console.error(error);
      toast.error(t.detail_deleteFailed);
      setDeleting(false);
    }
  };

  if (notFound || (!loading && !data)) {
    return (
      <Page width="md">
        <Card>
          <EmptyState
            icon="alert"
            title={t.detail_notFound_title}
            description={t.detail_notFound_desc}
            action={
              <Button as={Link} to="/history">
                <Icon name="history" className="h-4 w-4" />
                {t.detail_backToHistory}
              </Button>
            }
          />
        </Card>
      </Page>
    );
  }

  const isPest = data?.prediction_type === "pest";
  const rec = data?.recommendation;
  const confTone = confidenceTone(data?.confidence);

  return (
    <Page width="lg">
      <PageHeader
        eyebrow={t.detail_eyebrow}
        title={t.detail_title}
        action={
          <div className="flex items-center gap-2 print:hidden">
            <Button as={Link} to="/history" variant="ghost">
              <Icon name="arrowLeft" className="h-4 w-4" />
              {t.back}
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              <Icon name="printer" className="h-4 w-4" />
              {t.print}
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              <Icon name="trash" className="h-4 w-4" />
              {t.delete}
            </Button>
          </div>
        }
      />

      {loading ? (
        <DetailSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Summary */}
          <div className="lg:col-span-2">
            <Card className="lg:sticky lg:top-24">
              <CardHeader
                icon={
                  <Icon
                    name={isPest ? "bug" : "microscope"}
                    className="h-5 w-5"
                  />
                }
                title={isPest ? t.result_pestDetection : t.result_diseasePrediction}
              />
              <CardBody className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    {isPest ? t.pest : t.disease}
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
                    {data.class_name}
                  </p>
                </div>

                <ConfidenceMeter
                  value={data.confidence}
                  tone={confTone}
                  label={t.result_confidence}
                />

                <div className="flex flex-wrap gap-2">
                  <Badge
                    tone={isPest ? "warning" : "brand"}
                    icon={
                      <Icon
                        name={isPest ? "bug" : "leaf"}
                        className="h-3.5 w-3.5"
                      />
                    }
                  >
                    {isPest ? t.pest : t.disease}
                  </Badge>
                  <Badge
                    tone="neutral"
                    icon={<Icon name="cpu" className="h-3.5 w-3.5" />}
                  >
                    {data.model_name}
                  </Badge>
                  <Badge
                    tone="neutral"
                    icon={<Icon name="calendar" className="h-3.5 w-3.5" />}
                  >
                    {data.created_at
                      ? new Date(data.created_at).toLocaleString()
                      : "—"}
                  </Badge>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recommendation */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader
                icon={<Icon name="clipboard" className="h-5 w-5" />}
                title={t.result_recommendation}
                description={t.result_recommendationDesc}
              />
              <CardBody>
                {rec ? (
                  <dl>
                    {rec.disease_name && (
                      <DetailRow icon={isPest ? "bug" : "leaf"} label={t.result_name}>
                        {rec.disease_name}
                      </DetailRow>
                    )}
                    {rec.severity && (
                      <DetailRow icon="alert" label={t.result_severity}>
                        <Badge tone={severityTone(rec.severity)}>
                          {rec.severity}
                        </Badge>
                      </DetailRow>
                    )}
                    {rec.description && (
                      <DetailRow icon="fileText" label={t.result_descriptionLabel}>
                        {rec.description}
                      </DetailRow>
                    )}
                    {rec.treatment && (
                      <DetailRow icon="shield" label={t.result_treatment}>
                        {rec.treatment}
                      </DetailRow>
                    )}
                    {rec.organic_treatment && (
                      <DetailRow icon="leaf" label={t.result_organicTreatment}>
                        {rec.organic_treatment}
                      </DetailRow>
                    )}
                    {rec.chemical_treatment && (
                      <DetailRow icon="beaker" label={t.result_chemicalTreatment}>
                        {rec.chemical_treatment}
                      </DetailRow>
                    )}
                    {rec.preventive_measures && (
                      <DetailRow icon="shield" label={t.result_preventiveMeasures}>
                        {rec.preventive_measures}
                      </DetailRow>
                    )}
                    {rec.monitoring_actions && (
                      <DetailRow icon="eye" label={t.result_monitoringActions}>
                        {rec.monitoring_actions}
                      </DetailRow>
                    )}
                  </dl>
                ) : (
                  <EmptyState
                    icon="clipboard"
                    title={t.detail_noRecommendation_title}
                    description={t.detail_noRecommendation_desc}
                  />
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </Page>
  );
};

export default PredictionDetail;
