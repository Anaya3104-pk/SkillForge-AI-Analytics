
# FEATURE USAGE EDA


import sys
from pathlib import Path

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Add project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_GENERATOR = PROJECT_ROOT / "data_generator"
sys.path.insert(0, str(DATA_GENERATOR))

import config

# Load data
feature_usage = pd.read_sql(
    "SELECT * FROM Feature_Usage",
    config.engine
)

print("\n--- Feature Usage Dataset ---")
print("Shape:", feature_usage.shape)

print("\n--- Columns ---")
print(feature_usage.columns.tolist())

print("\n--- Missing Values ---")
print(feature_usage.isnull().sum())

print("\n--- First 5 Rows ---")
print(feature_usage.head())

print("\n--- Data Types ---")
print(feature_usage.dtypes)


# 1. FEATURE USAGE DISTRIBUTION

feature_counts = (
    feature_usage["feature_name"]
    .value_counts()
)

print("\n--- Feature Usage Distribution ---")
print(feature_counts)

plt.figure(figsize=(10, 5))

sns.barplot(
    x=feature_counts.values,
    y=feature_counts.index
)

plt.title("Feature Usage Distribution")
plt.xlabel("Number of Usage Records")
plt.ylabel("Feature")

plt.tight_layout()
plt.show()


# 2. AVERAGE SESSION DURATION BY FEATURE


avg_duration_feature = (
    feature_usage
    .groupby("feature_name")["session_duration_minutes"]
    .mean()
    .sort_values(ascending=False)
)

print("\n--- Average Session Duration by Feature ---")
print(avg_duration_feature)

plt.figure(figsize=(10, 5))

sns.barplot(
    x=avg_duration_feature.values,
    y=avg_duration_feature.index
)

plt.title("Average Session Duration by Feature")
plt.xlabel("Average Session Duration (Minutes)")
plt.ylabel("Feature")

plt.tight_layout()
plt.show()


# 3. FEATURE USAGE BY DEVICE

feature_device = (
    feature_usage
    .groupby(["feature_name", "device"])
    .size()
    .reset_index(name="usage_count")
)

print("\n--- Feature Usage by Device ---")
print(feature_device)

plt.figure(figsize=(12, 6))

sns.barplot(
    data=feature_device,
    x="feature_name",
    y="usage_count",
    hue="device"
)

plt.title("Feature Usage by Device")
plt.xlabel("Feature")
plt.ylabel("Number of Usage Records")
plt.xticks(rotation=45, ha="right")

plt.tight_layout()
plt.show()


# 4. MONTHLY FEATURE USAGE TREND


monthly_feature_usage = (
    feature_usage
    .groupby(
        feature_usage["usage_date"].dt.to_period("M")
    )
    .size()
)

print("\n--- Monthly Feature Usage ---")
print(monthly_feature_usage)

plt.figure(figsize=(12, 5))

monthly_feature_usage.plot(
    kind="line",
    marker="o"
)

plt.title("Monthly Feature Usage Trend")
plt.xlabel("Month")
plt.ylabel("Number of Usage Records")
plt.xticks(rotation=45)

plt.tight_layout()
plt.show()