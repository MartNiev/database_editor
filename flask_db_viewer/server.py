from flask import Flask, jsonify, request, render_template, make_response
import sqlite3
import random

app = Flask(__name__)

DB_File = "/Users/manie/Documents/VSCode/Small_Projects/Database/flask_db_viewer/databases/bank.db"

def get_connection():
    return sqlite3.connect(DB_File)


@app.route("/")
def home():
   return render_template("index.html")

@app.route("/delete_data")
def deleteData():
    return render_template("deletionConfirmation.html")


@app.route("/table/<table_name>")
def list_table(table_name):
    conn = get_connection()
    cursor = conn.cursor()

    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    offset = (page - 1) * limit

    try:
        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            (table_name,)
        )

        result = cursor.fetchone()

        if not result:
            return jsonify({"error": f"Table '{table_name}' does not exist"}), 404

        cursor.execute(f"SELECT id, first_name, last_name, account, balance FROM {table_name} LIMIT ? OFFSET ?;", (limit, offset))
  
        rows = cursor.fetchall()

        col_names = [description[0] for description in cursor.description]
    
        conn.close()

        data = [dict(zip(col_names, row)) for row in rows]

        return jsonify({
            "page": page,
            "limit" : limit,
            "rows" : data
        })
    
    except Exception as e:
        conn.close()
        return ({"Error": (e)}), 500

@app.route("/table/<table_name>/delete")
def delete(table_name):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        id = request.args.get("id", default=1, type=int)

        cursor.execute(f"DELETE FROM '{table_name}' WHERE id = ?",(id,))
        
        conn.commit()
        cursor.close()

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"Error": str(e)}), 500

@app.route("/data/addClient")
def addClient():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        firstName = request.args.get("firstName", default="", type=str)
        lastName = request.args.get("lastName", default="", type=str)
        account = random.randint(10000, 99999)
        balance = 0.0

        cursor.execute(f"INSERT INTO accounts ('first_name', 'last_name', 'account', 'balance') VALUES ('{firstName}', '{lastName}', '{account}', '{balance}');")
        
        conn.commit()
        cursor.close()

        print(firstName, lastName, account, balance)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"Error": e})
    

    
if __name__ == "__main__":
    app.run(debug=True)