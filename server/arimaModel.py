import pandas as pd
from pandas.tseries.offsets import DateOffset
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error
from math import sqrt
import os

print(os.getcwd())

# Read file
path = "D:/CapstoneProject/server/assets/Warehouse_and_Retail_Sales.csv" #get path from firebase
name, extension = os.path.splitext(path)
print(name + "=> Type :" +extension)

def parser(x):
 return pd.datetime.strptime('190'+x, '%Y-%m')

if extension == ".csv":
    df = pd.read_csv( path, delimiter=",", date_parser=parser)
                    #  , header=0, parse_dates=[0], index_col=0, squeeze=True)
elif extension == ".xlsx":
    df = pd.read_excel(path)
else:
    df = pd.read_table(path)

# Need to check column wich one is "Sales", "Date" !!!!!!!!!!!!!

# Check the data types of all columns in the DataFrame
column_data_types = df.dtypes
print(column_data_types)

# Clean data Part
    # Check which columns have missing values
columns_with_missing_values = df.columns[df.isnull().any()].tolist()
for x in columns_with_missing_values:
   if type(x) == int | type(x) == float:
        df[x].fillna(df[x].mean(), inplace=True)
        print(f"{x} is an {type(x)}")
   elif type(x) == str:
        df[x].fillna("No Data", inplace=True)
        print(f"{x} is a string")
   elif type(x) == list:
        df[x].fillna(0)
        print(f"{x} is a list")
   elif type(x) == dict:
        df[x].fillna(0)
        print(f"{x} is a dictionary")
   elif type(x) == bool:
        df[x].fillna(False)
        print(f"{x} is a boolean")
   else:
        print(f"{x} has an unknown data type")
df = df.dropna()
df = df.drop_duplicates()

# For non-seasonal data
# Config model ARIMA
p = 1  # Autoregressive order
d = 1  # Differencing order
q = 1  # Moving average order

model = ARIMA(df["RETAIL SALES"], order=(p, d, q)) # Need to specify column "Sales" ?
model_fit = model.fit()
print(model_fit.summary())

# Method 01
    # Replace 'steps' with the number of steps ahead you want to forecast
forecast_steps = 10
forecast, stderr, conf_int = model_fit.forecast(steps=forecast_steps)

# Method 02
df['forecast']=model_fit.predict(start=90,end=103,dynamic=True)
df[['Sales','forecast']].plot(figsize=(12,8)) 

# Method 03
model=sm.tsa.statespace.SARIMAX(df['Sales'],order=(1, 1, 1),seasonal_order=(1,1,1,12))
results=model.fit()
df['forecast']=results.predict(start=90,end=103,dynamic=True)
df[['Sales','forecast']].plot(figsize=(12,8))

# Method 04
future_dates=[df.index[-1]+ DateOffset(months=x)for x in range(0,24)]
future_datest_df=pd.DataFrame(index=future_dates[1:],columns=df.columns)
future_datest_df.tail()
future_df=pd.concat([df,future_datest_df])
future_df['forecast'] = results.predict(start = 104, end = 120, dynamic= True)
future_df[['Sales', 'forecast']].plot(figsize=(12, 8))

# Evaluate ARIMA model
    # Calculate MAPE
# actual = ...  # Actual values
# predicted = ...  # Predicted values
# mape = np.mean(np.abs((actual - predicted) / actual)) * 100

# Show data
plt.plot(df)
print(df.head())
df.plot()
plt.show() 