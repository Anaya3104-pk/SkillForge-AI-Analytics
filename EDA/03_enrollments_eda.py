# ==========================================
# SKILLFORGE AI ANALYTICS
# ENROLLMENTS EDA
# ==========================================

import sys
from pathlib import Path

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns


# ==========================================
# DATABASE CONNECTION
# ==========================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_GENERATOR = PROJECT_ROOT / "data_generator"

sys.path.insert(0, str(DATA_GENERATOR))

import config

engine = config.engine

print("Database engine loaded successfully!")


# ==========================================
# LOAD ENROLLMENTS DATA
# ==========================================

enrollments = pd.read_sql(
    "SELECT * FROM Enrollments",
    engine
)

print("\nEnrollments dataset loaded successfully!")
print("Shape:", enrollments.shape)

print("\nFirst 5 rows:")
print(enrollments.head())

print("\nColumn information:")
print(enrollments.info())

print("\nBasic statistics:")
print(enrollments.describe(include="all"))

print("\nMissing values:")
print(enrollments.isnull().sum())

# ==========================================
# ENROLLMENT DATA QUALITY CHECK
# ==========================================

enrollments["enrollment_date"] = pd.to_datetime(
    enrollments["enrollment_date"]
)

enrollments["completion_date"] = pd.to_datetime(
    enrollments["completion_date"]
)

print("\n--- Enrollment Date Range ---")
print("Earliest enrollment:", enrollments["enrollment_date"].min())
print("Latest enrollment:", enrollments["enrollment_date"].max())

print("\n--- Completion Date Range ---")
print("Earliest completion:", enrollments["completion_date"].min())
print("Latest completion:", enrollments["completion_date"].max())

print("\n--- Completion Status ---")
print(enrollments["completion_status"].value_counts())

print("\n--- Certificate Earned ---")
print(enrollments["certificate_earned"].value_counts())

print("\n--- Completion Percentage ---")
print(enrollments["completion_percentage"].describe())

print("\n--- Rating Distribution ---")
print(enrollments["rating_given"].value_counts().sort_index())


# ==========================================
# DATE QUALITY CHECK
# ==========================================

print("\n--- Future Enrollment Dates ---")

future_enrollments = enrollments[
    enrollments["enrollment_date"] > "2026-12-31"
]

print("Enrollments after 2026:", len(future_enrollments))


print("\n--- Future Completion Dates ---")

future_completions = enrollments[
    enrollments["completion_date"] > "2026-12-31"
]

print("Completions after 2026:", len(future_completions))


# ==========================================
# STATUS VS COMPLETION PERCENTAGE
# ==========================================

print("\n--- Completion Status vs Completion Percentage ---")

print(
    enrollments.groupby("completion_status")["completion_percentage"]
    .agg(["min", "mean", "max"])
)


# ==========================================
# STATUS VS CERTIFICATE
# ==========================================

print("\n--- Completion Status vs Certificate ---")

print(
    pd.crosstab(
        enrollments["completion_status"],
        enrollments["certificate_earned"]
    )
)

print("\n--- Enrollment Count by User ---")

user_enrollment_counts = enrollments.groupby("user_id").size()

print("Users with 0 enrollments:",
      50000 - user_enrollment_counts.size)

print("Minimum enrollments per user:",
      user_enrollment_counts.min())

print("Maximum enrollments per user:",
      user_enrollment_counts.max())

print("\nEnrollment count distribution:")
print(user_enrollment_counts.value_counts().sort_index())

# ==========================================
# 1. ENROLLMENT STATUS DISTRIBUTION
# ==========================================

status_counts = enrollments["completion_status"].value_counts()

print("\n--- Enrollment Status Distribution ---")
print(status_counts)

plt.figure(figsize=(8, 5))

sns.countplot(
    data=enrollments,
    x="completion_status",
    order=status_counts.index
)

plt.title("Enrollment Status Distribution")
plt.xlabel("Completion Status")
plt.ylabel("Number of Enrollments")

plt.tight_layout()
plt.show()

# ==========================================
# 2. ENROLLMENT COMPLETION RATE
# ==========================================

status_percentage = (
    enrollments["completion_status"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)

print("\n--- Enrollment Status Percentage ---")
print(status_percentage)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=status_percentage.index,
    y=status_percentage.values
)

plt.title("Enrollment Status Percentage")
plt.xlabel("Completion Status")
plt.ylabel("Percentage of Enrollments (%)")

plt.tight_layout()
plt.show()

# ==========================================
# 3. ENROLLMENT TREND OVER TIME
# ==========================================

enrollment_trend = (
    enrollments
    .groupby(enrollments["enrollment_date"].dt.to_period("M"))
    .size()
)

print("\n--- Monthly Enrollment Trend ---")
print(enrollment_trend)

plt.figure(figsize=(12, 5))

enrollment_trend.plot(
    kind="line",
    marker="o"
)

plt.title("Monthly Enrollment Trend")
plt.xlabel("Month")
plt.ylabel("Number of Enrollments")
plt.xticks(rotation=45)

plt.tight_layout()
plt.show()

# ==========================================
# 4. TOP 10 MOST POPULAR COURSES
# ==========================================

course_enrollments = (
    enrollments["course_id"]
    .value_counts()
    .head(10)
    .sort_values(ascending=True)
)

print("\n--- Top 10 Most Popular Courses ---")
print(course_enrollments.sort_values(ascending=False))

plt.figure(figsize=(9, 6))

course_enrollments.plot(
    kind="barh"
)

plt.title("Top 10 Most Popular Courses")
plt.xlabel("Number of Enrollments")
plt.ylabel("Course ID")

plt.tight_layout()
plt.show()


# ==========================================
# 5. TOP 10 COURSES BY ENROLLMENT
# ==========================================

courses = pd.read_sql(
    "SELECT course_id, course_name FROM Courses",
    engine
)

course_popularity = (
    enrollments
    .groupby("course_id")
    .size()
    .reset_index(name="enrollment_count")
    .merge(
        courses,
        on="course_id",
        how="left"
    )
    .sort_values(
        "enrollment_count",
        ascending=False
    )
)

top_10_courses = course_popularity.head(10)

print("\n--- Top 10 Courses by Enrollment ---")
print(
    top_10_courses[
        ["course_name", "enrollment_count"]
    ].to_string(index=False)
)

plt.figure(figsize=(10, 6))

sns.barplot(
    data=top_10_courses.sort_values("enrollment_count"),
    x="enrollment_count",
    y="course_name"
)

plt.title("Top 10 Courses by Enrollment")
plt.xlabel("Number of Enrollments")
plt.ylabel("Course")

plt.tight_layout()
plt.show()

# ==========================================
# 6. COMPLETION RATE BY COURSE DIFFICULTY
# ==========================================

courses = pd.read_sql(
    "SELECT course_id, difficulty FROM Courses",
    engine
)

enrollment_course_data = enrollments.merge(
    courses,
    on="course_id",
    how="left"
)

difficulty_analysis = (
    enrollment_course_data
    .groupby("difficulty")
    .agg(
        total_enrollments=("enrollment_id", "count"),
        completed_enrollments=(
            "completion_status",
            lambda x: (x == "Completed").sum()
        )
    )
)

difficulty_analysis["completion_rate"] = (
    difficulty_analysis["completed_enrollments"]
    / difficulty_analysis["total_enrollments"]
    * 100
).round(2)

difficulty_analysis = difficulty_analysis.sort_values(
    "completion_rate",
    ascending=False
)

print("\n--- Completion Rate by Course Difficulty ---")
print(difficulty_analysis)

plt.figure(figsize=(8, 5))

sns.barplot(
    data=difficulty_analysis.reset_index(),
    x="difficulty",
    y="completion_rate"
)

plt.title("Completion Rate by Course Difficulty")
plt.xlabel("Course Difficulty")
plt.ylabel("Completion Rate (%)")

plt.tight_layout()
plt.show()