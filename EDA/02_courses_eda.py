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
# 1. COURSES DATASET
# ==========================================

courses = pd.read_sql("SELECT * FROM Courses", engine)

print("\nCourses dataset loaded successfully!")
print("Shape:", courses.shape)

print("\nFirst 5 rows:")
print(courses.head())

print("\nColumn information:")
print(courses.info())

print("\nBasic statistics:")
print(courses.describe(include="all"))

# ==========================================
# 2. COURSE DIFFICULTY DISTRIBUTION
# ==========================================

difficulty_counts = courses["difficulty"].value_counts()

print("\n--- Course Difficulty Distribution ---")
print(difficulty_counts)

plt.figure(figsize=(8, 5))

sns.countplot(
    data=courses,
    x="difficulty",
    order=difficulty_counts.index
)

plt.title("Courses by Difficulty Level")
plt.xlabel("Difficulty Level")
plt.ylabel("Number of Courses")
plt.tight_layout()

plt.show()

# ==========================================
# 3. COURSE PRICE DISTRIBUTION
# ==========================================

print("\n--- Course Price Statistics ---")
print(courses["price"].describe())

plt.figure(figsize=(8, 5))

sns.histplot(
    data=courses,
    x="price",
    bins=10,
    kde=True
)

plt.title("Course Price Distribution")
plt.xlabel("Course Price (₹)")
plt.ylabel("Number of Courses")
plt.tight_layout()

plt.show()

# ==========================================
# 4. COURSE DURATION VS PRICE
# ==========================================

plt.figure(figsize=(8, 5))

sns.scatterplot(
    data=courses,
    x="duration_hours",
    y="price"
)

plt.title("Course Duration vs Price")
plt.xlabel("Duration (Hours)")
plt.ylabel("Course Price (₹)")
plt.tight_layout()

plt.show()

# ==========================================
# 5. COURSE LAUNCH TREND
# ==========================================

courses["launch_date"] = pd.to_datetime(courses["launch_date"])

launch_trend = (
    courses.groupby(courses["launch_date"].dt.to_period("M"))
    .size()
)

print("\n--- Course Launch Trend ---")
print(launch_trend)

plt.figure(figsize=(10, 5))

launch_trend.plot(kind="line", marker="o")

plt.title("Course Launch Trend Over Time")
plt.xlabel("Launch Month")
plt.ylabel("Number of Courses Launched")
plt.xticks(rotation=45)

plt.tight_layout()
plt.show()