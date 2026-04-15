import sqlite3
from flask import jsonify, request

DB_File = "/Users/manie/Documents/VSCode/Small_Projects/Database/flask_db_viewer/databases/bank_large.db"


def get_connection():
    return sqlite3.connect(DB_File)


def get_data(table_name):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(f"SELECT first_name, last_name, account, balance FROM {table_name}")
    rows = cursor.fetchall()
      
    col_names = [description[0] for description in cursor.description]
    
    conn.close()

    data = [dict(zip(col_names, row)) for row in rows]

    for row in rows:
         for cells in row:
            # print(cells)
            pass
      
    print(data)

if __name__ == "__main__":
    db = "accounts" 
    get_data(db)
