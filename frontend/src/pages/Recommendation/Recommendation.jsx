import { Link, useLocation } from "react-router-dom";

import { Page, PageHeader } from "../../components/ui/Page";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import EmptyState from "../../components/ui/EmptyState";
import Reveal from "../../components/ui/Reveal";
import { useLanguage } from "../../context/LanguageContext";

const severityTone = (severity) =>
  severity === "High"
    ? "danger"
    : severity === "Medium"
    ? "warning"
    : "success";

const Recommendation = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const sections = [
    { key: "description", title: t.rec_description, icon: "fileText" },
    { key: "treatment", title: t.rec_treatment, icon: "shield" },
    { key: "organic_treatment", title: t.rec_organicTreatment, icon: "leaf" },
    { key: "chemical_treatment", title: t.rec_chemicalTreatment, icon: "beaker" },
    { key: "preventive_measures", title: t.rec_preventiveMeasures, icon: "shield" },
    { key: "monitoring_actions", title: t.rec_monitoringActions, icon: "eye" },
  ];

  const recommendation =
    location.state ||
    JSON.parse(sessionStorage.getItem("recommendation"));

  if (!recommendation) {
    return (
      <Page width="md">
        <Card>
          <EmptyState
            icon="clipboard"
            title={t.rec_empty_title}
            description={t.rec_empty_desc}
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

  return (
    <Page width="lg">
      <PageHeader eyebrow={t.rec_eyebrow} title={t.rec_title} />

      <div className="space-y-6">
        {/* Summary */}
        <Card>
          <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name="leaf" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {t.rec_diseaseLabel}
                </p>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight text-neutral-900">
                  {recommendation.disease_name}
                </h2>
              </div>
            </div>
            <Badge
              tone={severityTone(recommendation.severity)}
              icon={<Icon name="alert" className="h-3.5 w-3.5" />}
              className="self-start px-3 py-1.5 text-sm sm:self-center"
            >
              {recommendation.severity} {t.rec_severitySuffix}
            </Badge>
          </CardBody>
        </Card>

        {/* Detail sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section, index) => (
            <Reveal key={section.key} delay={index * 90}>
              <Card className="group h-full transition-shadow duration-300 hover:shadow-card">
                <CardHeader
                  icon={
                    <Icon
                      name={section.icon}
                      className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    />
                  }
                  title={section.title}
                />
                <CardBody>
                  <p className="text-sm leading-relaxed text-neutral-700">
                    {recommendation[section.key] || "—"}
                  </p>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </Page>
  );
};

export default Recommendation;
