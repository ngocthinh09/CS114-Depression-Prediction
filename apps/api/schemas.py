from pydantic import BaseModel, Field, validator, model_validator
from typing import Optional, Literal

class AssessmentRequest(BaseModel):
    name: str = Field(alias="Name")
    gender: Literal["Male", "Female"] = Field(alias="Gender")
    age: int = Field(ge=18, alias="Age")
    city: str = Field(alias="City")
    role: Literal["Student", "Working Professional"] = Field(alias="Working Professional or Student")
    profession: Optional[str] = Field(default=None, alias="Profession")
    degree: str = Field(alias="Degree")

    academic_pressure: Optional[int] = Field(default=None, ge=1, le=5, alias="Academic Pressure")
    work_pressure: Optional[int] = Field(default=None, ge=1, le=5, alias="Work Pressure")
    cgpa: Optional[float] = Field(default=None, ge=0.0, le=10.0, alias="CGPA")
    study_satisfaction: Optional[int] = Field(default=None, ge=1, le=5, alias="Study Satisfaction")
    job_satisfaction: Optional[int] = Field(default=None, ge=1, le=5, alias="Job Satisfaction")
    work_study_hours: float = Field(ge=0.0, le=24.0, alias="Work/Study Hours")
    financial_stress: int = Field(ge=1, le=5, alias="Financial Stress")

    sleep_duration: Literal[
        "Less than 5 hours", 
        "5 - 6 hours", 
        "7 - 8 hours", 
        "More than 8 hours"
    ] = Field(alias="Sleep Duration")
    dietary_habits: Literal["Unhealthy", "Healthy", "Moderate"] = Field(alias="Dietary Habits")

    suicidal_thoughts: Literal["Yes", "No"] = Field(alias="Have you ever had suicidal thoughts ?")
    family_history: Literal["Yes", "No"] = Field(alias="Family History of Mental Illness")

    @model_validator(mode='after')
    def validate_role_specific_fields(self):
        if self.role == "Student":
            if self.cgpa is None or self.academic_pressure is None or self.study_satisfaction is None:
                raise ValueError("CGPA, Academic Pressure, and Study Satisfaction are required for Students.")
        elif self.role == "Working Professional":
            if not self.profession or self.work_pressure is None or self.job_satisfaction is None:
                raise ValueError("Profession, Work Pressure, and Job Satisfaction are required for Working Professionals.")
        
        return self

    class Config:
        populate_by_name = True
