"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "../../../store/useAssessmentStore";
import { TopNavBar } from "../../../components/layout/TopNavBar";
import { Footer } from "../../../components/layout/Footer";

export default function ResultsPage() {
  const router = useRouter();
  const { result } = useAssessmentStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if no result is found (e.g., user refreshed the page)
    if (!result) {
      router.push("/assessment");
    }
  }, [result, router]);

  // Prevent hydration mismatch or flashing content before redirect
  if (!mounted || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Map risk level to UI configuration
  const uiConfig = {
    "Healthy": {
      color: "text-tertiary",
      bgColor: "bg-tertiary-container",
      textColor: "text-on-tertiary-container",
      gaugeTrack: "text-surface-container-high",
      icon: "mood",
      tag: "Positive Outlook",
    },
    "Attention": {
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      gaugeTrack: "text-surface-container-high",
      icon: "sentiment_dissatisfied",
      tag: "Mild Stress Signs",
    },
    "Severe": {
      color: "text-error",
      bgColor: "bg-error-container",
      textColor: "text-on-error-container",
      gaugeTrack: "text-surface-container-high",
      icon: "sentiment_very_dissatisfied",
      tag: "High Stress Warning",
    },
  }[result.risk_level] || {
    color: "text-primary",
    bgColor: "bg-primary-container",
    textColor: "text-on-primary-container",
    gaugeTrack: "text-surface-container-high",
    icon: "info",
    tag: "Assessment Complete",
  };

  // Calculate Gauge stroke (circumference is roughly 251.2 for r=40)
  const circumference = 251.2;
  const percentage = Math.min(Math.max(result.confidence, 0), 1);
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      <TopNavBar activePage="prediction" />

      <main className="grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-xl">
        {/* Header Section */}
        <div className="text-center mb-lg">
          <h1 className="font-display-lg text-display-lg text-on-background mb-base">Your Results</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Thank you for sharing your feelings. Below is an analysis based on your responses to help you better understand your current state.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
          {/* Result Summary & Gauge (Spans 8 columns) */}
          <div className="md:col-span-8 glass-card rounded-xl p-lg flex flex-col md:flex-row items-center gap-lg bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
            {/* Circular Gauge */}
            <div className="relative w-48 h-48 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className={`${uiConfig.gaugeTrack} stroke-current`}
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  fill="transparent"
                ></circle>
                <circle
                  className={`${uiConfig.color} stroke-current transition-all duration-1000 ease-out`}
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`material-symbols-outlined text-4xl ${uiConfig.color} mb-xs`}>{uiConfig.icon}</span>
                <span className={`font-headline-md text-headline-md ${uiConfig.color}`}>{result.risk_level}</span>
              </div>
            </div>

            {/* Summary Text */}
            <div>
              <div className={`inline-block px-3 py-1 ${uiConfig.bgColor} ${uiConfig.textColor} rounded-full font-label-sm text-label-sm mb-sm`}>
                {uiConfig.tag} • {Math.round(result.confidence * 100)}% Confidence
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-sm">
                {result.risk_level === "Healthy" ? "You're doing quite well!" : "Let's take a closer look."}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                {result.summary} Remember, this is not a medical diagnosis.
              </p>
              
              <div className={`${uiConfig.bgColor} ${uiConfig.textColor} p-sm rounded-lg flex items-start gap-sm`}>
                <span className="material-symbols-outlined mt-1">info</span>
                <p className="font-label-md text-label-md">{result.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Professional Support CTA (Spans 4 columns) */}
          <div className="md:col-span-4 bg-secondary-container rounded-xl p-md flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-background mb-xs">Need to Talk?</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                If you feel the pressure is persisting, talking to a professional can be very helpful. Don't hesitate to seek support.
              </p>
            </div>
            <div className="space-y-sm">
              <button className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center justify-center gap-xs">
                <span className="material-symbols-outlined">support_agent</span>
                Find Professional Support
              </button>
              <a href="#" className="block text-center font-label-md text-label-md text-secondary hover:underline">
                Contact school counselors
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="md:col-span-12 mt-lg border-t border-outline-variant/30 pt-md text-center">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              * Important Note: Results are for reference only based on provided info and do not replace professional diagnosis. MindfulCheck is not an emergency service.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
