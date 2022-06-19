from flask import Blueprint

movie = Blueprint("movies", __name__)

@movie.route("/<moviename>")
def movies(moviename):
    return moviename
