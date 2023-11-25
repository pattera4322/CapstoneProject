import pandas as pd
from pmdarima import auto_arima
import matplotlib.pyplot as plt

# Read the CSV file into a pandas DataFrame
data = pd.read_csv("./server/sales_data_sample.csv")

# Convert the "Date" column to a datetime type
data['Date'] = pd.to_datetime(data['ORDERDATE'])

# Aggregate data for duplicate dates by summing "Quantity" and "Price per Unit"
data = data.groupby('Date').agg({'QUANTITYORDERED': 'sum', 'PRICEEACH': 'sum'}).reset_index()

data = data.sort_values(by='Date')
data = data.set_index('Date')
data = data.resample('D').ffill()

data['Sales'] = data['QUANTITYORDERED'] * data['PRICEEACH']

# # Read the CSV file into a pandas DataFrame
# data = pd.read_csv("./server/retail_sales_dataset.csv")

# # Convert the "Date" column to a datetime type
# data['Date'] = pd.to_datetime(data['Date'])

# # Aggregate data for duplicate dates by summing "Quantity" and "Price per Unit"
# data = data.groupby('Date').agg({'Quantity': 'sum', 'Price per Unit': 'sum'}).reset_index()

# data = data.sort_values(by='Date')
# data = data.set_index('Date')
# data = data.resample('D').ffill()

# data['Sales'] = data['Quantity'] * data['Price per Unit']

# data in month (if use this please uncomment jah) -----------------------------------------------------------
# data = data.resample('M').sum() 
# print(data)

# Find best 'm' for seasonality --------------------------------------------------------------------------------
from scipy.signal import periodogram

freq, spectrum = periodogram(data['Sales'])

dominant_frequencies = freq[spectrum.argsort()[-3:]] 
potential_m_values = [int(1 / freq) for freq in dominant_frequencies]

print("Potential m values:", potential_m_values)

best_aic = float("inf")
best_m = None

for m_candidate in potential_m_values:
    model = auto_arima(data['Sales'], seasonal=True, m=m_candidate, suppress_warnings=True)
    aic = model.aic()
    if aic < best_aic:
        best_aic = aic
        best_m = m_candidate

print("Best m:", best_m)

# Use auto_arima to automatically select the best ARIMA model-----------------------------------------------------
auto_arima_model = auto_arima(data['Sales'], seasonal=True, m=best_m)

# Print the details of the selected model
print(auto_arima_model.summary())

forecast_period = 14
# Make predictions using the fitted model
forecast_values, conf_int = auto_arima_model.predict(n_periods=forecast_period, return_conf_int=True)
print("Forecasted Values:", forecast_values[:12])

# forecast results with the correct date index---------------------------------------------------------------------
forecast_df = pd.DataFrame({'Sales': forecast_values, 'Lower': conf_int[:, 0], 'Upper': conf_int[:, 1]},
                            index=pd.date_range(start=data.index[-1] + pd.DateOffset(1), periods=forecast_period, freq='D'))

# Plot observed values
plt.plot(data['Sales'], label='Observed', color='blue')

# Plot predicted values
plt.plot(forecast_df['Sales'], label='Predicted', color='red')

# Plot confidence intervals
plt.fill_between(forecast_df.index, forecast_df['Lower'], forecast_df['Upper'], color='pink', alpha=0.3, label='Confidence Intervals')

# Set labels and title
plt.xlabel('Date')
plt.ylabel('Sales')
plt.title('AutoARIMA Forecast with Confidence Intervals')

# Show legend
plt.legend()
plt.show()


# # Plot the forecast diagnostics
# auto_arima_model.plot_diagnostics()
# plt.show()  
