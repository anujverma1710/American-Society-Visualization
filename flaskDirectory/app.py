from flask import Flask,request,jsonify
from flask import render_template
import pandas as pd
import helper

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/display_plots")
def display_plots():
    attr = request.args.get('attr', default='Sex', type=str)
    # Temporary hack. Remove later
    if attr != 'Immigrant':
        attr += "_Ratio_Data.csv"

    df = helper.getDataFrame(attr)
    data = helper.getDataToSend(df)
    return data


if __name__ == "__main__":
    app.run(host='127.0.0.1',port=5000,debug=True)
