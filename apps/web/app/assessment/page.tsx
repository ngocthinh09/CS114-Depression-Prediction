"use client";

import React, { useEffect } from "react";
import { TopNavBar } from "../../components/layout/TopNavBar";
import { Footer } from "../../components/layout/Footer";
import { Button } from "@repo/ui/button";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { ProgressBar } from "../../components/assessment/ProgressBar";
import { QuestionSection, QuestionItem } from "../../components/assessment/QuestionSection";
import { RadioChipGroup } from "../../components/assessment/RadioChipGroup";
import { RatingScale } from "../../components/assessment/RatingScale";
import { useRouter } from "next/navigation";

export default function AssessmentPage() {
  const router = useRouter();
  const {
    currentStep,
    totalSteps,
    formData,
    setFormData,
    nextStep,
    prevStep,
    submitAssessment,
    isLoading,
    error,
    setError,
  } = useAssessmentStore();

  const progress = (currentStep / totalSteps) * 100;

  // Render Step 1: Personal Information
  const renderStep1 = () => (
    <QuestionSection title="Personal Information" icon="person">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Name (Optional)</label>
          <input
            type="text"
            className="h-[56px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary px-4 font-body-md text-body-md placeholder:text-outline/50 text-on-surface transition-colors"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Age</label>
          <input
            type="number"
            min="18"
            className="h-[56px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary px-4 font-body-md text-body-md text-on-surface transition-colors"
            placeholder="e.g., 20"
            value={formData.age}
            onChange={(e) => setFormData({ age: e.target.value ? Number(e.target.value) : "" })}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Gender</label>
          <RadioChipGroup
            name="gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            value={formData.gender}
            onChange={(val: any) => setFormData({ gender: val })}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">City</label>
          <input
            type="text"
            className="h-[56px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary px-4 font-body-md text-body-md placeholder:text-outline/50 text-on-surface transition-colors"
            placeholder="e.g., Ho Chi Minh City"
            value={formData.city}
            onChange={(e) => setFormData({ city: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-xs md:col-span-2">
          <label className="font-label-md text-label-md text-on-surface-variant">Are you a Student or Working Professional?</label>
          <RadioChipGroup
            name="role"
            options={[
              { value: "Student", label: "Student" },
              { value: "Working Professional", label: "Working Professional" },
            ]}
            value={formData.role}
            onChange={(val: any) => setFormData({ role: val })}
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Degree / Major</label>
          <input
            type="text"
            className="h-[56px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary px-4 font-body-md text-body-md placeholder:text-outline/50 text-on-surface transition-colors"
            placeholder="e.g., Computer Science"
            value={formData.degree}
            onChange={(e) => setFormData({ degree: e.target.value })}
          />
        </div>

        {formData.role === "Working Professional" && (
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">Profession</label>
            <input
              type="text"
              className="h-[56px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary px-4 font-body-md text-body-md placeholder:text-outline/50 text-on-surface transition-colors"
              placeholder="e.g., Software Engineer"
              value={formData.profession}
              onChange={(e) => setFormData({ profession: e.target.value })}
            />
          </div>
        )}
      </div>
    </QuestionSection>
  );

  // Render Step 2: Pressure & Satisfaction
  const renderStep2 = () => (
    <QuestionSection title="Pressure & Satisfaction" icon="psychology" bgColorClass="bg-primary-container/20">
      {formData.role === "Student" && (
        <>
          <QuestionItem label="How would you rate your Academic Pressure? (1: Very Low, 5: Overloaded)">
            <RatingScale
              name="academicPressure"
              value={formData.academicPressure}
              onChange={(val) => setFormData({ academicPressure: val })}
              minLabel="Very Low"
              maxLabel="Overloaded"
            />
          </QuestionItem>
          <QuestionItem label="What is your current CGPA? (0.0 to 10.0)">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="h-[56px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary px-4 font-body-md text-body-md text-on-surface transition-colors"
              value={formData.cgpa}
              onChange={(e) => setFormData({ cgpa: e.target.value ? Number(e.target.value) : "" })}
            />
          </QuestionItem>
          <QuestionItem label="How satisfied are you with your studies? (1: Not satisfied, 5: Highly satisfied)">
            <RatingScale
              name="studySatisfaction"
              value={formData.studySatisfaction}
              onChange={(val) => setFormData({ studySatisfaction: val })}
              minLabel="Low"
              maxLabel="High"
            />
          </QuestionItem>
        </>
      )}

      {formData.role === "Working Professional" && (
        <>
          <QuestionItem label="How would you rate your Work Pressure? (1: Very Low, 5: Overloaded)">
            <RatingScale
              name="workPressure"
              value={formData.workPressure}
              onChange={(val) => setFormData({ workPressure: val })}
              minLabel="Very Low"
              maxLabel="Overloaded"
            />
          </QuestionItem>
          <QuestionItem label="How satisfied are you with your job? (1: Not satisfied, 5: Highly satisfied)">
            <RatingScale
              name="jobSatisfaction"
              value={formData.jobSatisfaction}
              onChange={(val) => setFormData({ jobSatisfaction: val })}
              minLabel="Low"
              maxLabel="High"
            />
          </QuestionItem>
        </>
      )}

      <QuestionItem label="How many hours do you typically work or study per day? (0 - 24)">
        <input
          type="number"
          min="0"
          max="24"
          className="h-[56px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary px-4 font-body-md text-body-md text-on-surface transition-colors"
          value={formData.workStudyHours}
          onChange={(e) => setFormData({ workStudyHours: e.target.value ? Number(e.target.value) : "" })}
        />
      </QuestionItem>

      <QuestionItem label="How much financial stress are you currently experiencing? (1: None, 5: Extreme)">
        <RatingScale
          name="financialStress"
          value={formData.financialStress}
          onChange={(val) => setFormData({ financialStress: val })}
          minLabel="None"
          maxLabel="Extreme"
        />
      </QuestionItem>
    </QuestionSection>
  );

  // Render Step 3: Health & Mental Health History
  const renderStep3 = () => (
    <QuestionSection title="Health & Mental Health" icon="favorite" bgColorClass="bg-tertiary-container/30">
      <QuestionItem label="How many hours of sleep do you usually get per night?">
        <RadioChipGroup
          name="sleepDuration"
          options={[
            { value: "Less than 5 hours", label: "Under 5h" },
            { value: "5 - 6 hours", label: "5 - 6h" },
            { value: "7 - 8 hours", label: "7 - 8h (Good)" },
            { value: "More than 8 hours", label: "Over 8h" },
          ]}
          value={formData.sleepDuration}
          onChange={(val: any) => setFormData({ sleepDuration: val })}
        />
      </QuestionItem>
      
      <QuestionItem label="How would you describe your dietary habits?">
        <RadioChipGroup
          name="dietaryHabits"
          options={[
            { value: "Unhealthy", label: "Unhealthy" },
            { value: "Moderate", label: "Moderate" },
            { value: "Healthy", label: "Healthy" },
          ]}
          value={formData.dietaryHabits}
          onChange={(val: any) => setFormData({ dietaryHabits: val })}
        />
      </QuestionItem>

      <div className="h-px bg-outline-variant/30 w-full my-4"></div>
      
      <QuestionItem label="Have you ever had suicidal thoughts?" className="border-error/30 bg-error-container/10">
        <RadioChipGroup
          name="suicidalThoughts"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={formData.suicidalThoughts}
          onChange={(val: any) => setFormData({ suicidalThoughts: val })}
        />
      </QuestionItem>

      <QuestionItem label="Is there a family history of mental illness?">
        <RadioChipGroup
          name="familyHistory"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={formData.familyHistory}
          onChange={(val: any) => setFormData({ familyHistory: val })}
        />
      </QuestionItem>
    </QuestionSection>
  );

  const handleNext = () => {
    // Basic validation
    if (currentStep === 1) {
      if (!formData.age || !formData.gender || !formData.city || !formData.role) {
        setError("Please fill in all required fields (Age, Gender, City, Role).");
        return;
      }
      if (formData.age < 18 || formData.age > 100) {
        setError("Age must be between 18 and 100.");
        return;
      }
    }

    if (currentStep === 2) {
      if (formData.role === "Student") {
        if (!formData.academicPressure || formData.cgpa === "" || !formData.studySatisfaction) {
          setError("Please fill in all required fields (Academic Pressure, CGPA, Study Satisfaction).");
          return;
        }
        if (formData.cgpa < 0 || formData.cgpa > 10) {
          setError("CGPA must be a valid number between 0.0 and 10.0.");
          return;
        }
      }

      if (formData.role === "Working Professional") {
        if (!formData.workPressure || !formData.jobSatisfaction) {
          setError("Please fill in all required fields (Work Pressure, Job Satisfaction).");
          return;
        }
      }

      if (formData.workStudyHours === "" || !formData.financialStress) {
        setError("Please fill in all required fields (Work/Study Hours, Financial Stress).");
        return;
      }

      if (formData.workStudyHours < 0 || formData.workStudyHours > 24) {
        setError("Work/Study Hours must be between 0 and 24.");
        return;
      }
    }

    nextStep();
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.sleepDuration || !formData.dietaryHabits || !formData.suicidalThoughts || !formData.familyHistory) {
      setError("Please fill in all required fields in this section.");
      return;
    }
    await submitAssessment();
    if (!useAssessmentStore.getState().error) {
       router.push('/assessment/results');
    }
  };

  return (
    <div className="bg-linear-to-br from-surface via-primary-container/20 to-tertiary-container/30 text-on-background antialiased min-h-screen flex flex-col">
      <TopNavBar activePage="prediction" />
      
      <main className="grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-lg">
        {/* Header */}
        <div className="text-center mb-lg">
          <h1 className="font-display-lg text-display-lg text-primary mb-sm">Mental Health Assessment</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            We are here to listen. Please share how you've been feeling lately in a way that feels most comfortable to you.
          </p>
        </div>

        {/* Progress */}
        <ProgressBar progress={progress} className="mb-lg" />

        {error && (
          <div className="max-w-3xl mx-auto mb-md bg-error-container text-on-error-container p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form className="max-w-3xl mx-auto space-y-lg" onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Form Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-md pt-md">
            <Button
              variant="secondary-outlined"
              size="lg"
              className="w-full sm:w-auto"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
            >
              <span className="material-symbols-outlined text-[20px] mr-2">arrow_back</span>
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-md"
                onClick={handleNext}
              >
                Next
                <span className="material-symbols-outlined text-[20px] ml-2">arrow_forward</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-md"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Assessment"}
                <span className="material-symbols-outlined text-[20px] ml-2">check_circle</span>
              </Button>
            )}
          </div>

          {/* Privacy Note */}
          <div className="text-center mt-sm flex items-center justify-center gap-xs text-on-surface-variant/70">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <p className="font-label-sm text-label-sm">Your data is fully protected and used only to support you better.</p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
