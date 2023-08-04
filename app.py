from flask import Flask, request, render_template, redirect, flash, session, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "fdfgkjtjkkg45yfdb"

boggle_game = Boggle()



@app.route('/')
def home_page():
    board = boggle_game.make_board()
    session['board'] = board
    
    playedtimes = session.get('playedtimes', 0)
    highscore = session.get("highscore", 0) 
    return render_template('home.html', board = board, highscore = highscore, playedtimes = playedtimes)

@app.route("/answer")
def check_word():
    """Check if word is in dictionary."""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

@app.route("/endgame", methods = ["POST"])
def end_game():
    score = request.json["score"]
    playedtimes = session.get("playedtimes", 0)
    playedtimes += 1
    session["playedtimes"] = playedtimes
    highscore = session.get("highscore", 0)
    if score > highscore:
        session["highscore"] = score

    return jsonify({'result': "saved"})
