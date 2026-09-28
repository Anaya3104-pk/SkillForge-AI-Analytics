import random
import pandas as pd
from faker import Faker
from config import engine
from utils import save_to_mysql

fake = Faker("en_IN")

NUM_USERS = 50000

professions = (
    ["Student"] * 45 +
    ["Software Engineer"] * 20 +
    ["Data Analyst"] * 10 +
    ["Data Scientist"] * 8 +
    ["Teacher"] * 5 +
    ["Business Analyst"] * 5 +
    ["Other"] * 7
)

countries = (
    ["India"] * 70 +
    ["USA"] * 10 +
    ["UK"] * 5 +
    ["Canada"] * 5 +
    ["Australia"] * 5 +
    ["Germany"] * 5
)

experience_levels = (
    ["Beginner"] * 55 +
    ["Intermediate"] * 30 +
    ["Advanced"] * 15
)

subscriptions = (
    [1] * 60 +   # Free
    [2] * 20 +   # Basic
    [3] * 15 +   # Pro
    [4] * 5      # Enterprise
)

genders = (
    ["Male"] * 52 +
    ["Female"] * 46 +
    ["Other"] * 2
)

users = []

from datetime import date, timedelta

# Generate realistic age distribution
def generate_dob():
    age_group = random.choices(
        population=["18-24", "25-30", "31-40", "41-50", "51-60"],
        weights=[35, 35, 18, 8, 4]   # 70% users are between 18-30
    )[0]

    if age_group == "18-24":
        age = random.randint(18, 24)
    elif age_group == "25-30":
        age = random.randint(25, 30)
    elif age_group == "31-40":
        age = random.randint(31, 40)
    elif age_group == "41-50":
        age = random.randint(41, 50)
    else:
        age = random.randint(51, 60)

    today = date.today()

    # Random birthday within that age
    birthday = today - timedelta(days=age * 365 + random.randint(0, 364))

    return birthday

from datetime import date, timedelta


# Generate a realistic signup date
def generate_signup_date():
    today = date.today()

    # Randomly choose how far back the user joined.
    # More recent years have more users.
    period = random.choices(
        population=["2023", "2024", "2025", "2026"],
        weights=[10, 20, 30, 40]
    )[0]

    if period == "2023":
        start = date(2023, 1, 1)
        end = date(2023, 12, 31)

    elif period == "2024":
        start = date(2024, 1, 1)
        end = date(2024, 12, 31)

    elif period == "2025":
        start = date(2025, 1, 1)
        end = date(2025, 12, 31)

    else:
        start = date(2026, 1, 1)
        end = today

    days = (end - start).days

    return start + timedelta(days=random.randint(0, days))

for i in range(NUM_USERS):

    first_name = fake.first_name()
    last_name = fake.last_name()

    users.append({
        "first_name": first_name,
        "last_name": last_name,
        "email": f"{first_name.lower()}.{last_name.lower()}.{i+1}@skillforge.ai",
        "phone": fake.msisdn()[:10],
        "gender": random.choice(genders),
        "date_of_birth": generate_dob(),
        "country": random.choice(countries),
        "state": fake.state(),
        "city": fake.city(),
        "profession": random.choice(professions),
        "experience_level": random.choice(experience_levels),
        "signup_date": generate_signup_date(),
        "subscription_id": random.choice(subscriptions),
        "account_status": random.choices(
            ["Active", "Inactive", "Suspended"],
            weights=[90, 8, 2]
        )[0]
    })

df = pd.DataFrame(users)

save_to_mysql(df, "Users", engine)

print("Users generated successfully!")

