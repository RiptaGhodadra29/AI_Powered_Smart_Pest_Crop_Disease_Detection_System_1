import { Link, useLocation } from "react-router-dom";

import { Page, PageHeader } from "../../components/ui/Page";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Icon from "../../components/ui/Icon";
import EmptyState from "../../components/ui/EmptyState";
import Reveal from "../../components/ui/Reveal";
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

const PredictionResult = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const pageData = location.state;

  if (!pageData) {
    return (
      <Page width="md">
        <Card>
          <EmptyState
            icon="alert"
            title={t.result_empty_title}
            description={t.result_empty_desc}
            action={
              <Button as={Link} to="/upload">
                <Icon name="upload" className="h-4 w-4" />
                {t.goToUpload}
              </Button>
            }
          />
        </Card>
      </Page>
    );
  }

  const imageType = pageData.prediction_type;
  const imagePreview = pageData.imagePreview;
  const recommendation = pageData.recommendation;
  const isPest = imageType === "pest";
  const confTone = confidenceTone(pageData.confidence);

  return (
    <Page width="lg">
      <PageHeader
        eyebrow={t.result_eyebrow}
        title={t.result_title}
        action={
          <Button as={Link} to="/upload" variant="secondary">
            <Icon name="upload" className="h-4 w-4" />
            {t.result_newPrediction}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Image + summary */}
        <Reveal className="lg:col-span-2">
          <Card className="lg:sticky lg:top-24">
            <CardBody className="space-y-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Analyzed crop"
                  className="aspect-square w-full rounded-xl border border-neutral-200 object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-neutral-400">
                  <Icon name="image" className="h-8 w-8" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  {t.result_analysisType}
                </span>
                <Badge tone={isPest ? "warning" : "brand"} icon={<Icon name={isPest ? "bug" : "leaf"} className="h-3.5 w-3.5" />}>
                  {isPest ? t.pest : t.disease}
                </Badge>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* Prediction + recommendation */}
        <div className="space-y-6 lg:col-span-3">
          <Reveal delay={120}>
          <Card>
            <CardHeader
              icon={<Icon name={isPest ? "bug" : "microscope"} className="h-5 w-5" />}
              title={isPest ? t.result_pestDetection : t.result_diseasePrediction}
            />
            <CardBody className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {isPest ? t.pest : t.disease}
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
                  {pageData.prediction_name}
                </p>
              </div>

              {/* Confidence */}
              <ConfidenceMeter
                value={pageData.confidence}
                tone={confTone}
                label={t.result_confidence}
              />

              <div className="flex flex-wrap gap-2">
                {pageData.confidence_level && (
                  <Badge tone={confTone}>
                    {t.result_quality}: {pageData.confidence_level}
                  </Badge>
                )}
                {pageData.model_name && (
                  <Badge tone="neutral" icon={<Icon name="cpu" className="h-3.5 w-3.5" />}>
                    {pageData.model_name}
                  </Badge>
                )}
              </div>
            </CardBody>
          </Card>
          </Reveal>

          {recommendation && (
            <Reveal delay={220}>
            <Card>
              <CardHeader
                icon={<Icon name="clipboard" className="h-5 w-5" />}
                title={t.result_recommendation}
                description={t.result_recommendationDesc}
              />
              <CardBody>
                <dl>
                  <DetailRow icon={isPest ? "bug" : "leaf"} label={isPest ? t.pest : t.disease}>
                    {recommendation.pest_name || recommendation.disease_name}
                  </DetailRow>

                  <DetailRow icon="alert" label={t.result_severity}>
                    <Badge
                      tone={severityTone(
                        recommendation.damage_severity || recommendation.severity
                      )}
                    >
                      {recommendation.damage_severity || recommendation.severity}
                    </Badge>
                  </DetailRow>

                  <DetailRow icon="fileText" label={t.result_descriptionLabel}>
                    {recommendation.description}
                  </DetailRow>

                  <DetailRow icon="shield" label={t.result_treatment}>
                    {recommendation.treatment || recommendation.organic_control}
                  </DetailRow>

                  {recommendation.organic_treatment && (
                    <DetailRow icon="leaf" label={t.result_organicTreatment}>
                      {recommendation.organic_treatment}
                    </DetailRow>
                  )}

                  {recommendation.chemical_treatment && (
                    <DetailRow icon="beaker" label={t.result_chemicalTreatment}>
                      {recommendation.chemical_treatment}
                    </DetailRow>
                  )}

                  {recommendation.preventive_measures && (
                    <DetailRow icon="shield" label={t.result_preventiveMeasures}>
                      {recommendation.preventive_measures}
                    </DetailRow>
                  )}

                  {recommendation.monitoring_actions && (
                    <DetailRow icon="eye" label={t.result_monitoringActions}>
                      {recommendation.monitoring_actions}
                    </DetailRow>
                  )}
                </dl>
              </CardBody>
            </Card>
            </Reveal>
          )}
        </div>
      </div>
    </Page>
  );
};

export default PredictionResult;
