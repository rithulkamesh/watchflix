import mysql.connector as mysql

def init(uri: str):
    config = {
        "user": uri.split("//")[1].split(":")[0],
        'password': uri.split("//")[1].split(":")[1].split("@")[0],
        'host': uri.split("@")[1].split(":")[0],
        'port': uri.split("@")[1].split(":")[1].split("/")[0],
        'database': uri.split("@")[1].split("/")[1]
    }
    conn = mysql.connect(**config)
    return conn, conn.cursor()

def close(conn, cur):
    cur.close()
    conn.close()