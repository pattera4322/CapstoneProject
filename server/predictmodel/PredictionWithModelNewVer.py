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
from firebase_admin import credentials, firestore, storage
import joblib
from datetime import datetime
import warnings

# Ignore all warnings
warnings.filterwarnings("ignore")

### **STEP 1 : GET ARGUMENTS OR JSON**
pred_date = sys.argv[4]#sys.argv[1]
actual_file_name = sys.argv[2] #json_data[1] #sys.argv[4]
model_file_name = sys.argv[3] #json_data[2] #sys.argv[5]
user = sys.argv[1] #json_data[0] #sys.argv[6]

### **STEP 2 : GET DATA & CLEANING DATA**
if not firebase_admin._apps:
    cred = credentials.Certificate('./config/serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        'storageBucket': "capstoneproject-7cbb3.appspot.com",
        'databaseURL': "https://capstoneproject-7cbb3-default-rtdb.asia-southeast1.firebasedatabase.app"
    })

# file_path_in_storage = f'{user}/{actual_file_name}/{actual_file_name}' ######### file name in folder 5.csv need to changing 5
file_path_in_storage = f'{user}/{actual_file_name}'
bucket = storage.bucket()

# FOR GET DATA FROM FIRESTORE USER/HISTORY METHOD
user_id = f'users/{user}/history'
db = firestore.client()
if actual_file_name:
  # doc_ref = db.collection(user).document(actual_file_name)
  doc_ref = db.document(f'users/{user}/history/{actual_file_name}')
else:
  doc_ref = db.document(f'users/{user}/history/')

try:
    # Get the document snapshot
    get_doc = doc_ref.get()
    if get_doc.exists:
        # Retrieve data from the document
        data = get_doc.to_dict()
        actual_sales_df = pd.DataFrame.from_dict(data['actualSalesValues'])
        actual_quantity_df = pd.DataFrame.from_dict(data['actualQuantityValues'])
        evaluation_results_total_sales = data['evalTotalSales']
        evaluation_results_quantity = data['evalQuantity']

    else:
        print("Document {} does not exist.".format(f'{user_id}/{actual_file_name}'))
except Exception as e:
    print("Error retrieving document:", e)

date = "date"
product_column = "productName"
quantity = "quantity"
total_sales = "totalSales"
pred_date = 90 if pred_date == 0 else pred_date

# Load Model
file_path_model = f'{user}/{model_file_name}'
blob_model = bucket.blob(file_path_model)
model_data_pickle = blob_model.download_as_bytes()
models_by_product = pickle.loads(model_data_pickle)

### **STEP 3 : CLEANING DATA & DATA PROFILING**
# Handle columns name & select columns
actual_df = pd.merge(actual_sales_df, actual_quantity_df, on=["date", "productName"], how="outer")
actual_df.fillna(0, inplace=True)
actual_df_copy = actual_df.copy()
actual_df_copy = actual_df_copy.rename(columns={total_sales:'totalSales', date: 'date', quantity: 'quantity'})
actual_df_copy.sort_values('date', inplace=True)
# print(actual_df_copy)

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
# print(f"The detected date format is: {date_format}")

# Handle Date
# if year != 'empty' and month != 'empty':
#     actual_df_copy['date'] = pd.to_datetime(actual_df[year].astype(str) + '-' + actual_df[month].astype(str) + '-01', format='%Y-%m-%d')
# else:
#     actual_df_copy['date'] = pd.to_datetime(actual_df[date], format=date_format)

# Check Null value
isnull = actual_df_copy.isna().sum()/len(actual_df_copy)*100
column_data_types = actual_df_copy.dtypes
# print(column_data_types)

# Filling missing value
columns_with_missing_values = actual_df_copy.columns[isnull > 0].tolist()
# print(f"Missing value in columns => {columns_with_missing_values}")
for x in columns_with_missing_values:
   if isinstance(actual_df_copy[x], (int, float)):
        actual_df_copy[x].fillna(pd.to_numeric(actual_df_copy[x].mean()), inplace=True)
        # print(f"{x} is an {type(x)}")
   elif type(actual_df_copy[x]) == str:
        actual_df_copy[x].fillna("No Data", inplace=True)
        # print(f"{x} is a string")
   elif type(actual_df_copy[x]) == list:
        actual_df_copy[x].fillna(0)
        # print(f"{x} is a list")
   elif type(actual_df_copy[x]) == dict:
        actual_df_copy[x].fillna(0)
        # print(f"{x} is a dictionary")
   elif type(actual_df_copy[x]) == bool:
        actual_df_copy[x].fillna(False)
        # print(f"{x} is a boolean")
   elif type(actual_df_copy[x]) == object:
        actual_df_copy[x].fillna("NULL")
   else:
        print(f"{x} has an unknown data type")
# print(column_data_types)
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

### **STEP 5: PREDICT TOTALSALES AND QUANTITY FUNCTION**
# Standardize the data
scaler = StandardScaler()
X_train = scaler.fit_transform(train_data.drop(columns=[time_series_columns, product_column]))
X_test = scaler.transform(test_data.drop(columns=[time_series_columns, product_column]))

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
    predicted_total_sales = total_sales_model.predict(X_future_product).flatten()

    # Predict quantity
    predicted_quantity = quantity_model.predict(X_future_product).flatten()

    # Ensure all arrays have the same length
    min_length = min(len(forecast_index), len(predicted_total_sales), len(predicted_quantity))
    forecast_index = forecast_index[:min_length]
    predicted_total_sales = predicted_total_sales[:min_length]
    predicted_quantity = predicted_quantity[:min_length]

    # Create a DataFrame with the predictions and forecast dates
    predictions_df = pd.DataFrame({'date': forecast_index, 'Predicted_totalSales': predicted_total_sales, 'Predicted_quantity': predicted_quantity})

    return predictions_df

# Initialize a dictionary to store predictions
predictions_by_product = {}

# Loop through each product
for product_name in products:
  predictions_df = predict_future_for_product(product_name, models_by_product, scaler, pred_date)
  predictions_by_product[product_name] = predictions_df

### **STEP 6 : SHOW RESULT**
transformed_predictions = {
    'sale_forecast': {},
    'quantity_forecast': {}
}
def transformed_predictions_data(selected_data,transformedProduct, model):
    # print(selected_data == all_predictions_autoarima)
    for product, forecasts in selected_data.items():
        transformedProduct['sale_forecast'][product] = forecasts[['date','Predicted_totalSales']]
        transformedProduct['quantity_forecast'][product] = forecasts[['date','Predicted_quantity']]
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

transformed_predictions_data(predictions_by_product, transformed_predictions, "DNN-Tensorflow")

### **STEP 7 : Export predicted data**
transformed_predictions['quantity_forecast']['date'] = pd.to_datetime(transformed_predictions['quantity_forecast']['date'])
transformed_predictions['sale_forecast']['date'] = pd.to_datetime(transformed_predictions['sale_forecast']['date'])
actual_df_copy['date'] = pd.to_datetime(actual_df_copy['date'])



def upload_prediction_value(user_id,data_id,data_to_be_history):
  # Upload predicted data to firestore database
  db = firestore.client()
  if data_id:
    doc_ref = db.collection(user_id).document(data_id)
  else:
    doc_ref = db.collection(user_id).document()
  doc_ref.set(data_to_be_history)
  print(f'Data uploaded to Firestore in user: {user_id}, document ID: {doc_ref.id}')

data_to_save = {
    'predictedSalesValues': transformed_predictions['sale_forecast'].to_dict(orient='records'),
    'predictedQuantityValues': transformed_predictions['quantity_forecast'].to_dict(orient='records'),
    'actualSalesValues' : actual_df_copy[['date','productName','totalSales']].to_dict(orient='records'),
    'actualQuantityValues' : actual_df_copy[['date','productName','quantity']].to_dict(orient='records'),
    # Evaluate result
    'evalTotalSales': evaluation_results_total_sales,
    'evalQuantity': evaluation_results_quantity,
    # 'best_params_models': best_params_all_products
}
upload_prediction_value(f'users/{user}/history',actual_file_name,data_to_save)