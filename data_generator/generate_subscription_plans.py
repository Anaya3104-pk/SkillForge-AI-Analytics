import pandas as pd
from config import engine

plans = [
    {
        "plan_name": "Free",
        "monthly_price": 0,
        "duration_months": 1,
        "ai_chat_limit": 20,
        "certificate_access": False,
        "priority_support": False
    },
    {
        "plan_name": "Basic",
        "monthly_price": 499,
        "duration_months": 1,
        "ai_chat_limit": 200,
        "certificate_access": True,
        "priority_support": False
    },
    {
        "plan_name": "Pro",
        "monthly_price": 999,
        "duration_months": 1,
        "ai_chat_limit": 1000,
        "certificate_access": True,
        "priority_support": True
    },
    {
        "plan_name": "Enterprise",
        "monthly_price": 4999,
        "duration_months": 12,
        "ai_chat_limit": 10000,
        "certificate_access": True,
        "priority_support": True
    }
]

df = pd.DataFrame(plans)

df.to_sql(
    "Subscription_Plans",
    con=engine,
    if_exists="append",
    index=False
)

print("Subscription Plans inserted successfully!")