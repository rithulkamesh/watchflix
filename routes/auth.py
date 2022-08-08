import re
import mail
import bcrypt
from uuid import uuid4
from datetime import datetime
from database import db, User, Reset, Verify
from jwt import JWT, jwk_from_pem
from flask import request, jsonify, Blueprint, Response

jwt = JWT()

auth = Blueprint("auth", __name__)

# Region Utilities
def send(text, status):
    return jsonify({
        "result": text,
        "status": status
    })

def check_email(email):
    regex = "([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+"
    if(re.search(regex, email.lower())):
        return True
    else:
        return False
#endregion

# Region signup
@auth.route("/signup", methods=["POST"])
@auth.route("/register", methods=["POST"])
def signup():
    if 'watchflixlogin' in request.cookies:
        return send("You are already Logged in!", 403)
    body = request.get_json()
    if not {'email', 'password', 'name'}.issubset(body.keys()):
        return send("Insufficient arguments", 400)

    if not check_email(body["email"]):
        return send("Invalid Email", 400)

    user = db.query(User).filter_by(email=body["email"]).first()

    if user != None:
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
            "SELECT * FROM verify_sql WHERE code = '{}'".format(verify_id)
        ).rowcount:
            break
        verify_id = str(uuid4())
    verify = Verify(code=verify_id, email=body["email"])
    db.add(verify)
    db.commit()
    mail.send(body["email"], verify_id)

    # Email Logic
    return send("Successfully Signed Up!", 200)
# endregion

# Region Login
@auth.route("/login", methods=["POST"])
def login():
    if 'watchflixlogin' in request.cookies:
        return send("You are already Logged in!", 403)
    body = request.get_json()
    if not {'email', 'password'}.issubset(body.keys()):
        return send("Insufficient arguments", 400)

    if not check_email(body["email"]):
        return send("Invalid Email", 400)

    user = db.query(User).filter_by(email=body["email"]).first()

    if not user:
        return send("Email does not exist", 400)

    if not bcrypt.checkpw(body["password"].encode("utf-8"), user.password.encode("utf-8")):
        return send("Invalid Password", 400)

    if not user.verified:
        return send("Email is not verified", 403)
    else:
        response = send("Successfully Logged In!", 200)
        # JWT signing
        payload = {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
        key = None
        with open("./keys/private.key", "rb") as f:
            key = f.read()
        token = jwt.encode(payload, jwk_from_pem(pem_content=key), alg="RS256")
        response.set_cookie('watchflixlogin', token)

        return response

#endregion

# Region Logout
@auth.route("/logout", methods=["POST"])
def logout():
    if 'watchflixlogin' in request.cookies:
        response = send("Successfully Logged Out!", 200)
        response.set_cookie('watchflixlogin', '', expires=0)
        return response
    else:
        return send("You are not logged in!", 403)
# endregion

# Region Verify
@auth.route("/verify/<code>", methods=["POST"])
def verify_email(code):
    if 'watchflixlogin' in request.cookies:
        return send("You are already Logged in!", 403)
    verify = db.query(Verify).filter_by(code=str(code)).first()
    if verify is None:
        return send("Invalid Code", 400)
    else:
        user = db.query(User).filter_by(email=verify.email).first()
        user.verified = True
        db.delete(verify)
        db.commit()

        response = send("Successfully Verified!", 200)
        # JWT signing
        payload = {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
        key = None
        with open("./keys/private.key", "rb") as f:
            key = f.read()
        token = jwt.encode(payload, jwk_from_pem(pem_content=key), alg="RS256")
        response.set_cookie('watchflixlogin', token)
        return response
# endregion verify

# Region Forgot Password - Send
@auth.route("/forgot", methods=["POST"])
def forgot():
    body = request.get_json()
    if not {'email'}.issubset(body.keys()):
        return send("Insufficient arguments", 400)
    
    if not check_email(body["email"]):
        return send("Invalid Email", 400)

    user = db.query(User).filter_by(email=body["email"]).first()
    if not user:
        return send("Email does not exist", 400)
    else:
        forgot_id = str(uuid4())
        while True:
            if not db.query(Reset).filter_by(code=forgot_id).first():
                break
            forgot_id = str(uuid4())
        forgot = Reset(code=forgot_id, email=body["email"])
        db.add(forgot)
        db.commit()

        # Email Logic

        return send("Successfully Sent!", 200)
# endregion

# Region Forgot Password - Reset
@auth.route("/forgot/<token>", methods=["POST"])
def reset(token):
    body = request.get_json()
    if not {'newpassword'}.issubset(body.keys()):
        return send("Insufficient arguments", 400)
    forgot = db.query(Reset).filter_by(code=token).first()
    if not forgot:
        return send("Invalid Code", 400)
    user = db.query(User).filter_by(email=forgot.email).first()
    if not user:
        return send("Email does not exist", 400)
    else:
        user.password = bcrypt.hashpw(body["newpassword"].encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("utf-8")
        db.commit()
        return send("Successfully Reset!", 200)
# endregion

# Region Validate Login
@auth.route("/validate", methods=["POST"])
def validate():
    if 'watchflixlogin' not in request.cookies:
        return send("You are not Logged in!", 403)
    
    token = request.cookies['watchflixlogin']
    # if token does not match user details, destroy and return 403
    try:
        payload = jwt.decode(token, do_verify=False)
    except:
        response = send("Invalid Token", 403)

        response.set_cookie('watchflixlogin', '', expires=0)
        return response
    try:
        user = db.query(User).filter_by(email = payload["email"]).first()
    except:
        db.rollback()
        response = send("Something went wrong", 500)

    if not user:
        return send("Invalid Token", 403)
    return send("Valid", 200)
# endregion