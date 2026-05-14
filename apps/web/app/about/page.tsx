import { TopNavBar } from "../../components/layout/TopNavBar";
import { Footer } from "../../components/layout/Footer";
import { TeamMemberCard } from "../../components/about/TeamMemberCard";
import { MedicalDisclaimerBanner } from "../../components/layout/MedicalDisclaimerBanner";
import { GlassCard } from "@repo/ui/glass-card";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Nguyễn Hồng Phúc",
      studentId: "24521390",
      avatarIcon: "sentiment_very_satisfied",
      bgColor: "secondary" as const,
    },
    {
      name: "Võ Lê Ngọc Thịnh",
      studentId: "24521710",
      avatarIcon: "face",
      bgColor: "tertiary" as const,
    },
  ];

  return (
    <div className="wellness-bg min-h-screen flex flex-col overflow-x-hidden">
      <TopNavBar activePage="about" />

      <main className="grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl flex flex-col gap-xl relative z-10">
        {/* Mission Section */}
        <section className="relative w-full rounded-2xl overflow-hidden bg-primary-container p-8 md:p-xl flex items-center justify-center min-h-[350px] soft-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-surface-bright opacity-40"></div>
          <GlassCard intensity="strong" className="relative z-10 max-w-3xl p-8 md:p-lg text-center flex flex-col items-center gap-md border-white/40">
            <span
              className="material-symbols-outlined text-[48px] text-primary mb-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volunteer_activism
            </span>
            <p className="text-body-lg text-on-surface-variant leading-relaxed italic">
              "We are a team of Information Technology students passionate about
              applying technology for social good. Our project focuses on early
              detection of depression signs in students, aiming to enhance
              mental health awareness in education. Through this, we hope to
              contribute to a more understanding and supportive community."
            </p>
          </GlassCard>
        </section>

        {/* Team Section */}
        <section className="flex flex-col gap-lg items-center py-8">
          <div className="text-center w-full max-w-2xl">
            <h2 className="text-headline-lg text-primary mb-4">Project Team</h2>
            <p className="text-body-md text-on-surface-variant">
              The faces behind MindfulCheck, dedicated to fostering a mentally
              healthy academic environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md w-full max-w-4xl">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.studentId}
                name={member.name}
                studentId={member.studentId}
                avatarIcon={member.avatarIcon}
                avatarBgColor={member.bgColor}
              />
            ))}
          </div>
        </section>
      </main>

      <MedicalDisclaimerBanner />
      <Footer />
    </div>
  );
}
