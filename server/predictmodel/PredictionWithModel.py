import tensorflow as tf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sys
import json
from itertools import product as iter_product
from io import BytesIO
from statsmodels.tsa.seasonal import STL
from statsmodels.tsa.stattools import adfuller
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from tensorflow import keras
from tensorflow.keras import layers, models
import pickle
import base64
import firebase_admin
from firebase_admin import credentials, storage


### **STEP 1 : GET ARGUMENTS OR JSON**
pred_date = int(sys.argv[1])
sales_goal = int(sys.argv[2])
risk_level = list(map(int,sys.argv[3].split(',')))
lead_time = sys.argv[4]
actual_file_name = sys.argv[5]
select_data_obj = json.loads(sys.argv[6])
model_file_name = sys.argv[7]
actual_data = sys.argv[8]
user = sys.argv[9]

# Get value in select column data
total_sales = select_data_obj['totalSales']
quantity = select_data_obj['quantity']
price_each = select_data_obj['pricePerUnit']
date = select_data_obj['date']
# year = select_data_obj['year']
# month = select_data_obj['month']
product_column = select_data_obj['productName']

### **STEP 2 : GET DATA & CLEANING DATA**
cred = credentials.Certificate('./config/serviceAccountKey.json')
firebase_admin.initialize_app(cred, {'storageBucket': "capstoneproject-7cbb3.appspot.com"})

file_path_in_storage = f'{user}/{actual_file_name}'

local_filename = 'downloaded-file.txt'

bucket = storage.bucket()

# Download the file
blob = bucket.blob(file_path_in_storage)
content = blob.download_as_bytes()
print(f"File '{content}'")

bytes_io = BytesIO(content)
actual_df = pd.read_csv(bytes_io)

pred_date = 90 if pred_date == 0 else pred_date
confidence_level = 95
img_dict = {}

import pickle
with open(model_file_name, 'rb') as file:
    models_by_product = pickle.load(file)

### **STEP 3 : CLEANING DATA & DATA PROFILING**
# Handle columns name & select columns
actual_df_copy = actual_df.copy()
actual_df_copy = actual_df_copy.rename(columns={total_sales:'totalSales', date: 'date', quantity: 'quantity'})
actual_df_copy.sort_values('date', inplace=True)
print(actual_df_copy)

# Handle DateTime for Date,Month,Year columns (If any) & Sort data by date
def find_date_format(date_series):
    possible_formats = [
    '%Y-%m-%d',      # Year-Month-Day
    '%Y/%m/%d',      # Year/Month/Day
    '%d/%m/%Y',      # Day/Month/Year
    '%m/%d/%Y',      # Month/Day/Year
    '%Y%m%d',        # YearMonthDay
    '%m%d%Y',        # MonthDayYear
    '%d-%m-%Y',      # Day-Month-Year
    '%Y.%m.%d',      # Year.Month.Day
    '%b %d, %Y',     # Abbreviated month, day, year (e.g., Jan 01, 2022)
    '%B %d, %Y',     # Full month name, day, year (e.g., January 01, 2022)
    ]

    for format_option in possible_formats:
        try:
            parsed_dates = pd.to_datetime(date_series, format=format_option)
            if not parsed_dates.hasnans:
                return format_option
        except ValueError:
            continue

    # If none of the formats match
    return None
date_format = find_date_format(actual_df[date])
print(f"The detected date format is: {date_format}")

# Handle Date
if year != 'empty' and month != 'empty':
    actual_df_copy['date'] = pd.to_datetime(actual_df[year].astype(str) + '-' + actual_df[month].astype(str) + '-01', format='%Y-%m-%d')
else:
    actual_df_copy['date'] = pd.to_datetime(actual_df[date], format=date_format)

# Handle Total Sales if not cal
if total_sales == 'empty':
    actual_df_copy['totalSales'] = actual_df_copy[quantity].astype(int) * actual_df_copy[price_each].astype(int)
    actual_df_copy['totalSales'] = actual_df_copy['totalSales'].astype('int64')
print(actual_df_copy['totalSales'])

# Check Null value
isnull = actual_df_copy.isna().sum()/len(actual_df_copy)*100
column_data_types = actual_df_copy.dtypes
print(column_data_types)

# Filling missing value
columns_with_missing_values = actual_df_copy.columns[isnull > 0].tolist()
print(f"Missing value in columns => {columns_with_missing_values}")
for x in columns_with_missing_values:
   if isinstance(actual_df_copy[x], (int, float)):
        actual_df_copy[x].fillna(pd.to_numeric(actual_df_copy[x].mean()), inplace=True)
        print(f"{x} is an {type(x)}")
   elif type(actual_df_copy[x]) == str:
        actual_df_copy[x].fillna("No Data", inplace=True)
        print(f"{x} is a string")
   elif type(actual_df_copy[x]) == list:
        actual_df_copy[x].fillna(0)
        print(f"{x} is a list")
   elif type(actual_df_copy[x]) == dict:
        actual_df_copy[x].fillna(0)
        print(f"{x} is a dictionary")
   elif type(actual_df_copy[x]) == bool:
        actual_df_copy[x].fillna(False)
        print(f"{x} is a boolean")
   elif type(actual_df_copy[x]) == object:
        actual_df_copy[x].fillna("NULL")
   else:
        print(f"{x} has an unknown data type")
print(column_data_types)
actual_df_copy = actual_df_copy.dropna()
actual_df_copy = actual_df_copy.drop_duplicates()

### **STEP 4 : SPLIT DATA INTO TRAIN AND TEST (70:30 split)**
actual_df_copy.sort_values('date', inplace=True)
split_date = int(0.7 * len(actual_df_copy))
train_data = actual_df_copy.iloc[:split_date]
test_data = actual_df_copy.iloc[split_date:]
products = actual_df_copy[product_column].unique()
time_series_columns = 'date'
target_variable = ['totalSales', 'quantity']
test_date = test_data['date']
latest_date = test_data['date'].iloc[-1]

train_data = train_data.groupby(['date',product_column ]).agg({'totalSales': 'sum', 'quantity': 'sum'}).reset_index()
test_data = test_data.groupby(['date',product_column ]).agg({'totalSales': 'sum', 'quantity': 'sum'}).reset_index()

plt.figure(figsize=(12, 6))

# Plot training data
for product_value in products:
    product_train_data = train_data[train_data[product_column] == product_value]
    plt.plot(product_train_data['date'], product_train_data['totalSales'], label=f'Training - {product_value} Sales')
    product_test_data = test_data[test_data[product_column] == product_value]
    plt.plot(product_test_data['date'], product_test_data['totalSales'], label=f'Testing - {product_value} Sales')

    plt.title(f'Comparison of Training and Testing Data - Total Sales Over Time of {product_value}')
    plt.xlabel('Date')
    plt.ylabel('Total Sales')
    plt.legend()
    plt.show()

### **STEP 5: PREDICT TOTALSALES AND QUANTITY FUNCTION**
# Standardize the data
scaler = StandardScaler()
X_train = scaler.fit_transform(train_data.drop(columns=[time_series_columns, product_column]))
X_test = scaler.transform(test_data.drop(columns=[time_series_columns, product_column]))

for product_name in products:
   print(models_by_product[product_name]['totalSales'])
   print(models_by_product[product_name]['quantity'])

def predict_future_for_product(product_name, models_by_product, scaler, pred_date):
    # Retrieve the trained models for the specific product
    total_sales_model = models_by_product[product_name]['totalSales']
    quantity_model = models_by_product[product_name]['quantity']

    # actual_product_data = actual_df_copy.groupby(['date',product_column ]).agg({'totalSales': 'sum', 'quantity': 'sum'}).reset_index()
    # actual_product_data = actual_product_data[actual_product_data[product_column] == product_name]
    actual_product_data = test_data[test_data[product_column] == product_name]

    # Assuming X_future_product is your future data for the specific product
    X_future_product = scaler.transform(actual_product_data.drop(columns=[time_series_columns, product_column]))

    # Predict totalSales and quantity for the next 90 days
    forecast_index = pd.date_range(start=latest_date + pd.Timedelta(days=1), periods=pred_date, freq='D')

    # Predict totalSales
    predicted_total_sales = total_sales_model.predict(X_future_product)

    # Predict quantity
    predicted_quantity = quantity_model.predict(X_future_product)

    # Ensure all arrays have the same length
    min_length = min(len(forecast_index), len(predicted_total_sales), len(predicted_quantity))
    forecast_index = forecast_index[:min_length]
    predicted_total_sales = predicted_total_sales[:min_length]
    predicted_quantity = predicted_quantity[:min_length]

    # Create a DataFrame with the predictions and forecast dates
    predictions_df = pd.DataFrame({'Date': forecast_index, 'Predicted_totalSales': predicted_total_sales, 'Predicted_quantity': predicted_quantity})

    return predictions_df

# Initialize a dictionary to store predictions
predictions_by_product = {}

# Loop through each product
for product_name in products:
  predictions_df = predict_future_for_product(product_name, models_by_product, scaler, pred_date)
  predictions_by_product[product_name] = predictions_df

### **STEP 6 : SHOW RESULT**
# Loop through each product
for product_name in products:
    print(f"\n--- Product: {product_name} ---")

    # Retrieve predictions for the specific product
    predictions_df = predictions_by_product[product_name]

    # Retrieve actual values for the specific product
    actual_product_data = actual_df_copy.groupby(['date', product_column]).agg({'totalSales': 'sum', 'quantity': 'sum'}).reset_index()
    actual_product_data = actual_product_data[actual_product_data[product_column] == product_name]

    # Plotting
    plt.plot(predictions_df['Date'], predictions_df['Predicted_totalSales'], label=f'{product_name} - Predicted totalSales', linestyle='dashed', color='green')
    plt.plot(predictions_df['Date'], predictions_df['Predicted_quantity'], label=f'{product_name} - Predicted quantity', linestyle='dashed', color='red')

    plt.plot(actual_product_data['date'], actual_product_data['totalSales'], label=f'{product_name} - Actual totalSales', linestyle='solid', color='blue')
    plt.plot(actual_product_data['date'], actual_product_data['quantity'], label=f'{product_name} - Actual quantity', linestyle='solid', color='orange')

    graph_name = f'{product_name} - Predicted vs Actual Total Sales and Quantity for the Next {pred_date} Days'
    plt.title(graph_name)
    plt.xlabel('Date')
    plt.ylabel('Total Sales and Quantity')
    plt.legend()
    plt.savefig(f'{product_name}_Predicted_vs_Actual_TotalSales_and_Quantity.png')
    plt.show()

    # Get the binary data from the stream and store it in the dictionary
    img_stream = BytesIO()
    img_binary = img_stream.getvalue()
    img_base64 = base64.b64encode(img_binary).decode('utf-8')
    img_dict[graph_name] = img_base64

transformed_predictions = {
    'sale_forecast': {},
    'quantity_forecast': {}
}
def transformed_predictions_data(selected_data,transformedProduct):
    # print(selected_data == all_predictions_autoarima)
    for product, forecasts in selected_data.items():
        transformedProduct['sale_forecast'][product] = forecasts[['Date','Predicted_totalSales']]
        transformedProduct['quantity_forecast'][product] = forecasts[['Date','Predicted_quantity']]
        # print(transformedProduct['sale_forecast'][product].info())
        # Add a new column 'product' to each DataFrame inside the nested structure
        for forecast_type, products in transformedProduct.items():
            for product, df in products.items():
                df['Product'] = product

    # Concatenate DataFrames within each forecast type
    for forecast_type, products in transformedProduct.items():
        df_list = list(products.values())  # Extract DataFrames from the inner dictionary
        concatenated_df = pd.concat(df_list, ignore_index=True)
        transformedProduct[forecast_type] = concatenated_df

    # Display the modified nested structure
    # print(transformedProduct)

transformed_predictions_data(predictions_by_product, transformed_predictions)

### **STEP 9 : Analyzing predicted data**
## 9.1 Analyze trends of all data and each data
 # Calculate the month-to-month percentage change in predicted sales
transformed_predictions['sale_forecast']['sales_increase'] = transformed_predictions['sale_forecast']['Predicted_totalSales'].pct_change() > 0

# Filter for rows where predicted sales are increasing
increasing_months = transformed_predictions['sale_forecast'][transformed_predictions['sale_forecast']['sales_increase']]['Date'].dt.month_name().unique()
print(f"Months with Predicted Sales Increase: {', '.join(increasing_months)}")

sum_of_all_sales_actual = 0
sum_of_all_sales_predict = 0
change_points = pd.DataFrame(columns=['month','percent_increase', 'change_direction'])

# Filter DataFrame for the selected months
for month in increasing_months:
    selected_months_df = transformed_predictions['sale_forecast'][transformed_predictions['sale_forecast']['Date'].dt.month_name() == month]
        # Calculate the percent increase in total sales for March
    sum_of_sales_actual = actual_df_copy.loc[actual_df_copy["date"].dt.month_name() == month, 'totalSales'].sum()
    sum_of_sales_predict = selected_months_df['Predicted_totalSales'].sum()


    percent_increase = ((sum_of_sales_predict - sum_of_sales_actual) / sum_of_sales_predict) * 100
    sum_of_all_sales_actual = sum_of_sales_actual
    sum_of_all_sales_predict += sum_of_sales_predict

    # Print the results
    print(f"Actual Sales in {month}: {sum_of_sales_actual}")
    print(f"Predicted Sales in {month}: {sum_of_sales_predict}")
    print(f"Predicted Sales Increase in {month}: {percent_increase:.2f}%")
    change_direction = 'Increase' if percent_increase > 0 else 'Decrease' if percent_increase < 0 else 'No Change'
    # Add information to the change_points DataFrame
    change_points = change_points.append({'month': month, 'percent_increase': percent_increase, "change_direction": change_direction}, ignore_index=True)

## 9.2 Compare sales trends vs user goal
total_sales = sum_of_all_sales_actual + sum_of_all_sales_predict # compare with sales_goal
percent_total_sales_of_sales_goal = ((sales_goal - total_sales) / sales_goal) * 100

## 9.3 How many product should be stock
# INVENTORY TRENDS
# 11.3 How many product should be stock (stock product -> actual no. of product * min and actual no. of product * max)
total_quantity_of_predictions = {}
total_quantity_of_actual = {}
risk_min_stock = []
risk_max_stock = []

# Solution 0
for product_name in products:
    for types, forecasts in transformed_predictions.items():
        total_quantity_of_predictions = transformed_predictions['quantity_forecast'].groupby('Product')['Predicted_quantity'].sum()
    total_quantity_of_actual = actual_df_copy.groupby(product_column)['quantity'].sum()
    risk_min_stock = round(((total_quantity_of_predictions*risk_level[0])/100) + total_quantity_of_predictions,2)
    risk_max_stock = round(((total_quantity_of_predictions*risk_level[1])/100) + total_quantity_of_predictions,2)
    print(f"Stock min({risk_min_stock[product_name]}) - max({risk_max_stock[product_name]}) vs predict sales quantity({total_quantity_of_predictions[product_name]}) of {product_name}")

# Solution 1
from scipy.stats import norm, zscore
user_confidence_level = confidence_level * 0.01 # 95% confidence level
standard_deviation = np.std(transformed_predictions['quantity_forecast']['Predicted_quantity'])  # Replace with your actual standard deviation
lead_time = 30

# Calculate safety stock based on normal distribution
safety_stock_1 = norm.ppf(user_confidence_level) * standard_deviation * np.sqrt(lead_time)

# Calculate min-max range
min_stock_level = round(transformed_predictions['quantity_forecast']['Predicted_quantity'].sum() - safety_stock_1,2)
max_stock_level = round(transformed_predictions['quantity_forecast']['Predicted_quantity'].sum() + safety_stock_1,2)

# Print or use the results as needed
# print("Predicted Values 1:", transformed_predictions['quantity_forecast']['forecast'])
print("Safety Stock 1:", safety_stock_1)
print("Min Stock Level 1:", min_stock_level)
print("Max Stock Level 1:", max_stock_level)

# Solution 2
user_confidence_level_2 = confidence_level * 0.01 # 95% confidence level
standard_deviation_2 = np.std(transformed_predictions['quantity_forecast']['Predicted_quantity'])  # Replace with your actual standard deviation
lead_time = 30

# Calculate safety stock based on normal distribution
safety_stock_2 = norm.ppf(user_confidence_level_2) * standard_deviation_2 * np.sqrt(lead_time)

# Calculate min-max range
min_stock_level_2 = round(transformed_predictions['quantity_forecast'].groupby('Product')['Predicted_quantity'].sum() - safety_stock_2,2)
max_stock_level_2 = round(transformed_predictions['quantity_forecast'].groupby('Product')['Predicted_quantity'].sum() + safety_stock_2,2)

# Print or use the results as needed
# print(f"Predicted Values 2 of {product_name}")
print("Safety Stock 2:", safety_stock_2)
print("Min Stock Level 2:", min_stock_level_2)
print("Max Stock Level 2:", max_stock_level_2)

# Solution 3
# Set the desired confidence level range
# lower_confidence = 0.00
# upper_confidence = 0.25
lower_confidence = risk_level[0] # 26
upper_confidence = risk_level[1] # 50
print(f'{risk_level[0]} - {risk_level[1]}')

# Calculate safety stock for each product
safety_stock_results = {}

for product_name in products:
    demand_values = transformed_predictions['quantity_forecast'][transformed_predictions['quantity_forecast']['Product'] == product_name]['Predicted_quantity']
    # Calculate standard deviation of demand
    demand_std_dev = np.std(demand_values)
    print(demand_std_dev)

    # Determine Z-scores based on the confidence level range
    lower_z_score = norm.ppf(lower_confidence * 0.01)
    upper_z_score = norm.ppf(upper_confidence * 0.01)
    print(f'lower_z_score : { lower_z_score}')
    print(f'upper_z_score : { upper_z_score}')

    # Assuming lead time is 1 (you need to adjust this based on your specific scenario)
    lead_time = 30

    # Calculate safety stocks for the lower and upper bounds
    lower_safety_stock = lower_z_score * demand_std_dev * np.sqrt(lead_time)
    upper_safety_stock = upper_z_score * demand_std_dev * np.sqrt(lead_time)

    # Store the results
    safety_stock_results[product_name] = {'Lower Confidence': lower_safety_stock, 'Upper Confidence': upper_safety_stock}

# Print the safety stock results
for product_name, results in safety_stock_results.items():
    print(f"Product: {product_name}")
    print(f"Lower Confidence Safety Stock: {results['Lower Confidence']}")
    print(f"Upper Confidence Safety Stock: {results['Upper Confidence']}")

## 9.4 Find percent of each sold product
total_quantity_of_actual = actual_df_copy.groupby(product_column)['quantity'].sum()

### **STEP 10 : Export data and related variable**
# data_to_save = {
#     # 'actualData': actual_df_copy.to_dict(orient='records'),
#     # selected predict data
#     'predictedSalesValues': transformed_predictions['sale_forecast'].to_dict(orient='records'),
#     'predictedQuantityValues': transformed_predictions['quantity_forecast'].to_dict(orient='records'),
#     'graph': img_dict,
# }
# print(data_to_save)
transformed_predictions['sale_forecast']['Date'] = transformed_predictions['sale_forecast']['Date'].dt.strftime('%Y-%m-%d')
transformed_predictions['sale_forecast'].drop('sales_increase', axis=1, inplace=True)
transformed_predictions['quantity_forecast']['Date'] = transformed_predictions['quantity_forecast']['Date'].dt.strftime('%Y-%m-%d')
transformed_predictions['sale_forecast'].sort_values('Date', inplace=True)
transformed_predictions['quantity_forecast'].sort_values('Date', inplace=True)
print(f"{transformed_predictions['sale_forecast'].to_dict(orient='records')}----EndOfValue")
print(f"{transformed_predictions['quantity_forecast'].to_dict(orient='records')}----EndOfValue")
print(f"{img_dict}----EndOfValue")