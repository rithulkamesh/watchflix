from __main__ import app


@app.route("/hello")
def hello():
    return "Hello"