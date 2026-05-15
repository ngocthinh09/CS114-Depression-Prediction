import { create } from "zustand";

export type Gender = "Male" | "Female" | "";
export type Role = "Student" | "Working Professional" | "";
export type SleepDuration =
  | "Less than 5 hours"
  | "5 - 6 hours"
  | "7 - 8 hours"
  | "More than 8 hours"
  | "";
export type DietaryHabits = "Unhealthy" | "Healthy" | "Moderate" | "";
export type YesNo = "Yes" | "No" | "";

export interface AssessmentFormData {
  // Step 1: Personal Info
  name: string;
  gender: Gender;
  age: number | "";
  city: string;
  role: Role;
  profession: string;
  degree: string;

  // Step 2: Pressure & Satisfaction
  academicPressure: number | "";
  workPressure: number | "";
  cgpa: number | "";
  studySatisfaction: number | "";
  jobSatisfaction: number | "";
  workStudyHours: number | "";
  financialStress: number | "";

  // Step 3: Health & Mental Health
  sleepDuration: SleepDuration;
  dietaryHabits: DietaryHabits;
  suicidalThoughts: YesNo;
  familyHistory: YesNo;
}

const initialFormData: AssessmentFormData = {
  name: "",
  gender: "",
  age: "",
  city: "",
  role: "",
  profession: "",
  degree: "",
  academicPressure: "",
  workPressure: "",
  cgpa: "",
  studySatisfaction: "",
  jobSatisfaction: "",
  workStudyHours: "",
  financialStress: "",
  sleepDuration: "",
  dietaryHabits: "",
  suicidalThoughts: "",
  familyHistory: "",
};

export interface AssessmentResult {
  risk_level: "Healthy" | "Attention" | "Severe";
  confidence: number;
  summary: string;
  recommendation: string;
}

interface AssessmentState {
  currentStep: number;
  totalSteps: number;
  formData: AssessmentFormData;
  isLoading: boolean;
  error: string | null;
  result: AssessmentResult | null;

  // Actions
  setFormData: (data: Partial<AssessmentFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetForm: () => void;
  submitAssessment: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentStep: 1, // Start at step 1
  totalSteps: 3,  // Total 3 steps
  formData: initialFormData,
  isLoading: false,
  error: null,
  result: null,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
      error: null, // Clear error when user types
    })),

  nextStep: () => {
    // We could add validation logic here before allowing next step
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
    }));
  },

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  setStep: (step) =>
    set((state) => ({
      currentStep: Math.min(Math.max(step, 1), state.totalSteps),
      error: null,
    })),

  resetForm: () =>
    set({
      currentStep: 1,
      formData: initialFormData,
      error: null,
      isLoading: false,
      result: null,
    }),

  setError: (error) => set({ error }),

  submitAssessment: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = get().formData;
      
      // Prepare payload to match Backend API Schema (AssessmentRequest)
      const payload = {
        "Name": data.name || "Anonymous",
        "Gender": data.gender,
        "Age": data.age,
        "City": data.city || "Unknown",
        "Working Professional or Student": data.role,
        "Profession": data.role === "Working Professional" ? data.profession : null,
        "Degree": data.degree || "Unknown",
        
        "Academic Pressure": data.role === "Student" ? data.academicPressure : null,
        "Work Pressure": data.role === "Working Professional" ? data.workPressure : null,
        "CGPA": data.role === "Student" ? data.cgpa : null,
        "Study Satisfaction": data.role === "Student" ? data.studySatisfaction : null,
        "Job Satisfaction": data.role === "Working Professional" ? data.jobSatisfaction : null,
        "Work/Study Hours": data.workStudyHours,
        "Financial Stress": data.financialStress,

        "Sleep Duration": data.sleepDuration,
        "Dietary Habits": data.dietaryHabits,
        
        "Have you ever had suicidal thoughts ?": data.suicidalThoughts,
        "Family History of Mental Illness": data.familyHistory,
      };

      // Call Backend API
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment.");
      }

      const result = await response.json();
      console.log("Prediction Result:", result);

      if (result.status === "success" && result.prediction) {
        set({ isLoading: false, result: result.prediction });
      } else {
        throw new Error(result.message || "Failed to parse prediction result.");
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message || "An error occurred." });
    }
  },
}));
