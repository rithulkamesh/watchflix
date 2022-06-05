import re
import bcrypt
from uuid import uuid4
from __main__ import app
from datetime import datetime
from database import db, User
from flask import request, jsonify
# region Utilities
def send(text, status):
    return jsonify({
        "result": text,
        "status_code": status
    })


def check_email(email):
    regex = "([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+"
    if(re.search(regex, email.lower())):
        return True
    else:
        return False
#endregion

# Region signup
@app.route("/signup", methods=["POST"])
@app.route("/register", methods=["POST"])
def signup():
    if 'lirtoolslogin' in request.cookies:
        return send("You are already Logged in!", 403)
    body = request.get_json()
    if not {'email', 'password', 'name'}.issubset(body.keys()):
        return send("Insufficient arguments", 400)

    if not check_email(body["email"]):
        return send("Invalid Email", 400)

    if db.query(User).filter_by(email=body["email"]).first():
        return send("Email already exists", 400)
    uuid = str(uuid4())
    while True:
        if not db.execute(
            "SELECT * FROM user_sql WHERE id = '{}'".format(uuid)
        ).rowcount:
            break
        uuid = str(uuid4())

    # Hash the password with bcrypt
    hashed_password = bcrypt.hashpw(body["password"].encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("utf-8")
    password = body["password"]
    user = User(id=uuid, email=body["email"],
                name=body["name"], password=hashed_password, created_at=datetime.now())
    db.add(user)
    db.commit()

    verify_id = str(uuid4())
    while True:
        if not db.execute(
            "SELECT * FROM verify_sql WHERE id = '{}'".format(verify_id)
        ).rowcount:
            break
        verify_id = str(uuid4())
    verify = Verify(code=verify_id, email=body["email"])
    db.add(verify)
    db.commit()    

    # Email Logic

    return send("Successfully Signed Up!", 200)

# endregion

@app.route("/movies/<movieName>")
def movies(movieName):
    return movieName