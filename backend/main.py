import os, csv
import logging
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

app = Flask(__name__)
app.app_context().push()
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
}, supports_credentials=True)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_HEADERS'] = 'ACcess-Control-Allow-Origin'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

logging.basicConfig()

load_dotenv()
app.config ['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI")

import mail
from database import *


logging.getLogger('sqlalchemy').setLevel(logging.ERROR)

if not os.path.exists("reset.csv"):
    with open("reset.csv", "w") as f:
        pass


from routes.auth import auth
from routes.movies import movie

app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(movie, url_prefix="/movies")

movies_added = Metadata.query.filter_by(key="movies_added").first()
if (not movies_added) or (movies_added == "false"):
    __import__("setup").get_movies()
    movies_added = Metadata(key="movies_added", value="true")
    db.session.add(movies_added)
    db.session.commit()


if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), port=int(os.getenv("PORT")))
