import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
import numpy  as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
import warnings
warnings.filterwarnings('ignore')

# Read the CSV file into a pandas DataFrame
data = pd.read_csv("./server/retail_sales_dataset.csv")

data['Date'] = pd.to_datetime(data['Date'])

data = data.groupby('Date').agg({'Quantity': 'sum', 'Price per Unit': 'sum'}).reset_index()
data = data.sort_values(by='Date')
data = data.set_index('Date')
# data = data.resample('D').ffill()
data['Sales'] = data['Quantity'] * data['Price per Unit']

print(data)








# # Plot the 'Sales' time series
# plt.figure(figsize=(12, 6))
# plt.plot(data['Sales'])
# plt.title('Sales Time Series')
# plt.xlabel('Date')
# plt.ylabel('Sales')
# plt.show()

# # Take the first difference to make the time series stationary
# data['Sales_diff'] = data['Sales'].diff().dropna()

# # Plot ACF and PACF
# plot_acf(data['Sales_diff'], lags=20)
# plot_pacf(data['Sales_diff'], lags=20)
# plt.show()

# # Define the order and seasonal_order parameters
# order = (p, d, q)
# seasonal_order = (P, D, Q, m)

# # Fit SARIMAX model
# model = SARIMAX(data['Sales'], order=order, seasonal_order=seasonal_order)
# results = model.fit()

# # Display model summary
# print(results.summary())


# # Forecast sales for the next 'n' periods
# n = 10  # You can change this value
# forecast = results.get_forecast(steps=n)
# forecast_index = pd.date_range(start=data.index[-1], periods=n + 1, freq='M')[1:]

# # Plot the results
# plt.figure(figsize=(12, 6))
# plt.plot(data['Sales'], label='Observed')
# plt.plot(forecast_index, forecast.predicted_mean, color='red', label='Forecast')
# plt.title('Sales Forecast with SARIMAX')
# plt.xlabel('Date')
# plt.ylabel('Sales')
# plt.legend()
# plt.show()
