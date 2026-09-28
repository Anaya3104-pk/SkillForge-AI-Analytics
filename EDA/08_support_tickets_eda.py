
# SUPPORT TICKETS EDA


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
support_tickets = pd.read_sql(
    "SELECT * FROM Support_Tickets",
    config.engine
)

print("\n--- Support Tickets Dataset ---")
print("Shape:", support_tickets.shape)

print("\n--- Columns ---")
print(support_tickets.columns.tolist())

print("\n--- Missing Values ---")
print(support_tickets.isnull().sum())

print("\n--- First 5 Rows ---")
print(support_tickets.head())

print("\n--- Data Types ---")
print(support_tickets.dtypes)


# 1. TICKET CATEGORY DISTRIBUTION


category_counts = (
    support_tickets["ticket_category"]
    .value_counts()
)

print("\n--- Ticket Category Distribution ---")
print(category_counts)

plt.figure(figsize=(10, 5))

sns.barplot(
    x=category_counts.values,
    y=category_counts.index
)

plt.title("Support Ticket Category Distribution")
plt.xlabel("Number of Tickets")
plt.ylabel("Ticket Category")

plt.tight_layout()
plt.show()


# 2. TICKET PRIORITY DISTRIBUTION


priority_counts = (
    support_tickets["priority"]
    .value_counts()
)

print("\n--- Ticket Priority Distribution ---")
print(priority_counts)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=priority_counts.index,
    y=priority_counts.values
)

plt.title("Support Ticket Priority Distribution")
plt.xlabel("Priority")
plt.ylabel("Number of Tickets")

plt.tight_layout()
plt.show()


# 3. TICKET STATUS DISTRIBUTION


status_counts = (
    support_tickets["ticket_status"]
    .value_counts()
)

print("\n--- Ticket Status Distribution ---")
print(status_counts)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=status_counts.index,
    y=status_counts.values
)

plt.title("Support Ticket Status Distribution")
plt.xlabel("Ticket Status")
plt.ylabel("Number of Tickets")

plt.tight_layout()
plt.show()


# 4. AVERAGE RESOLUTION TIME BY PRIORITY

resolved_tickets = support_tickets.dropna(
    subset=["resolution_time_hours"]
)

avg_resolution_priority = (
    resolved_tickets
    .groupby("priority")["resolution_time_hours"]
    .mean()
    .sort_values(ascending=False)
)

print("\n--- Average Resolution Time by Priority ---")
print(avg_resolution_priority)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=avg_resolution_priority.index,
    y=avg_resolution_priority.values
)

plt.title("Average Resolution Time by Priority")
plt.xlabel("Priority")
plt.ylabel("Average Resolution Time (Hours)")

plt.tight_layout()
plt.show()


# 5. CUSTOMER RATING DISTRIBUTION


rated_tickets = support_tickets.dropna(
    subset=["customer_rating"]
)

rating_counts = (
    rated_tickets["customer_rating"]
    .value_counts()
    .sort_index()
)

print("\n--- Customer Rating Distribution ---")
print(rating_counts)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=rating_counts.index,
    y=rating_counts.values
)

plt.title("Customer Rating Distribution")
plt.xlabel("Customer Rating")
plt.ylabel("Number of Tickets")

plt.tight_layout()
plt.show()