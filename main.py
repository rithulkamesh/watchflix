import os
import logging
from flask import Flask
from dotenv import load_dotenv

app = Flask(__name__)

logging.basicConfig()

load_dotenv()
import database
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)


import routes

if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), port=int(os.getenv("PORT")))