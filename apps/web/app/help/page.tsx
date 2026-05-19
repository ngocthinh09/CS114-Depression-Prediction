import { TopNavBar } from "../../components/layout/TopNavBar";
import { Footer } from "../../components/layout/Footer";
import { FAQCard } from "../../components/help/FAQCard";

// ── Data ──────────────────────────────────────────────────────────────────────

const steps3col = [
  {
    number: "1",
    icon: "assignment",
    iconBg: "bg-primary-container text-on-primary-container",
    title: "Start an assessment",
    description:
      "Begin your reflection journey in a secure, pressure-free environment tailored for your well-being.",
  },
  {
    number: "2",
    icon: "self_improvement",
    iconBg: "bg-secondary-container text-on-secondary-container",
    title: "Answer honestly",
    description:
      "Take a deep breath and respond to the questions truthfully. Your responses guide the personalized insights you receive.",
  },
  {
    number: "3",
    icon: "donut_large",
    iconBg: "bg-tertiary-container text-on-tertiary-container",
    title: "View overview",
    description:
      "Receive a gentle, clear summary of your current mental state, highlighting areas of strength and areas that may need attention.",
  },
];

const steps2col = [
  {
    icon: "explore",
    iconColor: "text-primary",
    title: "Read suggested next steps",
    description:
      "Based on your overview, we'll provide actionable, bite-sized recommendations to support your mental health journey.",
  },
  {
    icon: "bookmark_added",
    iconColor: "text-secondary",
    title: "Sign in to save history",
    description:
      "Create an account if you wish to securely store your past assessments and track your well-being over time.",
  },
];

const faqs = [
  {
    icon: "help",
    iconColor: "primary" as const,
    question: "Is this a medical diagnosis?",
    answer:
      "No, MindfulCheck is designed purely for self-reflection and mental health awareness. It cannot replace professional medical advice, diagnosis, or treatment.",
  },
  {
    icon: "lock",
    iconColor: "secondary" as const,
    question: "Is my information private?",
    answer:
      "Yes, your privacy is our priority. Assessments taken without signing in are completely anonymous and are not stored permanently on our servers.",
  },
  {
    icon: "person_off",
    iconColor: "tertiary" as const,
    question: "Can I use the app without signing in?",
    answer:
      "Absolutely. You can complete the full self-assessment and view your overview and suggested steps as a guest, without ever creating an account.",
  },
  {
    icon: "medical_information",
    iconColor: "error" as const,
    question: "What should I do if my result is concerning?",
    answer:
      "If you are feeling overwhelmed or concerned, we strongly encourage you to use the 'Crisis Resources' link in our footer to find immediate, professional support in your area.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HelpPage() {
  return (
    <div className="wellness-bg min-h-screen flex flex-col overflow-x-hidden">
      <TopNavBar activePage="help" />

      <main className="grow flex flex-col gap-xl w-full max-w-container-max mx-auto px-margin-mobile md:px-lg pb-xl pt-xl relative z-10">

        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-display-lg text-on-surface mb-md">
            How MindfulCheck Works
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            MindfulCheck helps students reflect on their mental well-being
            through a private self-assessment. It is a safe space designed to
            provide clarity and gently guide you toward helpful resources
            without judgment.
          </p>
        </section>

        {/* ── Steps Section ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-md">
          {/* Row 1 — 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {steps3col.map((step) => (
              <div
                key={step.number}
                className="bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
              >
                {/* Decorative large number */}
                <div className="absolute -top-10 -right-10 text-[120px] font-bold text-surface-container-high opacity-50 leading-none select-none pointer-events-none">
                  {step.number}
                </div>

                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-md z-10 ${step.iconBg}`}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-headline-md text-on-surface mb-sm z-10">
                  {step.title}
                </h3>
                <p className="text-body-md text-on-surface-variant z-10">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Row 2 — 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md max-w-4xl mx-auto w-full">
            {steps2col.map((step) => (
              <div
                key={step.title}
                className="bg-surface-container-low rounded-xl p-8 flex items-start gap-md border border-surface-variant hover:border-outline-variant transition-colors"
              >
                <div
                  className={`w-12 h-12 shrink-0 rounded-full bg-surface flex items-center justify-center shadow-sm ${step.iconColor}`}
                >
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <div>
                  <h3 className="text-headline-md text-on-surface mb-xs">
                    {step.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ Section ───────────────────────────────────────────────── */}
        <section className="bg-surface-container-low rounded-[32px] p-8 md:p-lg">
          <div className="text-center mb-xl">
            <h2 className="text-headline-lg text-on-surface mb-sm">
              Frequently Asked Questions
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Clear answers to help you feel confident using MindfulCheck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md max-w-5xl mx-auto">
            {faqs.map((faq) => (
              <FAQCard
                key={faq.question}
                icon={faq.icon}
                iconColor={faq.iconColor}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>

        {/* ── Disclaimer Card ───────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto w-full">
          <div className="bg-surface border border-outline-variant/50 rounded-xl p-md flex items-center gap-md text-center md:text-left flex-col md:flex-row shadow-sm">
            <div className="w-12 h-12 shrink-0 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">info</span>
            </div>
            <p className="text-body-md text-on-surface-variant">
              <strong>Important:</strong> MindfulCheck is not a medical
              diagnosis tool. It is designed for self-reflection and mental
              health awareness. If you are in crisis, please seek professional
              help immediately.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
