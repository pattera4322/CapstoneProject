import pandas as pd
from pandas.tseries.offsets import DateOffset
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import numpy as np
import os
import itertools

# Read file
path = "D:/CapstoneProject/server/assets/Warehouse_and_Retail_Sales.csv"
name, extension = os.path.splitext(path)
print(name + "=> Type :" + extension)

def parser(x):
 return pd.datetime.strptime('190'+x.to_datetime, '%Y-%m')

if extension == ".csv":
    df = pd.read_csv( path, delimiter=",")
                    #  , header=0, parse_dates=[0], index_col=0, squeeze=True, date_parser=parser)
elif extension == ".xlsx":
    df = pd.read_excel(path)
else:
    df = pd.read_table(path)

#Clean data

isnull = df.isna().sum()/len(df)*100
# Need to check column wich one is "Sales", "Date" !!!!!!!!!!!!!

# Check the data types of all columns in the DataFrame
column_data_types = df.dtypes
# print(column_data_types)

# Clean data Part
    # Check which columns have missing values
# columns_with_missing_values = df.columns[df.isnull().any()].tolist()
columns_with_missing_values = df.columns[isnull > 0].tolist()
print(columns_with_missing_values)
for x in columns_with_missing_values:
   if type(df[x]) == int | type(df[x]) == float:
        df[x].fillna(pd.to_numeric(df[x].mean()), inplace=True)
        print(f"{x} is an {type(x)}")
   elif type(df[x]) == str:
        df[x].fillna("No Data", inplace=True)
        print(f"{x} is a string")
   elif type(df[x]) == list:
        df[x].fillna(0)
        print(f"{x} is a list")
   elif type(df[x]) == dict:
        df[x].fillna(0)
        print(f"{x} is a dictionary")
   elif type(df[x]) == bool:
        df[x].fillna(False)
        print(f"{x} is a boolean")
   else:
        print(f"{x} has an unknown data type")
print(column_data_types)
df = df.dropna()
df = df.drop_duplicates()

# Split data to train and test 
time_series_columns = ['YEAR', 'MONTH']
target_variable = 'RETAIL SALES'

X = df[time_series_columns]  # Time series features (YEAR and MONTH)
y = df[target_variable]      # Target variable (RETAIL SALES)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Trainning model with ARIMA
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

# Plot ACF and PACF
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
plot_acf(y_train, lags=40, ax=ax1)
plot_pacf(y_train, lags=40, ax=ax2)
plt.show()

p_values = range(0, 5)
d_values = range(0, 2)
q_values = range(0, 5)

best_aic = float("inf")
best_order = None

for p, d, q in itertools.product(p_values, d_values, q_values):
    try:
        model = ARIMA(y_train, order=(p, d, q))
        results = model.fit()
        aic = results.aic
        if aic < best_aic:
            best_aic = aic
            best_order = (p, d, q)
    except:
        continue

print(f"Best ARIMA Order (p, d, q): {best_order} | AIC: {best_aic}")
# Create and fit the ARIMA model
model = ARIMA(y_train, order=(p, d, q))
results = model.fit()

# Get the summary of the ARIMA model
print(results.summary())

# Evaluation
# Make predictions on the test set
y_pred = results.forecast(steps=len(X_test), exog=X_test)

mae = mean_absolute_error(y_test, y_pred)
print(f"Mean Absolute Error (MAE): {mae}")

mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error (MSE): {mse}")

rmse = np.sqrt(mse)
print(f"Root Mean Squared Error (RMSE): {rmse}")

# Optionally, you can plot the actual vs. predicted values
plt.figure(figsize=(12, 6))
plt.plot(y_train, label='Training Data', color='blue')
plt.plot(range(len(y_train), len(y_train) + len(y_test)), y_test, label='Testing Data', color='green')
plt.plot(range(len(y_train), len(y_train) + len(y_test)), y_pred, label='Predicted Data', color='red')
plt.legend()
plt.xlabel('Time')
plt.ylabel('Value')
plt.title('ARIMA Model Forecast')
plt.show()