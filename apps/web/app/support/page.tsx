import { TopNavBar } from "../../components/layout/TopNavBar";
import { Footer } from "../../components/layout/Footer";
import { UrgentNotice } from "../../components/ui/UrgentNotice";
import { SupportOptionCard } from "../../components/support/SupportOptionCard";
import { ContactInfoRow } from "../../components/support/ContactInfoRow";
import { Button } from "@repo/ui/button";
import Link from "next/link";

export default function SupportPage() {
  const supportOptions = [
    {
      title: "Talk to someone you trust",
      description: "Friends or family can offer immediate comfort.",
      icon: "diversity_1",
      iconBg: "bg-secondary-container",
      iconText: "text-on-secondary-container",
    },
    {
      title: "Contact a school counselor",
      description: "They are trained to help students navigate stress.",
      icon: "school",
      iconBg: "bg-tertiary-container",
      iconText: "text-on-tertiary-container",
    },
    {
      title: "Reach out to a professional",
      description: "Expert guidance for your well-being journey.",
      icon: "psychology",
      iconBg: "bg-surface-container-high",
      iconText: "text-secondary",
    },
    {
      title: "Use emergency support",
      description: "If you may be in immediate danger.",
      icon: "emergency",
      iconBg: "bg-error-container/20",
      iconText: "text-error",
      className: "border-l-4 border-error",
    },
  ];

  const uitContactInfo = [
    { label: "Support Expert", value: "Ms. Nguyen Thanh Tinh", icon: "person" },
    { label: "Location", value: "Room A104", icon: "location_on" },
    {
      label: "Opening Hours",
      value: "Tue: 10:30 - 16:00, Fri: 10:30 - 16:00",
      icon: "schedule",
    },
    {
      label: "Outside of hours",
      value: "Contact Student Affairs Office - A101",
      icon: "info",
    },
  ];

  return (
    <div className="wellness-bg min-h-screen flex flex-col overflow-x-hidden">
      <TopNavBar activePage="prediction" /> {/* Prediction/Support active */}

      <main className="grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl flex flex-col gap-xl relative z-10">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-md">
          <h1 className="text-display-lg text-primary">You’re not alone</h1>
          <p className="text-body-lg text-on-surface-variant">
            If you feel overwhelmed, reaching out can be an important first step.
          </p>
        </section>

        {/* Urgent Notice */}
        <UrgentNotice
          message="If you are in immediate danger or may harm yourself, contact local emergency services or reach someone you trust right now."
        />

        {/* Support Options Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {supportOptions.map((option) => (
            <SupportOptionCard
              key={option.title}
              title={option.title}
              description={option.description}
              icon={option.icon}
              iconBgColor={option.iconBg}
              iconTextColor={option.iconText}
              className={option.className}
            />
          ))}
        </section>

        {/* Dedicated Section: Không gian chia sẻ UIT */}
        <section className="bg-surface-container-low rounded-xl p-lg md:p-xl soft-shadow flex flex-col gap-lg border border-surface-variant">
          <div className="text-center md:text-left">
            <h2 className="text-headline-lg text-primary mb-sm">
              UIT Sharing Space
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-3xl">
              UIT Sharing Space is a place to support students in sharing their
              concerns, thoughts, feelings, and personal issues. Students can
              receive counseling and support from Psychological Expert Ms.
              Nguyen Thanh Tinh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {uitContactInfo.map((info) => (
              <ContactInfoRow
                key={info.label}
                label={info.label}
                value={info.value}
                icon={info.icon}
              />
            ))}
            <ContactInfoRow
              label="Counseling Email"
              value="khonggianchiase@uit.edu.vn (Hoặc liên hệ qua Phòng Công tác Sinh viên)"
              icon="mail"
              className="md:col-span-2"
            />
          </div>
          <p className="text-label-sm text-on-surface-variant italic text-center md:text-left mt-sm">
            Please follow the school's official announcements for the latest
            schedule updates.
          </p>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col md:flex-row justify-center items-center gap-md py-lg">
          <Button variant="primary" className="w-full md:w-auto px-xl">
            Find Support Resources
          </Button>
          <Link href="/assessment" className="w-full md:w-auto">
            <Button variant="secondary-outlined" className="w-full">
              Start Assessment
            </Button>
          </Link>
          <Link href="/" className="w-full md:w-auto">
            <Button variant="ghost" className="w-full text-primary">
              Back to Home
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
