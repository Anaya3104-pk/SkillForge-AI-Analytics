import random
import pandas as pd
from faker import Faker
from tqdm import tqdm

from config import engine
from utils import save_to_mysql

fake = Faker()

# ---------------------------------------
# SETTINGS
# ---------------------------------------

TOTAL_TICKETS = 12000

# ---------------------------------------
# Load Users
# ---------------------------------------

users = pd.read_sql("""
SELECT
    user_id,
    signup_date
FROM Users
""", engine)

categories = [
    "Payment",
    "Course",
    "Technical",
    "AI Tutor",
    "Account"
]

category_weights = [
    25,
    25,
    20,
    15,
    15
]

priorities = ["Low", "Medium", "High"]
priority_weights = [50, 35, 15]

statuses = ["Open", "Resolved", "Closed"]
status_weights = [10, 50, 40]

rows = []

for _ in tqdm(range(TOTAL_TICKETS), desc="Generating Support Tickets"):

    user = users.sample(1).iloc[0]

    signup_date = pd.to_datetime(user["signup_date"])

    created_date = fake.date_time_between(
        start_date=signup_date,
        end_date="now"
    )

    status = random.choices(
        statuses,
        weights=status_weights
    )[0]

    if status == "Open":

        resolved_date = None
        resolution_time = None
        rating = None

    else:

        resolution_time = round(random.uniform(1, 72), 2)

        resolved_date = (
            created_date +
            pd.Timedelta(hours=resolution_time)
        )

        rating = random.choices(
            [1,2,3,4,5],
            weights=[2,5,13,30,50]
        )[0]

    rows.append({

        "user_id": int(user["user_id"]),

        "ticket_category": random.choices(
            categories,
            weights=category_weights
        )[0],

        "priority": random.choices(
            priorities,
            weights=priority_weights
        )[0],

        "ticket_status": status,

        "created_date": created_date,

        "resolved_date": resolved_date,

        "resolution_time_hours": resolution_time,

        "customer_rating": rating

    })

df = pd.DataFrame(rows)

save_to_mysql(df, "Support_Tickets", engine)

print("=" * 60)
print("Support Tickets Generated Successfully!")
print(f"Total Tickets : {len(df):,}")
print("=" * 60)