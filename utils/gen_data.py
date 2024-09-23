import mysql.connector
from mysql.connector import Error
from faker import Faker
import random

fake = Faker()

# database log in info
host = "213.7.210.115"
database = "uni"
user = "mod"
password = "Pavlakis123.."


# connect to database
def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host=host, database=database, user=user, password=password
        )
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None


# function to generate the data
def insert_data(connection, query, data, return_last_ids=False):
    try:
        cursor = connection.cursor()
        cursor.executemany(query, data)
        connection.commit()
        if return_last_ids:
            last_id = cursor.lastrowid
            cursor.close()
            return [last_id + i for i in range(len(data))]
        print(f"{cursor.rowcount} rows inserted successfully.")
    except Error as e:
        print(f"Failed to insert data: {e}")
    finally:
        cursor.close()


# Generates random data for companies and selects a category from the list below
def generate_random_data(num_entries, entity_type):
    company_categories = [
        "Technology",
        "Agriculture",
        "Groceries",
        "Waste Management",
        "Fuel",
        "Healthcare",
        "Fashion",
        "Entertainment",
        "Construction",
        "Transport",
        "Telecommunications",
        "Education",
        "Energy",
        "Automotive",
        "Hospitality",
    ]

    details_data = []
    company_data = []
    account_data = []

    for i in range(num_entries):
        if entity_type == "customer":
            first_name = fake.first_name()
            last_name = fake.last_name()
            details_data.append((first_name, last_name))
        else:
            company_name = fake.company()
            details_data.append((company_name, None))

        type_id = 1 if entity_type == "customer" else 2

        if entity_type == "company":
            spending_category = random.choice(company_categories)
            carbon = random.randint(1, 10)
            waste = random.randint(1, 10)
            sustainability = random.randint(1, 10)
            company_data.append(
                (None, spending_category, carbon, waste, sustainability)
            )

        account_data.append((None, type_id))

    return details_data, company_data, account_data


# Function to populate database
def populate_database(num_entries, entity_type):
    connection = connect_to_database()

    if connection:
        details_data, company_data, account_data = generate_random_data(
            num_entries, entity_type
        )

        details_query = """
        INSERT INTO details (name, last_name)
        VALUES (%s, %s)
        """
        details_ids = insert_data(
            connection, details_query, details_data, return_last_ids=True
        )

        if entity_type == "company" and company_data:
            # Insert data into the 'company' table with the correct details_id
            company_query = """
            INSERT INTO company (details_id, spending_category, carbon, waste, sustainability)
            VALUES (%s, %s, %s, %s, %s)
            """
            company_data_with_ids = [
                (
                    details_ids[i],
                    company_data[i][1],
                    company_data[i][2],
                    company_data[i][3],
                    company_data[i][4],
                )
                for i in range(num_entries)
            ]
            insert_data(connection, company_query, company_data_with_ids)

            # Update account data to include correct company_id
            cursor = connection.cursor()
            cursor.execute("SELECT details_id FROM company")
            company_ids = cursor.fetchall()
            cursor.close()

            # Had to map the id since the details id are not the same as the company ids
            company_id_map = {
                details_ids[i]: company_ids[i][0] for i in range(num_entries)
            }
            account_data = [
                (details_ids[i], company_id_map[details_ids[i]], 2)
                for i in range(num_entries)
            ]
        else:
            # For customers, set company_id to NULL
            account_data = [(details_ids[i], None, 1) for i in range(num_entries)]

        # Insert data into the 'account' table
        account_query = """
        INSERT INTO account (details_id, company_id, type_id)
        VALUES (%s, %s, %s)
        """
        insert_data(connection, account_query, account_data)

        connection.close()


if __name__ == "__main__":
    num_entries = int(input("Enter the number of records to generate: "))
    entity_type = input(
        "Enter 'company' to generate companies or 'customer' to generate customers: "
    ).lower()
    if entity_type not in ["company", "customer"]:
        print("Invalid input! Please enter 'company' or 'customer'.")
    else:
        populate_database(num_entries, entity_type)
