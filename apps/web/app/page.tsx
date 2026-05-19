import Link from "next/link";
import { TopNavBar } from "../components/layout/TopNavBar";
import { Footer } from "../components/layout/Footer";
import { Button } from "@repo/ui/button";
import { GlassCard } from "@repo/ui/glass-card";
import { RiskBadge } from "@repo/ui/risk-badge";
import { MedicalDisclaimerBanner } from "../components/layout/MedicalDisclaimerBanner";

export default function Home() {
  return (
    <div className="wellness-bg min-h-screen flex flex-col overflow-x-hidden">
      {/* Background orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/20 rounded-full blur-[100px] animate-blob pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/20 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none -z-10"></div>
      <div className="fixed top-[40%] left-[20%] w-[30%] h-[30%] bg-tertiary-container/15 rounded-full blur-[120px] animate-blob animation-delay-4000 pointer-events-none -z-10"></div>

      <TopNavBar activePage="home" />

      <main className="grow flex flex-col gap-xl py-xl px-margin-mobile md:px-lg max-w-container-max mx-auto w-full relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-xl">
          <div className="flex-1 flex flex-col gap-md">
            <div className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-full w-fit">
              <span className="material-symbols-outlined text-sm">favorite</span>
              <span className="text-label-sm uppercase tracking-wider">STUDENT MENTAL HEALTH</span>
            </div>
            <h1 className="text-display-lg text-on-background">
              Listen to yourself, <br />
              <span className="text-primary">understand your mind.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Academic pressure and student life can sometimes be overwhelming. Take a few minutes to check your mental health safely and privately.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link href="/assessment">
                <Button size="lg">Start Assessment Now</Button>
              </Link>
              <Button variant="secondary-outlined" size="lg">Learn More</Button>
            </div>
          </div>
          <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[500px]">
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary-container rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary-container rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <GlassCard intensity="strong" className="relative h-full w-full overflow-hidden p-8 flex items-center justify-center">
              <img
                alt="Student relaxing"
                className="w-full h-full object-cover rounded-xl opacity-95 shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY8iWX_tN5PxrDBInrIEXVN3YT_29D_quDTrZuHtXvijNV-dy8375f1jVoK5JQFbXH2Hr8KDIEFuSgQ9gZd3zYlG1iuvfVBSRpZ-LLwc1FnG6WDqayarJv0d3IJnaKI1gKdS22hFbKVgbq90_rvDxuq8NkxSA91ZJ0AVqtRhIqqSHeIbbGPv360D-RsoDK8SWXWp1Ukj3ilCH1bAU2T7yVk-sg_P7J6MwP0rx8katqs7SdjvzCTJYosc7cURHQNOq4wCC-3ifofQ"
              />
            </GlassCard>
          </div>
        </section>

        {/* 3 Simple Steps Section (Glass Cards) */}
        <section className="flex flex-col gap-lg py-12">
          <div className="text-center flex flex-col gap-4 max-w-3xl mx-auto">
            <h2 className="text-headline-lg text-on-background">3 Simple Steps</h2>
            <p className="text-body-md text-on-surface-variant">Your journey to understanding yourself starts with the smallest steps. Our system is designed to be easy and friendly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "quiz", title: "1. Take the Test", desc: "Complete a short questionnaire designed based on reputable academic standards for students.", color: "bg-secondary-container" },
              { icon: "analytics", title: "2. Get Results", desc: "The system analyzes and returns your current risk level in a clear and neutral way.", color: "bg-tertiary-container" },
              { icon: "support_agent", title: "3. Receive Advice", desc: "Suggested early intervention measures, useful resources, and support contact info at your school.", color: "bg-primary-container" },
            ].map((step) => (
              <GlassCard key={step.title} className="p-8 flex flex-col gap-6 hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <div>
                  <h3 className="text-headline-md mb-2">{step.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{step.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Privacy Commitment */}
        <section className="bg-white/50 backdrop-blur-md rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 soft-shadow border border-white/60 mb-8">
          <div className="w-20 h-20 shrink-0 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-primary">shield_lock</span>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-headline-md text-on-background">Absolute Privacy Commitment</h3>
            <p className="text-body-md text-on-surface-variant">
              We understand that mental health is a sensitive personal matter. Our system ensures <strong>complete anonymity</strong>. Your data is encrypted and not shared with any third party without your consent. You have full control over your information.
            </p>
          </div>
        </section>
      </main>

      <MedicalDisclaimerBanner />
      <Footer />
    </div>
  );
}
