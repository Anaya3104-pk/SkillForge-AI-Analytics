
# AI CHATS EDA


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
ai_chats = pd.read_sql("SELECT * FROM AI_Chats", config.engine)

print("\n--- AI Chats Dataset ---")
print("Shape:", ai_chats.shape)

print("\n--- Columns ---")
print(ai_chats.columns.tolist())

print("\n--- Missing Values ---")
print(ai_chats.isnull().sum())

print("\n--- First 5 Rows ---")
print(ai_chats.head())

print("\n--- Data Types ---")
print(ai_chats.dtypes)


# 1. AI CHAT TOPIC DISTRIBUTION


topic_counts = (
    ai_chats["topic"]
    .value_counts()
)

print("\n--- AI Chat Topics ---")
print(topic_counts)

plt.figure(figsize=(10, 5))

sns.barplot(
    x=topic_counts.values,
    y=topic_counts.index
)

plt.title("AI Chat Topic Distribution")
plt.xlabel("Number of Chats")
plt.ylabel("Topic")

plt.tight_layout()
plt.show()


# 2. AI RESPONSE TIME DISTRIBUTION


print("\n--- Response Time Statistics ---")
print(ai_chats["response_time_seconds"].describe())

plt.figure(figsize=(9, 5))

sns.histplot(
    data=ai_chats,
    x="response_time_seconds",
    bins=30,
    kde=True
)

plt.title("AI Response Time Distribution")
plt.xlabel("Response Time (Seconds)")
plt.ylabel("Number of Chats")

plt.tight_layout()
plt.show()


# 3. TOKEN USAGE DISTRIBUTION

print("\n--- Token Usage Statistics ---")
print(ai_chats["tokens_used"].describe())

plt.figure(figsize=(9, 5))

sns.histplot(
    data=ai_chats,
    x="tokens_used",
    bins=30,
    kde=True
)

plt.title("AI Token Usage Distribution")
plt.xlabel("Tokens Used")
plt.ylabel("Number of Chats")

plt.tight_layout()
plt.show()


# 4. AI CHAT SATISFACTION RATING

satisfaction_counts = (
    ai_chats["satisfaction_rating"]
    .value_counts()
    .sort_index()
)

print("\n--- Satisfaction Rating Distribution ---")
print(satisfaction_counts)

plt.figure(figsize=(8, 5))

sns.barplot(
    x=satisfaction_counts.index,
    y=satisfaction_counts.values
)

plt.title("AI Chat Satisfaction Rating Distribution")
plt.xlabel("Satisfaction Rating")
plt.ylabel("Number of Chats")

plt.tight_layout()
plt.show()