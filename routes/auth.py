import re,csv
import mail
import bcrypt
import os
from uuid import uuid4
from datetime import datetime
from database import db, User, Verify
from jwt import JWT, jwk_from_pem
from flask import request, jsonify, Blueprint, Response,json

jwt = JWT()

auth = Blueprint("auth", __name__)

def insert_reset(email):
    l=[]
    with open('reset.csv','a+',newline='') as f:
        l.append(email)
        s=uuid4()
        l.append(s)
        w=csv.writer(f)
        w.writerow(l)
    return s

def exists_in_reset(token):
    with open('reset.csv','r',newline='') as f:
        r=csv.reader(f)
        for i in r:
            if i[1]==token:
                return i
        return None

def delete_reset(email):
    with open('reset.csv','a+',newline='') as f:
        with open('temporary.csv','r+',newline='') as t:
            w=csv.writer(f)
            r=csv.reader(f)
            found=0
            for i in r:
                if i[0]==email:
                    found=1
                else:
                    w.writerow(i)
    if found==1:
        os.remove('reset.csv')
        os.rename('temporary.csv','reset.csv')
    else:
        print('record not found')



# Region Utilities
def send(text, status):
    """
    Returns a JSONified version of the text and status to send back to the user
    """

    return jsonify({
        "result": text,
        "status": status
    })

def check_email(email):
    """checks if email entered is valid"""
    regex = "([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+"
    if(re.search(regex, email.lower())):
        return True
    else:
        return False

def hashpw(pw):
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("utf-8")
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

    user = User.query.filter_by(email=body["email"]).first()

    if user != None:
        return send("Email already exists", 400)
    
    uuid = str(uuid4())

    while True:
        if User.query.get(uuid) == None:
            break
        uuid = str(uuid4())

    # Hash the password with bcrypt
    hashed_password = hashpw(body["password"])
    user = User(id=uuid, email=body["email"],
                name=body["name"], password=hashed_password, created_at=datetime.now())
    db.session.add(user)
    db.session.commit()
    

    verify_id = str(uuid4())
    while True:
        if Verify.query.get(verify_id) == None:
            break
        verify_id = str(uuid4())
    
    verify = Verify(code=verify_id, email=body["email"])
    db.session.add(verify)
    db.session.commit()

    mail.send_verify(body["email"], body["name"].split()[0],verify_id)

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

    user = User.query.filter(User.email == body["email"]).first()
    if not user:
        return send("Email does not exist", 400)

    if not bcrypt.checkpw(body["password"].encode("utf-8"), user.password.encode("utf-8")):
        return send("Invalid Password", 400)

    if not user.verified:
        return send("Email is not verified", 403)
    
    response = send("Successfully Logged In!", 200)
    # JWT signing
    payload = {
        "id": user.id,
        "email": user.email,
        "name": user.name
    }
    key = None
    with open(os.path.join(os.getcwd(), "keys", "private.key"), "rb") as f:
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
    verify = Verify.query.get(code)
    if verify is None:
        return send("Invalid Code", 400)
    else:
        user = User.query.filter(User.email==verify.email).first()
        user.verified = True
        db.session.delete(verify)
        db.session.commit()

        response = send("Successfully Verified!", 200)
        # JWT signing
        payload = {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
        key = None
        with open(os.path.join(os.getcwd(), "keys", "private.key"), "rb") as f:
            key = f.read()
        token = jwt.encode(payload, jwk_from_pem(pem_content=key), alg="RS256")
        response.set_cookie('watchflixlogin', token)
        return response
# endregion verify

# Region Forgot Password - Send
@auth.route("/forgot", methods=["POST"])
def forgot():
    body = request.get_json()
    """ if email is not entered """
    if not {'email'}.issubset(body.keys()):
        return send("Insufficient arguments", 400)
    """in case email is not valid"""
    if not check_email(body["email"]):
        return send("Invalid Email", 400)

    user = User.query.filter(User.email == body["email"]).first()
    """if email doesnt exist in the user table"""
    if not user:
        return send("Email does not exist", 400)
    else:
        forgot_id = insert_reset(body["email"])
        # mail.send_reset(body["email"], user.name.split()[0], forgot_id)

        return send("Successfully Sent!", 200)
# endregion

# Region Forgot Password - Reset
@auth.route("/forgot/<token>", methods=["POST"])
def reset(token):
    body = request.get_json()
    if not {'newpassword'}.issubset(body.keys()):
        return send("Insufficient arguments", 400)
    forgot = exists_in_reset(token)
    if not forgot:
        return send("Invalid Code", 400)
    user = User.query.filter(User.email == forgot[0]).first()
    if not user:
        return send("Email does not exist", 400)
    else:
        user.password = hashpw(body["newpassword"])
        db.session.commit()
        return send("Successfully Reset!", 200)
# endregion

# Region Validate Login
@auth.route("/validate", methods=["POST"])
def validate():
    """if user is not logged in """
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
    
    user =  User.query.filter_by(id=payload["id"]).first()

    if not user:
        respnse = send("Invalid Token", 403)
        respnse.set_cookie('watchflixlogin', '', expires=0)
        return respnse
    return send("Valid", 200)
# endregion

# Region getUser
@auth.route('/user', methods=['GET'])
def get_user():
    if 'watchflixlogin' not in request.cookies:
        return send("You are not Logged in!", 403)

    token = request.cookies['watchflixlogin']
    try:
        payload = jwt.decode(token, do_verify=False)
        
    except:
        response = send("Invalid Token", 403)
        response.set_cookie('watchflixlogin', '', expires=0)
        return response
    

    user =  User.query.with_entities(User.name, User.email, User.id, User.isAdmin).filter_by(id=payload["id"]).first()

    response = jsonify({
        "user" : json.dumps(dict(user)),
        "isAdmin": user.isAdmin,
        "status" : 200,
        "message" : "Success"
    })

    return response

# endregion