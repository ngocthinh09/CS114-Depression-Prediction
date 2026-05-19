from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.base import TransformerMixin, BaseEstimator


ROLE_COL= "Working Professional or Student"
STUDENT_ONLY_NUM_COLS = ["Academic Pressure", "CGPA", "Study Satisfaction"]
WORKER_ONLY_NUM_COLS = ["Work Pressure", "Job Satisfaction"]
WORKER_ONLY_CAT_COLS = ["Profession"]
BINARY_YES_NO_COLS = ["Have you ever had suicidal thoughts ?", "Family History of Mental Illness"]


class StringCleaner(BaseEstimator, TransformerMixin):
    """
    Clean all string-type columns:
    - Remove leading and trailing whitespace
    - Standardize empty or invalid values ('', 'nan', 'None') to np.nan
    """
    def fit(self, X: pd.DataFrame, y: pd.Series | None = None) -> StringCleaner:
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out: pd.DataFrame = X.copy()
        obj_cols = X_out.select_dtypes(include=["object", "string"]).columns
        for col in obj_cols:
            X_out[col] = X_out[col].astype('object')
            X_out[col] = X_out[col].where(X_out[col].notna(), np.nan)
            X_out[col] = X_out[col].str.strip()
            X_out[col] = X_out[col].replace({"": np.nan, "nan": np.nan, "None": np.nan})
        return X_out

class MissingIndicatorAdder(BaseEstimator, TransformerMixin):
    """
    Create additional binary columns `<col>_is_missing` for columns
    that contain missing values. This must be applied BEFORE imputing
    missing values.

    - fit(): Identify and store which columns contain missing values
            in the training set.
    - transform(): Create indicator columns based on the stored column list
    """
    def __init__(self, min_missing_frac: float = 0.0) -> None:
        self.min_missing_frac = min_missing_frac
        self.missing_cols_: list[str] = []

    def fit(self, X: pd.DataFrame, y: pd.Series | None = None) -> MissingIndicatorAdder:
        missing_frac: pd.Series = X.isna().mean()
        self.missing_cols_ = missing_frac[missing_frac > self.min_missing_frac].index.tolist()
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out: pd.DataFrame = X.copy()
        for col in self.missing_cols_:
            if col in X_out.columns:
                X_out[f"{col}_is_missing"] = X_out[col].isna().astype('int')
        return X_out


class StructuralMissingImputer(BaseEstimator, TransformerMixin):
    """
    Impute missing values based on role-specific logic:
    - Working Professional: fill student-specific columns with 0
    - Student: fill working-professional-specific columns with 0, and fill the Profession column with 'Not Applicable'
    """
    def fit(self, X: pd.DataFrame, y: pd.Series | None = None) -> StructuralMissingImputer:
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out: pd.DataFrame = X.copy()
        if ROLE_COL not in X_out.columns:
            return X_out

        is_student: pd.Series = X_out[ROLE_COL].eq("Student")
        is_worker: pd.Series = X_out[ROLE_COL].eq("Working Professional")

        for col in STUDENT_ONLY_NUM_COLS:
            if col in X_out.columns:
                X_out.loc[is_worker & X_out[col].isna(), col] = 0.0

        for col in WORKER_ONLY_NUM_COLS:
            if col in X_out.columns:
                X_out.loc[is_student & X_out[col].isna(), col] = 0.0

        for col in WORKER_ONLY_CAT_COLS:
            if col in X_out.columns:
                X_out.loc[is_student & X_out[col].isna(), col] = "Not Applicable"

        return X_out


class BinaryYesNoEncoder(BaseEstimator, TransformerMixin):
    """
    Convert Yes/No columns into 1/0.
    Do nothing if the column does not exist in the dataset.
    """
    def __init__(self, cols: list[str] | None = None) -> None:
        self.cols = cols if cols is not None else BINARY_YES_NO_COLS

    def fit(self, X: pd.DataFrame, y: pd.Series | None = None) -> BinaryYesNoEncoder:
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out: pd.DataFrame = X.copy()
        for col in self.cols:
            if col in X_out.columns:
                X_out[col] = X_out[col].map({"Yes": 1, "No": 0})
        return X_out

class HasValueIndicatorEncoder(BaseEstimator, TransformerMixin):
    """
    Convert selected categorical columns into binary indicators:
    - 1: has a meaningful value
    - 0: missing / empty / Not Applicable / Other invalid values

    Example:
    - Degree -> 1 if user has degree info, else 0
    - Profession -> 1 if user has profession info, else 0
    """
    def __init__(self, cols: list[str] | None = None) -> None:
        self.cols = cols if cols is not None else ["Degree", "Profession"]

    def fit(self, X: pd.DataFrame, y: pd.Series | None = None) -> HasValueIndicatorEncoder:
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out: pd.DataFrame = X.copy()

        invalid_values = {
            "",
            "nan",
            "none",
            "null",
            "not applicable",
            "n/a",
            "na",
            "other",
        }

        for col in self.cols:
            if col in X_out.columns:
                s = X_out[col]

                has_value = (
                    s.notna()
                    & ~s.astype(str).str.strip().str.lower().isin(invalid_values)
                )

                X_out[col] = has_value.astype(int)

        return X_out


class RareCategoryGrouper(BaseEstimator, TransformerMixin):
    """
    Group categories that appear fewer than `min_count` times in the training set
    into the label 'Other'. Applied to high-cardinality features.

    - fit(): Count the frequency of each category in the training set
    - transform(): Map all infrequent or unseen categories (including unknown values from the test set) to 'Other'
    """
    def __init__(self, min_count: int = 30) -> None:
        self.min_count = min_count
        self.keep_values_: dict[str, set[str]] = {}

    def fit(self, X: pd.DataFrame, y: pd.Series | None = None) -> RareCategoryGrouper:
        cat_cols = X.select_dtypes(include=["object", "string"]).columns
        for col in cat_cols:
            counts: pd.Series = X[col].value_counts(dropna=True)
            self.keep_values_[col] = set(counts[counts >= self.min_count].index)
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out: pd.DataFrame = X.copy()
        for col, valid_values in self.keep_values_.items():
            if col not in X_out.columns:
                continue
            mask_rare: pd.Series = X_out[col].notna() & ~X_out[col].isin(valid_values)
            X_out.loc[mask_rare, col] = "Other"
        return X_out

class FeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Extract new features based on EDA findings:
    - Aggregated features (Total Pressure, Total Satisfaction, Gap)
    - High-risk binary indicators (High-Risk Flags)
    - Interaction features
    """
    def fit(self, X: pd.DataFrame, y: pd.Series | None = None) -> FeatureEngineer:
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out: pd.DataFrame = X.copy()

        # --- Pressure & Statisfaction ---
        has_academic = "Academic Pressure" in X_out.columns
        has_work_p = "Work Pressure" in X_out.columns
        has_study_sat = "Study Satisfaction" in X_out.columns
        has_job_sat = "Job Satisfaction" in X_out.columns

        if has_academic and has_work_p:
            X_out["Total Pressure"] = (X_out["Academic Pressure"].fillna(0) + X_out["Work Pressure"].fillna(0))
            X_out["Max Pressure"] = X_out[["Academic Pressure", "Work Pressure"]].max(axis=1)

        if has_study_sat and has_job_sat:
            X_out["Total Satisfaction"] = (X_out["Study Satisfaction"].fillna(0) + X_out["Job Satisfaction"].fillna(0))
            X_out["Min Satisfaction"] = (X_out[["Study Satisfaction", "Job Satisfaction"]].replace(0, np.nan).min(axis=1))

        if "Total Pressure" in X_out.columns and "Total Satisfaction" in X_out.columns:
            X_out["Pressure_Satisfaction_Gap"] = (X_out["Total Pressure"] - X_out["Total Satisfaction"])

        # --- High-Risk Flags ---
        if "Work/Study Hours" in X_out.columns:
            X_out["High_Working_Hours_Flag"] = (X_out["Work/Study Hours"] >= 10).astype(int)

        if "Financial Stress" in X_out.columns:
            X_out["High_Financial_Stress_Flag"] = (X_out["Financial Stress"] >= 4.0).astype(int)

        if "Age" in X_out.columns:
            X_out["Is_Young_Adult"] = ((X_out["Age"] >= 20) & (X_out["Age"] <= 30)).astype(int)

        # --- Interaction Features ---
        suicidal_col: str = "Have you ever had suicidal thoughts ?"
        if "Total Pressure" in X_out.columns and suicidal_col in X_out.columns:
            X_out["Suicide_Pressure_Interaction"] = (X_out[suicidal_col] * X_out["Total Pressure"])

        return X_out