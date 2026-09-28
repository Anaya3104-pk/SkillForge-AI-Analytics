import pandas as pd

def save_to_mysql(df, table_name, engine):
    df.to_sql(
        table_name,
        con=engine,
        if_exists="append",
        index=False,
        chunksize=1000,
        method="multi"
    )

    print(f"✅ {len(df):,} rows inserted into {table_name}")