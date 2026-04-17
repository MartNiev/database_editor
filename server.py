from flask import Flask, jsonify, request, render_template, make_response
import sqlite3
import random
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

DB_File = ""

def get_connection():
    return sqlite3.connect(DB_File)


@app.route("/")
def home():
   return render_template("index.html")

@app.route("/yourdatabase")
def dbPage():
    return render_template("database.html")

@app.route("/delete_data")
def deleteData():
    return render_template("deletionConfirmation.html")

@app.route("/uploadDB", methods=['POST'])
def uploadDB():
    try:
        file = request.files['file']
        dbFolder = "/Users/manie/Documents/VSCode/Small_Projects/Database/userDB"
        filename = secure_filename(file.filename)
        destinationPath = os.path.join(dbFolder, filename)
        file.save(destinationPath)
        global DB_File
        DB_File = destinationPath
        # getDBPath()

        return jsonify({"success": True})
    except Exception as e:
        return ({"Error": str(e)})


    
@app.route("/table/<table_name>")
def list_table(table_name):
    conn = get_connection()
    cursor = conn.cursor()

    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    offset = (page - 1) * limit

    try:
        cursor.execute(f"SELECT id, first_name, last_name, account, balance FROM {table_name} LIMIT ? OFFSET ?;", (limit, offset))
  
        rows = cursor.fetchall()
        colunmNames = [description[0] for description in cursor.description]
        
        conn.close()
        dataObject = [dict(zip(colunmNames, row)) for row in rows]   

        app.json.sort_keys = False

        return jsonify({
            "page": page,
            "limit" : limit,
            "rows" : dataObject
        })
    
    except Exception as e:
        conn.close()
        return ({"Error": str(e)})

@app.route("/table/<table_name>/delete")
def delete(table_name):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        id = request.args.get("id", default=1, type=int)

        cursor.execute(f"DELETE FROM '{table_name}' WHERE id = ?",(id,))
        
        conn.commit()
        conn.close()

        return jsonify({"success": True})
    except Exception as e:
        conn.close()
        return jsonify({"Error": str(e)})

@app.route("/data/addClient")
def addClient():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        firstName = request.args.get("firstName", default="", type=str)
        lastName = request.args.get("lastName", default="", type=str)
        account = random.randint(10000, 99999)
        balance = 0.0

        cursor.execute(f"INSERT INTO accounts ('first_name', 'last_name', 'account', 'balance') VALUES ('{firstName}', '{lastName}', '{account}', '{balance}');")
        
        conn.commit()
        conn.close()

        # print(firstName, lastName, account, balance)
        return jsonify({"success": True})
    except Exception as e:
        conn.close()
        return jsonify({"Error": str(e)})
    

@app.route("/data/edit_data")
def edit():
    print("Running")
    try: 
        conn = get_connection()
        cursor = conn.cursor()

        rowid = request.args.get("id", default="", type=int)
        firstName = request.args.get("firstName", default="", type=str)
        lastName = request.args.get("lastName", default="", type=str)
        print(f"{rowid} {firstName} {lastName}")
        # Not editing the record

        print(len(firstName))

        if len(firstName) > 0:
            cursor.execute("UPDATE accounts SET first_name = ? WHERE id = ?",(firstName, rowid))
        if len(lastName) > 0:
            cursor.execute("UPDATE accounts SET last_name = ? WHERE id = ?",(lastName, rowid))
        

        conn.commit()
        conn.close()

        return jsonify({"success": True})
    except Exception as e:
        conn.close()
        return jsonify({"Error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)