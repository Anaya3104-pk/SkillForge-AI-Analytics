import random
import pandas as pd
from faker import Faker
from tqdm import tqdm

from config import engine
from utils import save_to_mysql

fake = Faker()

# -----------------------------------
# SETTINGS
# -----------------------------------

TOTAL_LOGINS = 500000

# -----------------------------------
# Load Users
# -----------------------------------

users = pd.read_sql("""
SELECT
    user_id,
    signup_date
FROM Users
""", engine)

devices = ["Desktop", "Mobile", "Tablet"]
device_weights = [35, 55, 10]

mobile_os = ["Android", "iOS"]
desktop_os = ["Windows", "macOS", "Linux"]
tablet_os = ["Android", "iPadOS"]

browsers = [
    "Chrome",
    "Edge",
    "Firefox",
    "Safari",
    "Opera"
]

browser_weights = [60, 15, 10, 10, 5]

rows = []

for _ in tqdm(range(TOTAL_LOGINS), desc="Generating Login History"):

    user = users.sample(1).iloc[0]

    signup_date = pd.to_datetime(user["signup_date"])

    login_datetime = fake.date_time_between(
        start_date=signup_date,
        end_date="now"
    )

    device = random.choices(
        devices,
        weights=device_weights
    )[0]

    if device == "Mobile":
        operating_system = random.choices(
            mobile_os,
            weights=[75, 25]
        )[0]

    elif device == "Desktop":
        operating_system = random.choices(
            desktop_os,
            weights=[70, 20, 10]
        )[0]

    else:
        operating_system = random.choices(
            tablet_os,
            weights=[70, 30]
        )[0]

    browser = random.choices(
        browsers,
        weights=browser_weights
    )[0]

    session_duration = random.randint(3, 180)

    logout_datetime = (
        login_datetime
        + pd.Timedelta(minutes=session_duration)
    )

    rows.append({

        "user_id": int(user["user_id"]),

        "login_datetime": login_datetime,

        "logout_datetime": logout_datetime,

        "device": device,

        "operating_system": operating_system,

        "browser": browser,

        "session_duration_minutes": session_duration

    })

df = pd.DataFrame(rows)

save_to_mysql(df, "Login_History", engine)

print("=" * 60)
print("Login History Generated Successfully!")
print(f"Total Login Records : {len(df):,}")
print("=" * 60)