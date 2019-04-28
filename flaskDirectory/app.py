from flask import Flask,request,jsonify
from flask import render_template
import pandas as pd

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/display_plots")
def display_plots():
    attr = request.args.get('attr', 'sex', type=str)
    data = pd.DataFrame()
    return pd.io.json.dumps(data)


if __name__ == "__main__":
    app.run(host='127.0.0.1',port=5000,debug=True)
