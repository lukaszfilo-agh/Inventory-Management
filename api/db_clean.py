import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Parse the database URL
parsed_url = urlparse(DATABASE_URL)
db_name = parsed_url.path[1:]  # Remove the leading "/"

# Connect to the PostgreSQL database
conn = psycopg2.connect(
    dbname=db_name,
    user=parsed_url.username,
    password=parsed_url.password,
    host=parsed_url.hostname,
    port=parsed_url.port
)
cur = conn.cursor()

# Step 1: Drop foreign key constraints first
cur.execute("""
    SELECT conname, conrelid::regclass 
    FROM pg_constraint 
    WHERE contype = 'f';
""")
fks = cur.fetchall()

for fk in fks:
    cur.execute(f"ALTER TABLE {fk[1]} DROP CONSTRAINT {fk[0]};")

# Step 2: Get and drop all tables
cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
tables = cur.fetchall()

for table in tables:
    cur.execute(f"DROP TABLE IF EXISTS {table[0]} CASCADE;")

# Step 3: Reset auto-increment sequences
cur.execute(
    "SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public';")
sequences = cur.fetchall()

for seq in sequences:
    cur.execute(f"ALTER SEQUENCE {seq[0]} RESTART WITH 1;")

# Commit changes and close connection
conn.commit()
cur.close()
conn.close()

print("Database wiped successfully.")
