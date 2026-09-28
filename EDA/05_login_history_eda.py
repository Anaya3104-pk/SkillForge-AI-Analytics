
# SKILLFORGE AI ANALYTICS
# LOGIN HISTORY EDA

import sys
from pathlib import Path

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns



# DATABASE CONNECTION


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_GENERATOR = PROJECT_ROOT / "data_generator"

sys.path.insert(0, str(DATA_GENERATOR))

import config

engine = config.engine

print("Database engine loaded successfully!")



# LOAD LOGIN HISTORY DATA

login_history = pd.read_sql(
    "SELECT * FROM Login_History",
    engine
)

print("\nLogin History dataset loaded successfully!")
print("Shape:", login_history.shape)

print("\nFirst 5 rows:")
print(login_history.head())

print("\nColumn information:")
print(login_history.info())

print("\nBasic statistics:")
print(login_history.describe(include="all"))

print("\nMissing values:")
print(login_history.isnull().sum())



# DATA TYPE CONVERSION


login_history["login_datetime"] = pd.to_datetime(
    login_history["login_datetime"]
)

login_history["logout_datetime"] = pd.to_datetime(
    login_history["logout_datetime"]
)



# BASIC LOGIN ANALYSIS

print("\n--- Login Date Range ---")

print(
    "Earliest login:",
    login_history["login_datetime"].min()
)

print(
    "Latest login:",
    login_history["login_datetime"].max()
)


print("\n--- Device Distribution ---")

print(
    login_history["device"].value_counts()
)


print("\n--- Operating System Distribution ---")

print(
    login_history["operating_system"].value_counts()
)


print("\n--- Browser Distribution ---")

print(
    login_history["browser"].value_counts()
)


print("\n--- Session Duration ---")

print(
    login_history["session_duration_minutes"].describe()
)


print("\n--- Total Login Records ---")

print(
    "Total logins:",
    len(login_history)
)


print("\n--- Average Session Duration ---")

print(
    "Average session duration:",
    round(
        login_history["session_duration_minutes"].mean(),
        2
    ),
    "minutes"
)


# 1. DEVICE DISTRIBUTION


device_counts = login_history["device"].value_counts()

print("\n--- Device Distribution ---")
print(device_counts)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=device_counts.index,
    y=device_counts.values
)

plt.title("Login Activity by Device")
plt.xlabel("Device")
plt.ylabel("Number of Logins")

plt.tight_layout()
plt.show()


# 2. SESSION DURATION DISTRIBUTION


plt.figure(figsize=(9, 5))

sns.histplot(
    data=login_history,
    x="session_duration_minutes",
    bins=20,
    kde=True
)

plt.title("Session Duration Distribution")
plt.xlabel("Session Duration (Minutes)")
plt.ylabel("Number of Sessions")

plt.tight_layout()
plt.show()


# 3. MONTHLY LOGIN ACTIVITY


monthly_logins = (
    login_history
    .groupby(
        login_history["login_datetime"].dt.to_period("M")
    )
    .size()
)

print("\n--- Monthly Login Activity ---")
print(monthly_logins)

plt.figure(figsize=(12, 5))

monthly_logins.plot(
    kind="line",
    marker="o"
)

plt.title("Monthly Login Activity")
plt.xlabel("Month")
plt.ylabel("Number of Logins")
plt.xticks(rotation=45)

plt.tight_layout()
plt.show()


# 4. AVERAGE SESSION DURATION BY DEVICE

avg_session_device = (
    login_history
    .groupby("device")["session_duration_minutes"]
    .mean()
    .sort_values(ascending=False)
)

print("\n--- Average Session Duration by Device ---")
print(avg_session_device)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=avg_session_device.index,
    y=avg_session_device.values
)

plt.title("Average Session Duration by Device")
plt.xlabel("Device")
plt.ylabel("Average Session Duration (Minutes)")

plt.tight_layout()
plt.show()

