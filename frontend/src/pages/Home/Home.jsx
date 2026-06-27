import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { Card } from "../../components/ui/Card";
import Reveal from "../../components/ui/Reveal";
import { useLanguage } from "../../context/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: "upload",
      title: t.home_step1_title,
      description: t.home_step1_desc,
    },
    {
      icon: "microscope",
      title: t.home_step2_title,
      description: t.home_step2_desc,
    },
    {
      icon: "clipboard",
      title: t.home_step3_title,
      description: t.home_step3_desc,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-br from-brand-50 via-white to-emerald-50">
        {/* Animated aurora background — purely decorative, GPU-only transforms. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="bg-leaf-pattern mask-fade absolute inset-0 opacity-50" />
          <div className="animate-aurora absolute -left-24 -top-32 h-80 w-80 rounded-full bg-brand-300/40 blur-3xl" />
          <div className="animate-float-slow absolute right-[-6rem] top-10 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="animate-float absolute bottom-[-5rem] left-1/3 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="animate-rise mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-brand-700 shadow-soft backdrop-blur [animation-delay:60ms]">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-brand-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            {t.home_badge}
          </span>

          <h1 className="animate-rise text-balance text-4xl font-bold tracking-tight text-neutral-900 [animation-delay:140ms] sm:text-5xl lg:text-6xl">
            {t.home_title}
          </h1>

          <p className="animate-rise mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 [animation-delay:240ms]">
            {t.home_subtitle}
          </p>

          <div className="animate-rise mt-9 flex flex-col items-center gap-3 [animation-delay:340ms] sm:flex-row">
            <Button as={Link} to="/upload" size="lg" className="w-full sm:w-auto">
              {t.home_getStarted}
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button
              as={Link}
              to="/dashboard"
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Icon name="dashboard" className="h-4 w-4" />
              {t.home_viewDashboard}
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {t.home_howTitle}
          </h2>
          <p className="mt-3 text-neutral-600">
            {t.home_howSubtitle}
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 120}>
              <Card className="group h-full p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-neutral-300 transition-colors duration-300 group-hover:text-brand-400">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {step.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
