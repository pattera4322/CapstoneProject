import pandas as pd
from pandas.tseries.offsets import DateOffset
import matplotlib.pyplot as plt
from prophet import Prophet
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
import numpy as np
import os
import itertools

# Read file
path = "../server/Warehouse_and_Retail_Sales.csv" #get path from firebase
name, extension = os.path.splitext(path)
print(name + "=> Type :" + extension)

if extension == ".csv":
    df = pd.read_csv( path, delimiter=",")
                    #  , header=0, parse_dates=[0], index_col=0, squeeze=True, date_parser=parser)
elif extension == ".xlsx":
    df = pd.read_excel(path)
else:
    df = pd.read_table(path)

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

df['ds'] = pd.to_datetime(df['YEAR'].astype(str) + '-' + df['MONTH'].astype(str), format='%Y-%m')
df['y'] = df['RETAIL SALES']  # Assuming you want to forecast 'RETAIL SALES'

# Split the data into a training set and a test set (e.g., 80% train, 20% test)
train_size = 0.8
split_index = int(len(df) * train_size)
train_data = df[:split_index]
test_data = df[split_index:]
print(f"{split_index} -> train : {len(train_data)} , test : {len(test_data)} ")

# Initialize the Prophet model
model = Prophet(changepoint_prior_scale=0.05)

# Fit the model to the training data
model.fit(train_data)

# Create a DataFrame with future dates for prediction
future = model.make_future_dataframe(periods=len(test_data))

# Make predictions on the test set
forecast = model.predict(future)

# Extract the predicted values for the test set
predicted_values = forecast[-len(test_data):]['yhat']

mae = mean_absolute_error(test_data['y'], predicted_values)
print(f"Mean Absolute Error (MAE): {mae}")

mse = mean_squared_error(test_data['y'], predicted_values)
print(f"Mean Squared Error (MSE): {mse}")

rmse = np.sqrt(mse)
print(f"Root Mean Squared Error (RMSE): {rmse}")

# Plot actual vs. predicted values
plt.figure(figsize=(12, 6))
plt.plot(test_data['ds'], test_data['y'], label='Actual', marker='o')
plt.plot(test_data['ds'], predicted_values, label='Predicted', linestyle='--')
plt.xlabel('Date')
plt.ylabel('Value')
plt.title('Actual vs. Predicted Values')
plt.legend()
plt.grid(True)
plt.show()