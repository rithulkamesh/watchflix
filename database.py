from flask_sqlalchemy import SQLAlchemy
from __main__ import app

db = SQLAlchemy(app)
db.init_app(app)

class User(db.Model):
    id = db.Column(db.String(200), primary_key=True)
    email = db.Column(db.String(200), nullable=False, unique=True)
    name = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    verified = db.Column(db.Boolean, default=False)
    isAdmin = db.Column(db.Boolean, default=False)

#verification table
class Verify(db.Model):
    code = db.Column(db.String(200), primary_key=True)
    email = db.Column(db.String(200), nullable=False)

class Movie(db.Model):
    id = db.Column(db.String(200), primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text(), nullable=False)
    trailer = db.Column(db.String(200), nullable=False)

db.create_all()
