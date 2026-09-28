
# SKILLFORGE AI ANALYTICS
# PAYMENTS EDA


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



# LOAD PAYMENTS DATA


payments = pd.read_sql(
    "SELECT * FROM Payments",
    engine
)

print("\nPayments dataset loaded successfully!")
print("Shape:", payments.shape)

print("\nFirst 5 rows:")
print(payments.head())

print("\nColumn information:")
print(payments.info())

print("\nBasic statistics:")
print(payments.describe(include="all"))

print("\nMissing values:")
print(payments.isnull().sum())



# DATA TYPE CONVERSION


payments["payment_date"] = pd.to_datetime(
    payments["payment_date"]
)



# BASIC PAYMENT ANALYSIS


print("\n--- Payment Date Range ---")
print("Earliest payment:", payments["payment_date"].min())
print("Latest payment:", payments["payment_date"].max())

print("\n--- Payment Status ---")
print(payments["payment_status"].value_counts())

print("\n--- Payment Method ---")
print(payments["payment_method"].value_counts())

print("\n--- Payment Amount ---")
print(payments["amount"].describe())

print("\n--- Total Revenue ---")
print("Total payment amount: ₹",
      round(payments["amount"].sum(), 2))

print("\n--- Average Payment ---")
print("Average payment: ₹",
      round(payments["amount"].mean(), 2))




# 1. PAYMENT STATUS DISTRIBUTION


payment_status_counts = payments["payment_status"].value_counts()

print("\n--- Payment Status Distribution ---")
print(payment_status_counts)

plt.figure(figsize=(8, 5))

sns.countplot(
    data=payments,
    x="payment_status",
    order=payment_status_counts.index
)

plt.title("Payment Status Distribution")
plt.xlabel("Payment Status")
plt.ylabel("Number of Payments")

plt.tight_layout()
plt.show()


# 2. PAYMENT METHOD DISTRIBUTION

payment_method_counts = payments["payment_method"].value_counts()

print("\n--- Payment Method Distribution ---")
print(payment_method_counts)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=payment_method_counts.index,
    y=payment_method_counts.values
)

plt.title("Payment Method Distribution")
plt.xlabel("Payment Method")
plt.ylabel("Number of Payments")

plt.xticks(rotation=20)

plt.tight_layout()
plt.show()


# 3. MONTHLY SUCCESSFUL REVENUE

successful_payments = payments[
    payments["payment_status"] == "Success"
].copy()

monthly_revenue = (
    successful_payments
    .groupby(
        successful_payments["payment_date"].dt.to_period("M")
    )["amount"]
    .sum()
)

print("\n--- Monthly Successful Revenue ---")
print(monthly_revenue)

print("\nTotal Successful Revenue: ₹",
      round(successful_payments["amount"].sum(), 2))

plt.figure(figsize=(12, 5))

monthly_revenue.plot(
    kind="line",
    marker="o"
)

plt.title("Monthly Successful Revenue")
plt.xlabel("Month")
plt.ylabel("Revenue (₹)")
plt.xticks(rotation=45)

plt.tight_layout()
plt.show()


# 4. PAYMENT AMOUNT DISTRIBUTION

plt.figure(figsize=(9, 5))

sns.histplot(
    data=payments,
    x="amount",
    bins=15,
    kde=True
)

plt.title("Payment Amount Distribution")
plt.xlabel("Payment Amount (₹)")
plt.ylabel("Number of Payments")

plt.tight_layout()
plt.show()


# 5. REVENUE BY SUBSCRIPTION PLAN

subscription_plans = pd.read_sql(
    "SELECT subscription_id, plan_name FROM Subscription_Plans",
    engine
)

successful_payments = payments[
    payments["payment_status"] == "Success"
].copy()

plan_revenue = (
    successful_payments
    .groupby("subscription_id")["amount"]
    .sum()
    .reset_index(name="revenue")
    .merge(
        subscription_plans,
        on="subscription_id",
        how="left"
    )
    .sort_values(
        "revenue",
        ascending=False
    )
)

print("\n--- Revenue by Subscription Plan ---")
print(
    plan_revenue[
        ["plan_name", "revenue"]
    ].to_string(index=False)
)

plt.figure(figsize=(8, 5))

sns.barplot(
    data=plan_revenue,
    x="plan_name",
    y="revenue"
)

plt.title("Successful Revenue by Subscription Plan")
plt.xlabel("Subscription Plan")
plt.ylabel("Revenue (₹)")

plt.tight_layout()
plt.show()