from flask import Blueprint, request
from routes.auth import send, jwt
from database import db, User, Movie
from uuid import uuid4

movie = Blueprint("movies", __name__)

@movie.route("/create", methods=["POST"])
def create_movie():
    if 'watchflixlogin' not in request.cookies:
        return send("You are not Logged in!", 403)

    token = request.cookies['watchflixlogin']
    try:
        payload = jwt.decode(token, do_verify=False)
    except Exception as e:
        print(e)
        response = send("Invalid Token", 403)

        response.set_cookie('watchflixlogin', '', expires=0)
        return response
    
    user =  User.query.filter_by(id=payload["id"]).first()

    if not user.isAdmin:
        return send("You are not an admin.", 401)
    body = request.get_json()

    if not {"name", "desc", "trailer"}.issubset(body.keys()):
        return send("Insufficient Arguments", 400)
    
    uuid = str(uuid4())

    while True:
        if Movie.query.get(uuid) == None:
            break
        uuid = str(uuid4())
    
    movie = Movie(id=uuid, name=body["name"], description=body["desc"], trailer=body["trailer"])
    db.session.add(movie)
    db.session.commit()
    return "OK"

@movie.route("/<id>")
def get_movie(id):
    movie = Movie.query.get(id)
    if movie == None:
        return send("Not Found", 404)
    return {
            "name" : movie.name,
            "desc" : movie.description,
            "trailer" : movie.trailer
        } 

@movie.route("/delete/<id>", methods=["DELETE"])
def delete_movie(id):
    if 'watchflixlogin' not in request.cookies:
        return send("You are not Logged in!", 403)

    token = request.cookies['watchflixlogin']
    try:
        payload = jwt.decode(token, do_verify=False)
    except Exception as e:
        print(e)
        response = send("Invalid Token", 403)

        response.set_cookie('watchflixlogin', '', expires=0)
        return response
    
    user =  User.query.filter_by(id=payload["id"]).first()

    if not user.isAdmin:
        return send("You are not an admin.", 401)
    
    movie = Movie.query.get(id)
    if movie == None:
        return send("Not Found", 404)
    db.session.delete(movie)
    db.session.commit()
    return "OK"

# Get random movies
@movie.route("/random/<count>")
def get_random_movies(count=1):
    movies = Movie.query.all()
    if len(movies) == 0:
        return send("No movies found", 404)
    import random
    random.shuffle(movies)
    return {
        "movies" : [
            {
                "name" : movie.name,
                "desc" : movie.description,
                "trailer" : movie.trailer,
                "poster" : movie.poster
            } for movie in movies[:int(count) if int(count) <= len(movies) else len(movies)]
        ]
    }