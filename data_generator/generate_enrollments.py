import random
from datetime import timedelta

import pandas as pd
from faker import Faker
from tqdm import tqdm

from config import engine
from utils import save_to_mysql

fake = Faker()


# Project Date Range

PROJECT_END_DATE = pd.Timestamp("2026-12-31")


# Load Users & Courses


users = pd.read_sql("""
SELECT user_id,
       signup_date,
       subscription_id
FROM Users
""", engine)

courses = pd.read_sql("""
SELECT course_id,
       difficulty
FROM Courses
""", engine)

course_ids = courses["course_id"].tolist()

difficulty_lookup = dict(
    zip(courses["course_id"], courses["difficulty"])
)


# Helper Functions

def get_num_courses(subscription):

    if subscription == 1:      # Free
        return random.randint(1, 2)

    elif subscription == 2:    # Basic
        return random.randint(2, 4)

    elif subscription == 3:    # Pro
        return random.randint(4, 8)

    else:                      # Enterprise
        return random.randint(8, 15)


def get_status(difficulty):

    if difficulty == "Beginner":
        return random.choices(
            ["Completed", "In Progress", "Dropped"],
            weights=[85, 10, 5]
        )[0]

    elif difficulty == "Intermediate":
        return random.choices(
            ["Completed", "In Progress", "Dropped"],
            weights=[65, 20, 15]
        )[0]

    else:
        return random.choices(
            ["Completed", "In Progress", "Dropped"],
            weights=[40, 35, 25]
        )[0]


def get_rating():

    return random.choices(
        [5, 4, 3, 2, 1],
        weights=[45, 35, 15, 3, 2]
    )[0]



# Generate Enrollments

rows = []

for _, user in tqdm(
    users.iterrows(),
    total=len(users),
    desc="Generating Enrollments"
):

    user_id = int(user["user_id"])
    signup_date = pd.to_datetime(user["signup_date"])
    subscription = int(user["subscription_id"])

    num_courses = get_num_courses(subscription)

    selected_courses = random.sample(course_ids, num_courses)

    for course in selected_courses:

        difficulty = difficulty_lookup[course]

        status = get_status(difficulty)

        
        # Generate Enrollment Date
        
        max_enrollment_days = (
            PROJECT_END_DATE - signup_date
        ).days

        if max_enrollment_days > 0:

            enroll_date = signup_date + timedelta(
                days=random.randint(
                    0,
                    max_enrollment_days
                )
            )

        else:

            enroll_date = signup_date

        
        # Completed
        
        if status == "Completed":

            completion_percentage = 100

            max_completion_days = (
                PROJECT_END_DATE - enroll_date
            ).days

            # Need at least 7 days to complete
            if max_completion_days >= 7:

                completion_date = enroll_date + timedelta(
                    days=random.randint(
                        7,
                        min(90, max_completion_days)
                    )
                )

                certificate = 1
                rating = get_rating()

            else:

                # Not enough time remaining in 2026
                # Convert to In Progress
                status = "In Progress"

                completion_percentage = random.randint(
                    10,
                    99
                )

                completion_date = None
                certificate = 0
                rating = None

        
        # In Progress
        

        elif status == "In Progress":

            completion_percentage = random.randint(
                10,
                99
            )

            completion_date = None

            certificate = 0

            rating = None

        
        # Dropped
        
        else:

            completion_percentage = random.randint(
                5,
                50
            )

            completion_date = None

            certificate = 0

            rating = None

        
        # Add Row
        
        rows.append({

            "user_id": user_id,

            "course_id": course,

            "enrollment_date": enroll_date.date(),

            "completion_percentage": completion_percentage,

            "completion_status": status,

            "completion_date": (
                completion_date.date()
                if completion_date
                else None
            ),

            "certificate_earned": certificate,

            "rating_given": rating

        })



# Save to MySQL

df = pd.DataFrame(rows)

save_to_mysql(
    df,
    "Enrollments",
    engine
)

print("=" * 50)
print("Enrollments Generated Successfully!")
print(f"Total Records: {len(df):,}")
print("=" * 50)