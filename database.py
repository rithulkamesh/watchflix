import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, DateTime

engine = create_engine(os.getenv('DATABASE_URI'))
Base = declarative_base()
meta = MetaData()

class User(Base):
    __tablename__ = 'user_sql'
    id = Column(String(200), primary_key=True)
    email = Column(String(200), nullable=False, unique=True)
    name = Column(String(200), nullable=False)
    password = Column(String(200), nullable=False)
    created_at = Column(DateTime, nullable=False)

class Verify(Base):
    __tablename__ = 'verify_sql'
    code = Column(String(200), primary_key=True)
    email = Column(String(200), nullable=False)

class Reset(Base):
    __tablename__ = 'reset_sql'
    code = Column(String(200), primary_key=True)
    email = Column(String(200), nullable=False)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
db = Session()
