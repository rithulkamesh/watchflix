from flask import Blueprint

movie = Blueprint("movies", __name__)

@movie.route("/getmovies", methods=["POST"])
def getMovies():
    return "Here are the movies"

@movie.route("/random")
def random_movies():
    return "Here are the random movies"