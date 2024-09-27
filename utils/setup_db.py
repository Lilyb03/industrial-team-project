import psycopg2
import pandas as pd
from faker import Faker

fake = Faker()

NUM_CUSTOMERS = 1000


def connect_to_aurora():
    connection = psycopg2.connect(
        database="postgres",
        user="malarcays",
        password="malarcays1234",
        host="malarcaysdb.cluster-c3s60cs04s05.eu-west-1.rds.amazonaws.com",
        port="5432",
    )
    cur = connection.cursor()

    return connection, cur


def insert_tables(cur):
    with open("./db_setup.sql", "r") as f:
        cur.execute(f.read())


def insert_company_data(cur):
    data_df = pd.read_excel("Industrial Project Dataset.xlsx")

    company_query = "INSERT INTO company (company_id, details_id, spending_category, carbon, waste, sustainability, greenscore) VALUES "
    type_query = "INSERT INTO type (type_id, type_name) VALUES (1, 'customer'), (2, 'company'), (3, 'admin');"
    details_query = "INSERT INTO details (details_id, name) VALUES "
    accounts_query = "INSERT INTO account (account_number, details_id, company_id, type_id, amount) VALUES "

    for i, row in data_df.iterrows():
        details_query += f"({i+1}, '{row['Company Name']}'),"
        company_query += f"({i+1}, {i+1}, '{row['Spending Category']}', {row['Carbon Emissions']}, {row['Waste Management']}, {row['Sustainability Practices']}, {(row['Carbon Emissions'] + row['Waste Management'] + row['Sustainability Practices']) / 30}),"
        accounts_query += f"({row['Account Number']}, {i+1}, {i+1}, 2, 0),"

    company_query = company_query[:-1] + ";"
    details_query = details_query[:-1] + ";"
    accounts_query = accounts_query[:-1] + ";"

    cur.execute(type_query)
    cur.execute(details_query)
    cur.execute(company_query)
    cur.execute(accounts_query)

    return i


def generate_customer_data(num_entries, num_companies):
    details_query = "INSERT INTO details (details_id, name, last_name) VALUES "
    account_query = (
        "INSERT INTO account (account_number, details_id, type_id, amount) VALUES "
    )

    for i in range(num_entries):
        first_name = fake.first_name()
        last_name = fake.last_name()
        details_query += f"({num_companies + i}, '{first_name}', '{last_name}'),"
        account_query += f"({num_companies + i}, {num_companies + i}, 1, 0),"

    details_query = details_query[:-1] + ";"
    account_query = account_query[:-1] + ";"

    cur.execute(details_query)
    cur.execute(account_query)


if __name__ == "__main__":
    conn, cur = connect_to_aurora()

    print("----------- Inserting Tables -------------")
    insert_tables(cur)

    print("----------- Inserting Companies ----------")
    num_companies = insert_company_data(cur)

    print("----------- Inserting Customers ----------")
    generate_customer_data(NUM_CUSTOMERS, num_companies + 2)

    cur.execute("select * from account")
    print(len(cur.fetchall()))

    conn.commit()

    cur.close()
    conn.close()
