# #database
# import os
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, DateTime
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

class Reset(db.Model):
    code = db.Column(db.String(200), primary_key=True)
    email = db.Column(db.String(200), nullable=False)

db.create_all()

# Base.metadata.create_all(engine)
# Session = sessionmaker()
# Session.configure(bind=engine)
# db = Session()
