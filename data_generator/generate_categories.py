import pandas as pd
from config import engine

categories = [
    {"category_name": "Data Science", "description": "Data analysis, visualization and machine learning"},
    {"category_name": "Python", "description": "Python programming from basics to advanced"},
    {"category_name": "SQL", "description": "Database design and SQL querying"},
    {"category_name": "Machine Learning", "description": "Regression, classification and clustering"},
    {"category_name": "Artificial Intelligence", "description": "AI concepts and applications"},
    {"category_name": "Cloud Computing", "description": "AWS, Azure and Google Cloud"},
    {"category_name": "Web Development", "description": "Frontend and backend development"},
    {"category_name": "Cyber Security", "description": "Network and application security"},
    {"category_name": "Power BI", "description": "Business intelligence and dashboards"},
    {"category_name": "Tableau", "description": "Data visualization using Tableau"}
]

df = pd.DataFrame(categories)

df.to_sql(
    "Categories",
    con=engine,
    if_exists="append",
    index=False
)

print("Categories inserted successfully!")