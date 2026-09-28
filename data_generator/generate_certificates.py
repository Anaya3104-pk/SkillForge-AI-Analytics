import random
import pandas as pd

from config import engine
from utils import save_to_mysql


# Load Completed Enrollments


enrollments = pd.read_sql("""
SELECT
    user_id,
    course_id,
    completion_date
FROM Enrollments
WHERE completion_status = 'Completed'
  AND certificate_earned = 1
""", engine)

rows = []

for _, row in enrollments.iterrows():

    certificate_number = (
        f"SF-{row['user_id']:05d}-"
        f"{row['course_id']:03d}-"
        f"{random.randint(100000,999999)}"
    )

    rows.append({

        "user_id": row["user_id"],

        "course_id": row["course_id"],

        "issue_date": row["completion_date"],

        "certificate_number": certificate_number

    })

df = pd.DataFrame(rows)

save_to_mysql(df, "Certificates", engine)

print("=" * 50)
print("Certificates Generated Successfully!")
print(f"Total Certificates : {len(df):,}")
print("=" * 50)