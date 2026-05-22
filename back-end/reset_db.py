import psycopg2
from psycopg2 import sql
from decouple import config

DB_NAME = config('DB_NAME')
DB_USER = config('DB_USER')
DB_PASSWORD = config('DB_PASSWORD')
DB_HOST = config('DB_HOST')
DB_PORT = config('DB_PORT')

try:
    # Connect to PostgreSQL default database
    conn = psycopg2.connect(
        database='postgres',
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    # Terminate all connections to the database
    cursor.execute(f"""
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '{DB_NAME}'
        AND pid <> pg_backend_pid();
    """)
    
    # Drop the database if it exists
    cursor.execute(sql.SQL("DROP DATABASE IF EXISTS {}").format(sql.Identifier(DB_NAME)))
    print(f"Dropped database: {DB_NAME}")
    
    # Create new database
    cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(DB_NAME)))
    print(f"Created database: {DB_NAME}")
    
    cursor.close()
    conn.close()
    print("Database reset successful!")
    
except Exception as e:
    print(f"Error: {e}")
