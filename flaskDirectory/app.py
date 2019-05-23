from flask import Flask,request,jsonify
from flask import render_template
import pandas as pd
import helper
import json

app = Flask(__name__)

###Default route template
@app.route("/")
def index():
    return render_template('index.html')


#Common method For Fetching data based on attribute
@app.route("/display_plots")
def display_plots():
    attr = request.args.get('attr', default='Sex', type=str)
    # Temporary hack. Remove later
    if attr == 'Immigrant':
        attr = "Native"

    if attr != 'Immigrant':
        attr += "_Ratio_Data.csv"

    df = helper.getDataFrame(attr)
    data = helper.getDataToSend(df)
    return data


##Method for getting data for entire 1 decade
@app.route("/getDataPerYear")
def getDataPerYear():
    year = request.args.get('year', default='1970', type=str)
    filename = "Data" + year +".csv"

    df=helper.getDataFrameBasedOnYear(filename)

    attr1 = request.args.get('attr', default='Sex', type=str)
    if attr1 == 'Immigrant':
        attr1 = "Native"
    attr1 += "_Ratio"

    attr2 = request.args.get('profiler', default='PerCapitaIncome', type=str)
    corr, pval = helper.getStats(df, attr1, attr2)

    if (pval < 0.05):
        print("P - value : " + str(pval) + ". STATISTICALLY SIGNIFICANT.")
    else:
        print("P - value : " + str(pval) + ". STATISTICALLY INSIGNIFICANT.")
    helper.writeToFile("stats.txt", corr, pval)
    getStats()
    return df.to_csv()


#For Getting aggregate data for all 5 decades
@app.route("/getAggregateData")
def getAggregateData():
    return helper.getAggregateData().to_csv()


#For getting data on selection of state
@app.route("/getDataPerState")
def getDataPerState():

	state = request.args.get('state', default='Alabama', type=str)
	row = helper.getStateRow(state)
	df = pd.DataFrame()
	for year in range(1970, 2020, 10):
		filename = "Data" + str(year) + ".csv"
		tempdf = helper.getDataFrameBasedOnYear(filename)
		tempdf["YEAR"] = str(year)
		tempdf = pd.DataFrame(tempdf.iloc[row,:]).T
		df = pd.concat([tempdf,df], axis=0)
	df = df.reset_index(drop=True)
	return df.to_csv()


#for calculation of p-value
@app.route("/getStats")
def getStats():
    stat = helper.readFromFile('stats.txt')
    return json.dumps(stat)


if __name__ == "__main__":

    app.run(host='127.0.0.1',port=5000,debug=True)
