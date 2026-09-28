import random
import pandas as pd
from faker import Faker
from tqdm import tqdm

from config import engine
from utils import save_to_mysql

fake = Faker()


# SETTINGS


TOTAL_RECORDS = 1000000


# Load Users


users = pd.read_sql("""
SELECT
    user_id,
    signup_date
FROM Users
""", engine)

features = [
    "Video Lectures",
    "AI Tutor",
    "Coding Practice",
    "Quiz",
    "Assignments",
    "Practice Tests",
    "Discussion Forum",
    "Certificates",
    "Downloads",
    "Progress Tracker",
    "Notes",
    "Course Search",
    "Bookmarks",
    "Learning Path",
    "Profile"
]

feature_weights = [
    20,   # Video Lectures
    15,   # AI Tutor
    12,   # Coding Practice
    10,   # Quiz
    8,    # Assignments
    7,    # Practice Tests
    5,    # Discussion Forum
    3,    # Certificates
    4,    # Downloads
    5,    # Progress Tracker
    3,    # Notes
    3,    # Course Search
    2,    # Bookmarks
    2,    # Learning Path
    1     # Profile
]

devices = ["Desktop", "Mobile", "Tablet"]
device_weights = [35, 55, 10]

rows = []

for _ in tqdm(range(TOTAL_RECORDS), desc="Generating Feature Usage"):

    user = users.sample(1).iloc[0]

    signup_date = pd.to_datetime(user["signup_date"])

    usage_datetime = fake.date_time_between(
        start_date=signup_date,
        end_date="now"
    )

    feature = random.choices(
        features,
        weights=feature_weights
    )[0]

    session_duration = random.randint(1, 120)

    device = random.choices(
        devices,
        weights=device_weights
    )[0]

    rows.append({

        "user_id": int(user["user_id"]),

        "feature_name": feature,

        "usage_date": usage_datetime,

        "session_duration_minutes": session_duration,

        "device": device

    })

df = pd.DataFrame(rows)

save_to_mysql(df, "Feature_Usage", engine)

print("=" * 60)
print("Feature Usage Generated Successfully!")
print(f"Total Records : {len(df):,}")
print("=" * 60)