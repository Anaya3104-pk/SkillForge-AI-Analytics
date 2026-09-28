import random
import pandas as pd
from faker import Faker

from config import engine
from utils import save_to_mysql

fake = Faker()

# --------------------------------
# Load Paid Users
# --------------------------------

users = pd.read_sql("""
SELECT user_id,
       signup_date,
       subscription_id
FROM Users
WHERE subscription_id IN (2,3,4)
""", engine)

rows = []

payment_methods = [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Net Banking",
    "Wallet"
]

coupon_codes = [
    None,
    None,
    None,
    None,
    "WELCOME10",
    "SAVE20",
    "NEWUSER",
    "FESTIVE25"
]

for _, user in users.iterrows():

    subscription = int(user["subscription_id"])

    payment_date = (
        pd.to_datetime(user["signup_date"])
        + pd.Timedelta(days=random.randint(0, 15))
    )

    if subscription == 2:

        amount = random.choice([999, 1499, 1999])

    elif subscription == 3:

        amount = random.choice([2999, 3999, 4999])

    else:

        amount = random.choice([9999, 14999, 19999])

    coupon = random.choice(coupon_codes)

    if coupon is None:
        discount = 0

    else:
        discount = random.choice([100, 200, 300, 500])

    rows.append({

        "user_id": user["user_id"],

        "subscription_id": subscription,

        "payment_date": payment_date.date(),

        "amount": amount,

        "payment_method": random.choices(
            payment_methods,
            weights=[40,25,20,10,5]
        )[0],

        "payment_status": random.choices(
            ["Success","Pending","Failed"],
            weights=[94,3,3]
        )[0],

        "discount_amount": discount,

        "coupon_code": coupon

    })

df = pd.DataFrame(rows)

save_to_mysql(df, "Payments", engine)

print("="*50)
print("Payments Generated Successfully!")
print(f"Total Payments : {len(df):,}")
print("="*50)