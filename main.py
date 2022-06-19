import os
import logging
from flask import Flask
from dotenv import load_dotenv

app = Flask(__name__)

logging.basicConfig()

load_dotenv()
import database
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)

from routes.auth import auth
from routes.movies import movie

app.register_blueprint(auth, url_prefix="/")
app.register_blueprint(movie, url_prefix="/movies")

import routes.auth

if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), port=int(os.getenv("PORT")))