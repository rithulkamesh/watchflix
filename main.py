import os
import database
from flask import Flask
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
conn, cur = database.init(os.getenv("DATABASE_URI"))

import routes

if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), port=int(os.getenv("PORT")))