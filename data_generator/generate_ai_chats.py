import random
import pandas as pd
from faker import Faker
from tqdm import tqdm

from config import engine
from utils import save_to_mysql

fake = Faker()


# SETTINGS


TOTAL_CHATS = 300000


# Load Users

users = pd.read_sql("""
SELECT
    user_id,
    signup_date
FROM Users
""", engine)

topics = [
    "Python Programming",
    "SQL Queries",
    "Machine Learning",
    "Data Science",
    "Power BI",
    "Tableau",
    "Statistics",
    "Excel",
    "Deep Learning",
    "Computer Vision",
    "Natural Language Processing",
    "Data Cleaning",
    "Data Visualization",
    "Interview Preparation",
    "Resume Review",
    "Career Guidance",
    "Cloud Computing",
    "Java Programming",
    "Web Development",
    "Cyber Security"
]

topic_weights = [
    12,10,8,10,8,5,6,7,4,3,
    3,5,5,6,2,4,3,3,4,2
]

rows = []

for _ in tqdm(range(TOTAL_CHATS), desc="Generating AI Chats"):

    user = users.sample(1).iloc[0]

    signup_date = pd.to_datetime(user["signup_date"])

    chat_datetime = fake.date_time_between(
        start_date=signup_date,
        end_date="now"
    )

    topic = random.choices(
        topics,
        weights=topic_weights
    )[0]

    prompt_length = random.randint(20, 800)

    response_time = round(random.uniform(0.5, 8.0), 2)

    tokens_used = random.randint(80, 2500)

    satisfaction = random.choices(
        [1,2,3,4,5],
        weights=[2,5,13,30,50]
    )[0]

    rows.append({

        "user_id": int(user["user_id"]),

        "chat_date": chat_datetime,

        "topic": topic,

        "prompt_length": prompt_length,

        "response_time_seconds": response_time,

        "tokens_used": tokens_used,

        "satisfaction_rating": satisfaction

    })

df = pd.DataFrame(rows)

save_to_mysql(df, "AI_Chats", engine)

print("="*60)
print("AI Chats Generated Successfully!")
print(f"Total Chat Records : {len(df):,}")
print("="*60)