import os
import logging
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/auth/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

logging.basicConfig()

load_dotenv()
import database
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)

from routes.auth import auth
from routes.movies import movie

app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(movie, url_prefix="/movies")

if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), port=int(os.getenv("PORT")))