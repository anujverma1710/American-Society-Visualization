INTRODUCTION


In this project, we aim to build a dashboard to visualize the change in American society and demographics over time and also, with the help of the visualization, analyse the effects of these changes on various other factors of the society to produce interesting, statistically significant results that can be used for better governance by giving a basic, high level view into the American society.

DATASET


For our data, we are mostly looking at the United States Census data. We have used the wonderful tool “The National Historical Geographic Information System (NHGIS)” which provides easy access to summary tables and time series of population, housing, agriculture, and economic data for years from 1790 through the present. Currently, our high level goal is to observe the effects of demographic changes on the society. NHGIS provides us with mostly economic data. We are also currently looking for other aspects, mainly health and education and plan to include them as well to study the effect of population on these variables. Our dataset is at a granularity level of state and county so we’ll not be able to analyze census tracts.

STATEMENT OF NEED

In our opinion, government policies should keep up with the times and always be open to change in keeping with the changing human societies and their needs and concerns. Society is constantly evolving and we want to develop a way to visualize this evolution through time so as to make it easier for policy makers to heed to the changing needs of their county, state and county.
Our mission is to visualize the data in a way that pinpoints and brings forth the ways the demographic change affects the economics and other areas of the society and to show that these are important factors that need to be considered when designing policies and governance. But also, secondarily, we want to bring forth the idea that using regression and other statistical methods, future demographic data can be inferred and this data can use the same visualizations that we create to help those holding public offices to visualize in an intuitive way the needs of their community.

ANALYSIS

We analyzed the data by performing linear regression to find correlation between independent variables like sex, race, native/foreign, rural/urban, and immigrant origin and the dependent variables like per capita income, median income, poverty, housing ratio, and college educated ratio. We also performed 2-tailed p value test on the various dependent and independent variables to find the significance of the results. For each of the demographic attributes (Gender, Race, Urban/Rural, Native/Foreign Born), the ratios were analysed as we know that population over time will increase, it is the ratio that is more interesting and representative of the change. Moreover, we also found some key observations which could help different states which lag behind in a particular area  to come at par with the rest of the USA. These observations could help them to reform their administrative facilities and policies.

Note: From our analysis, we have excluded District of Columbia (DC), Hawaii and Alaska, as for many attributes, their values were acting like outliers and were skewing the various graphs. (For example, the DC is entirely made of Urban Population)\


REFERENCES


 - Steven Manson, Jonathan Schroeder, David Van Riper, and Steven Ruggles. IPUMS National Historical Geographic Information System: Version 13.0 [Database]. Minneapolis: University of Minnesota. 2018. http://doi.org/10.18128/D050.V13.0
 - Scatter Plot with Regression Line: https://bl.ocks.org/ctufts/298bfe4b11989960eeeecc9394e9f118
 - Connected ScatterPlot : http://bl.ocks.org/d3noob/38744a17f9c0141bcd04
 - Parallel Coordinates: https://bl.ocks.org/jasondavies/1341281
 - US GeoJson Map : https://bl.ocks.org/jadiehm/8f5adc05465a94e77e30
 - Stacked bar chart : http://bl.ocks.org/mstanaland/6100713

