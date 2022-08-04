import os
import logging
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
}, supports_credentials=True)

app.config['CORS_HEADERS'] = 'Content-Type'

logging.basicConfig()

load_dotenv()

import mail
import database
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)

from routes.auth import auth
from routes.movies import movie

app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(movie, url_prefix="/movies")

if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), port=int(os.getenv("PORT")))