from flask import Flask, jsonify, request, render_template, url_for, redirect, send_from_directory
import sqlite3
import random
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)


DB_File = ""
userFolder = ""
currentDb = ""

def get_connection():
    return sqlite3.connect(DB_File)


@app.route("/")
def home():
   return render_template("index.html")

@app.route("/yourdatabase")
def dbPage():
    global DB_File

    print(DB_File)
    if DB_File == "":
        return redirect(url_for('home'))
    else:
        return render_template("database.html")

@app.route("/delete_data")
def deleteData():
    return render_template("deletionConfirmation.html")

@app.route("/uploadDB", methods=['POST'])
def uploadDB():
    try:
        file = request.files['file']
        dbFolder = "userDB/"
        filename = secure_filename(file.filename)
        destinationPath = os.path.join(dbFolder, filename)
        file.save(destinationPath)
    
        global DB_File, userFolder, currentDb
        
        DB_File = destinationPath 
        userFolder = dbFolder
        currentDb = filename
        print("DEBUG: " + userFolder + currentDb)
        
        return jsonify({"success": True})
    except Exception as e:
        return ({"Error": str(e)})


    
@app.route("/loadTable/<table_name>")
def loadTable(table_name):
    conn = get_connection()
    cursor = conn.cursor()

    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    offset = (page - 1) * limit

    try:
        cursor.execute(f"SELECT * FROM {table_name} LIMIT ? OFFSET ?;", (limit, offset))
  
        rows = cursor.fetchall()
        colunmNames = [description[0] for description in cursor.description]
        

        conn.close()
        dataObject = [dict(zip(colunmNames, row)) for row in rows]   

        app.json.sort_keys = False

        return jsonify({
            "page": page,
            "limit" : limit,
            "columnNames": colunmNames,
            "rows" : dataObject
        })
    
    except Exception as e:
        conn.close()
        return ({"Error": str(e)})

@app.route("/table/<table_name>/delete", methods=['DELETE'])
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

@app.route("/data/addData", methods=["POST"])
def addClient():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        data = request.get_json()

        print(data)

        columns = ""
        values = ""

        inc = 0
        for key in data:
            value = data.get(key)
            columns

            if inc == 0:
                columns += f"'{key}'"
                values += f"'{value}'"
                inc += 1
            else:
                columns += ", " + f"'{key}'"
                values += ", " + f"'{value}'"

        columns = f"({columns})"
        values = F"({values})"
        
        cursor.execute(f"INSERT INTO accounts {columns} VALUES {values};")
    
        conn.commit()
        conn.close()

        return jsonify({"success": True})
    except Exception as e:
        conn.close()
        return jsonify({"Error": str(e)})
    

@app.route("/data/edit_data", methods=['PUT'])
def edit():
    print("Running")
    try: 
        conn = get_connection()
        cursor = conn.cursor()

        data = request.get_json()
        id = data.get('id')
        name = data.get('name')

        for key in name:
            value = name.get(key)
            cursor.execute(f"UPDATE accounts SET {key} = ? WHERE id = ?",(value, id))
            conn.commit()
        
        conn.close()

        return jsonify({"success": True})
    except Exception as e:
        conn.close()
        return jsonify({"Error": str(e)})

@app.route("/download")
def download_file():
    try:
        global userFolder, currentDb
        print("DEBUG: " + userFolder)
        print("DEBUG: " + currentDb)

        return send_from_directory(userFolder, currentDb, as_attachment=True)
    except Exception as e:
        return jsonify({"Error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)