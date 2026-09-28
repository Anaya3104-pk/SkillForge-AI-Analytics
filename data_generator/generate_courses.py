import random
import pandas as pd
from faker import Faker

from config import engine
from utils import save_to_mysql

fake = Faker()

courses_by_category = {
    1: [
        "Data Science Fundamentals",
        "Statistics for Data Science",
        "Python for Data Science",
        "Data Cleaning with Pandas",
        "Exploratory Data Analysis",
        "Feature Engineering",
        "Machine Learning Foundations",
        "Advanced Data Science",
        "End-to-End Data Science Project",
        "Data Science Interview Prep"
    ],

    2: [
        "Python Basics",
        "Python Programming Masterclass",
        "Object-Oriented Python",
        "Python File Handling",
        "Python Automation",
        "REST APIs with Python",
        "Web Scraping using Python",
        "Advanced Python",
        "Python Interview Questions",
        "Python Projects Bootcamp"
    ],

    3: [
        "SQL Fundamentals",
        "SQL Joins",
        "SQL Aggregations",
        "Window Functions",
        "Stored Procedures",
        "Database Design",
        "Advanced SQL",
        "Performance Tuning",
        "SQL for Analytics",
        "SQL Interview Prep"
    ],

    4: [
        "Machine Learning Basics",
        "Regression Models",
        "Classification Models",
        "Decision Trees",
        "Random Forest",
        "XGBoost Essentials",
        "Model Evaluation",
        "Feature Selection",
        "Advanced Machine Learning",
        "ML Projects"
    ],

    5: [
        "Introduction to AI",
        "Search Algorithms",
        "Neural Networks",
        "Deep Learning",
        "Computer Vision",
        "Natural Language Processing",
        "Generative AI",
        "Prompt Engineering",
        "LLMs in Practice",
        "AI Capstone"
    ],

    6: [
        "Cloud Computing Basics",
        "AWS Fundamentals",
        "Azure Essentials",
        "Google Cloud Platform",
        "Virtualization",
        "Docker Basics",
        "Kubernetes",
        "Cloud Security",
        "Serverless Computing",
        "Cloud Architecture"
    ],

    7: [
        "Power BI Basics",
        "Power Query",
        "Data Modeling",
        "DAX Fundamentals",
        "Advanced DAX",
        "Interactive Dashboards",
        "Power BI Service",
        "Power BI Projects",
        "Business Reporting",
        "Power BI Interview Prep"
    ],

    8: [
        "Tableau Basics",
        "Tableau Charts",
        "Calculated Fields",
        "LOD Expressions",
        "Dashboard Design",
        "Advanced Tableau",
        "Tableau Prep",
        "Storytelling with Tableau",
        "Business Dashboards",
        "Tableau Interview Prep"
    ],

    9: [
        "HTML & CSS",
        "JavaScript Basics",
        "Responsive Web Design",
        "React Fundamentals",
        "Node.js Basics",
        "Express.js",
        "MongoDB",
        "Full Stack Development",
        "REST API Development",
        "Web Development Bootcamp"
    ],

    10: [
        "Cyber Security Basics",
        "Network Security",
        "Ethical Hacking",
        "Penetration Testing",
        "Cryptography",
        "Web Security",
        "Cloud Security",
        "SOC Fundamentals",
        "Incident Response",
        "Cyber Security Projects"
    ]
}

rows = []

for category_id, course_list in courses_by_category.items():

    for course in course_list:

        difficulty = random.choices(
            ["Beginner", "Intermediate", "Advanced"],
            weights=[3,4,3]
        )[0]

        if difficulty == "Beginner":
            duration = random.randint(8,20)
            price = random.choice([999,1499,1999])

        elif difficulty == "Intermediate":
            duration = random.randint(20,40)
            price = random.choice([2499,2999,3499,3999])

        else:
            duration = random.randint(40,80)
            price = random.choice([4499,4999,5999,6999,7999])

        rows.append({
            "course_name": course,
            "category_id": category_id,
            "instructor_id": random.randint(1,30),
            "difficulty": difficulty,
            "duration_hours": duration,
            "price": price,
            "launch_date": fake.date_between(start_date="-3y", end_date="today"),
            "language": "English",
            "status": random.choices(
                ["Active","Archived"],
                weights=[95,5]
            )[0]
        })

df = pd.DataFrame(rows)

save_to_mysql(df,"Courses",engine)

print("✅ 100 Courses Generated Successfully!")