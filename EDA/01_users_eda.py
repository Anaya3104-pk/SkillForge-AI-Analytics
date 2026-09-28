import sys
from pathlib import Path

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_GENERATOR = PROJECT_ROOT / "data_generator"

# Make sure Python looks in our project folder FIRST
sys.path.insert(0, str(DATA_GENERATOR))

# Import our project's config.py
import config

# Get the SQLAlchemy engine
engine = config.engine

print("Database engine loaded successfully!")

# Test connection
test = pd.read_sql("SELECT 1 AS connection_test", engine)

print(test)


# 1. USERS DATASET

users = pd.read_sql("SELECT * FROM Users", engine)

print("\nUsers dataset loaded successfully!")
print("Shape:", users.shape)

print("\nFirst 5 rows:")
print(users.head())

print("\nColumn information:")
print(users.info())

print("\nBasic statistics:")
print(users.describe(include="all"))


# 2. DATA QUALITY CHECKS

print("\n--- Missing Values ---")
print(users.isnull().sum())

print("\n--- Duplicate Rows ---")
print("Duplicate rows:", users.duplicated().sum())

print("\n--- Duplicate User IDs ---")
print("Duplicate user IDs:", users["user_id"].duplicated().sum())

print("\n--- Duplicate Emails ---")
print("Duplicate emails:", users["email"].duplicated().sum())

print("\n--- Account Status Distribution ---")
print(users["account_status"].value_counts())

print("\n--- Experience Level Distribution ---")
print(users["experience_level"].value_counts())

print("\n--- Gender Distribution ---")
print(users["gender"].value_counts())


# 3. DATE CONVERSION

users["date_of_birth"] = pd.to_datetime(users["date_of_birth"])
users["signup_date"] = pd.to_datetime(users["signup_date"])

print("\nDate columns converted successfully!")

print(users[["date_of_birth", "signup_date"]].dtypes)


# 4. USER AGE ANALYSIS


today = pd.Timestamp.today()

users["age"] = (
    (today - users["date_of_birth"]).dt.days / 365.25
).round(1)

print("\n--- Age Statistics ---")
print(users["age"].describe())

print("\nYoungest user:", users["age"].min())
print("Oldest user:", users["age"].max())
print("Average age:", users["age"].mean())



# 5. USER AGE DISTRIBUTION


plt.figure(figsize=(10, 6))

sns.histplot(
    users["age"],
    bins=20,
    kde=True
)

plt.title("Age Distribution of SkillForge Users")
plt.xlabel("Age")
plt.ylabel("Number of Users")
plt.tight_layout()

plt.show()


# 7. USER SIGNUP TREND


users["signup_month"] = users["signup_date"].dt.to_period("M")

signup_trend = (
    users.groupby("signup_month")
    .size()
    .reset_index(name="new_users")
)

# Convert Period to Timestamp for plotting
signup_trend["signup_month"] = signup_trend["signup_month"].dt.to_timestamp()

print("\n--- Monthly User Signups ---")
print(signup_trend)

plt.figure(figsize=(12, 6))

sns.lineplot(
    data=signup_trend,
    x="signup_month",
    y="new_users",
    marker="o"
)

plt.title("Monthly User Signup Trend")
plt.xlabel("Signup Month")
plt.ylabel("New Users")
plt.xticks(rotation=45)
plt.tight_layout()

plt.show()


# 8. SUBSCRIPTION & ACCOUNT STATUS


print("\n--- Subscription Distribution ---")

subscription_counts = users["subscription_id"].value_counts().sort_index()
print(subscription_counts)

print("\n--- Account Status Distribution ---")

account_status_counts = users["account_status"].value_counts()
print(account_status_counts)

plt.figure(figsize=(8, 5))

print("\nUsers shape before account status chart:", users.shape)

print("\nAccount status counts:")
print(users["account_status"].value_counts())

print("\nTotal users:", users["account_status"].count())


sns.countplot(
    data=users,
    x="account_status"
)

plt.title("User Account Status Distribution")
plt.xlabel("Account Status")
plt.ylabel("Number of Users")
plt.tight_layout()

plt.show()

plt.figure(figsize=(8, 5))


sns.countplot(
    data=users,
    x="subscription_id"
)

plt.title("Users by Subscription Plan")
plt.xlabel("Subscription Plan ID")
plt.ylabel("Number of Users")
plt.tight_layout()

plt.show()


# 9. PROFESSION DISTRIBUTION


profession_counts = (
    users["profession"]
    .value_counts()
    .sort_values(ascending=False)
)

print("\n--- Profession Distribution ---")
print(profession_counts)

plt.figure(figsize=(10, 6))

sns.barplot(
    x=profession_counts.values,
    y=profession_counts.index
)

plt.title("SkillForge Users by Profession")
plt.xlabel("Number of Users")
plt.ylabel("Profession")
plt.tight_layout()

plt.show()


# 10. COURSES DATASET

courses = pd.read_sql("SELECT * FROM Courses", engine)

print("\nCourses dataset loaded successfully!")
print("Shape:", courses.shape)

print("\nFirst 5 rows:")
print(courses.head())

print("\nColumn information:")
print(courses.info())

print("\nBasic statistics:")
print(courses.describe(include="all"))