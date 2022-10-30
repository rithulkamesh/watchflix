import os, csv, requests, json
from database import db, Movie
from uuid import uuid4

# Get movies from movies.csv and store in database if not already present
def get_movies():
    with open("movies.csv", "r", newline='') as f:
        reader = csv.reader(f, delimiter='|')
        for row in reader:
            if row[0] == "Title":
                continue
            if Movie.query.get(row[1]) == None:
                uuid = str(uuid4())
                movie = Movie(id = uuid,name=row[0], description=row[1], trailer=row[3], poster=row[2])
                db.session.add(movie)
                db.session.commit()