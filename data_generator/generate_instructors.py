import random
import pandas as pd
from faker import Faker
from config import engine

fake = Faker("en_IN")

specializations = [
    "Python",
    "SQL",
    "Machine Learning",
    "Data Science",
    "Power BI",
    "Tableau",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cyber Security",
    "Web Development"
]

data = []

for _ in range(30):
    data.append({
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "email": fake.unique.email(),
        "specialization": random.choice(specializations),
        "experience_years": random.randint(2,20),
        "rating": round(random.uniform(3.5,5.0),2),
        "joining_date": fake.date_between(start_date="-8y", end_date="today")
    })

df = pd.DataFrame(data)

df.to_sql(
    "Instructors",
    con=engine,
    if_exists="append",
    index=False
)

print("30 instructors inserted successfully!")