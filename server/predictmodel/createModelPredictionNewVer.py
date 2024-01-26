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
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
import base64
import firebase_admin
from firebase_admin import credentials, storage, db
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit
from keras.wrappers.scikit_learn import KerasRegressor
import warnings

# Ignore all warnings
warnings.filterwarnings("ignore")


### **STEP 1 : GET ARGUMENTS OR JSON**
# Get each data from sys or JSON
pred_date = json_data[0] #sys.argv[1]
sales_goal = json_data[1] #sys.argv[2]
risk_level = json_data[2] #sys.argv[3]
lead_time = json_data[3]
actual_file_name = json_data[4] #sys.argv[4]
model_file_name = json_data[5] #sys.argv[5]
user = json_data[6] #sys.argv[6]

print(f'pred_date : {pred_date}, Sales Goal: {sales_goal}, Risk Level: {risk_level}, File name: {actual_file_name}, user: {user},  Model: {model_file_name}')

### **STEP 2 : GET DATA & CLEANING DATA**
if not firebase_admin._apps:
    cred = credentials.Certificate('./config/serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {'storageBucket': "capstoneproject-7cbb3.appspot.com"})

file_path_in_storage = f'{user}/{actual_file_name}'

# Download a file
bucket = storage.bucket()
blob = bucket.blob(file_path_in_storage)
content = blob.download_as_bytes()

bytes_io = BytesIO(content)
actual_df = pd.read_csv(bytes_io) if actual_file_name.endswith('.csv') else pd.read_excel(bytes_io)

# Get columns name
list_col_name = list(actual_df.columns)
print(list_col_name)
date = list_col_name[0]
product_column = list_col_name[1]
price_each = list_col_name[2]
quantity = list_col_name[3]
total_sales = list_col_name[4]

# Set default value
pred_date = 90 if pred_date == 0 else pred_date
confidence_level = 95

### **STEP 3 : CLEANING DATA & DATA PROFILING**
# Handle columns name & select columns
actual_df_copy = actual_df.copy()
# actual_df_copy = actual_df_copy.rename(columns={total_sales:'totalSales', date: 'date', quantity: 'quantity'})
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

# Handle Total Sales if not cal
if total_sales == 'empty':
    actual_df_copy['totalSales'] = actual_df_copy[quantity].astype(int) * actual_df_copy[price_each].astype(int)
    actual_df_copy['totalSales'] = actual_df_copy['totalSales'].astype('int64')
# print(actual_df_copy['totalSales'])

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
       None
        # print(f"{x} has an unknown data type")
# print(column_data_types)
actual_df_copy = actual_df_copy.dropna()
actual_df_copy = actual_df_copy.drop_duplicates()

## Profiling function
def profiling():
        # Perform seasonal decomposition
    decomposition = STL(actual_df_copy['totalSales'], period=12)# period parameter for seasonality
    result = decomposition.fit()
    fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(10, 8))

    ax1.plot(actual_df_copy['date'],actual_df_copy['totalSales'])
    ax1.set_title('Original Data')

    ax2.plot(result.trend)
    ax2.set_title('Trend')

    ax3.plot(result.seasonal)
    ax3.set_title('Seasonal')

    ax4.plot(result.resid)
    ax4.set_title('Residual')

    plt.tight_layout()
    plt.close()
    # plt.savefig('decomposition_actual.png')

        # Statistical tests
    ad_test = adfuller(actual_df_copy['totalSales'])
    # print("ADF Statistic:", ad_test[0])
    # print("p-value:", ad_test[1])

        # ACF and PACF plots
    plot_acf(actual_df_copy['totalSales'])
    # plt.savefig('autocorrelation_actual.png')
    plot_pacf(actual_df_copy['totalSales'], method='ywm')
    # plt.savefig('partial_autocorrelation_actual.png')
    plt.close()

        # Outlier detection (example using Z-score method)
    z_score = (actual_df_copy['totalSales'] - actual_df_copy['totalSales'].mean()) / actual_df_copy['totalSales'].std()
    outliers = actual_df_copy[abs(z_score) > 3]
    if outliers.empty:
        actual_df_copy.drop(outliers.index, inplace=True)
    # print("Detected outliers:", outliers) # Empty DataFrame means the data has no outlier
profiling()

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
    plt.close()

def eval_features():
    # X = actual_df_copy.loc[:, actual_df_copy.columns != time_series_columns]
    X = actual_df_copy[[time_series_columns]]
    y = actual_df_copy[target_variable]
    # Fit a Random Forest classifier (or regressor) to the data to Evaluate individual features for relevance and significance
    model = RandomForestRegressor()
    model.fit(X, y)

    # Extract feature importances
    feature_importances = model.feature_importances_

    # Display the importance of each feature
    feature_importance_df = pd.DataFrame({'Feature': X.columns, 'Importance': feature_importances})
    feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)
    # print(feature_importance_df)
eval_features()

### **STEP 5 : CREATE AND TRAIN DNN MODEL**
# Standardize the data
scaler = StandardScaler()
X_train = scaler.fit_transform(train_data.drop(columns=[time_series_columns, product_column]))
X_test = scaler.transform(test_data.drop(columns=[time_series_columns, product_column]))

def build_dnn_model(input_shape):
    model_dnn = tf.keras.Sequential()
    model_dnn.add(tf.keras.layers.Dense(256, activation='relu', input_shape=(input_shape,)))
    model_dnn.add(tf.keras.layers.Dense(128, activation='relu'))
    model_dnn.add(tf.keras.layers.Dense(64, activation='relu'))
    model_dnn.add(tf.keras.layers.Dense(32, activation='relu'))
    model_dnn.add(tf.keras.layers.Dense(1, activation='linear'))

    optimizer = tf.keras.optimizers.Adam()
    model_dnn.compile(optimizer=optimizer, loss='mean_squared_error', metrics=['mae'])
    return model_dnn

def grid_search_best_params(X_train, y_train):
    param_grid = {
        'epochs': [50, 100, 150],
        'batch_size': [16, 32, 64]
    }

    # keras_regressor = keras.wrappers.scikit_learn.KerasRegressor(build_fn=build_dnn_model, input_shape=X_train.shape[1], verbose=0)
    keras_regressor = KerasRegressor(build_fn=build_dnn_model, input_shape=X_train.shape[1], verbose=0)
    grid_search = GridSearchCV(keras_regressor, param_grid, scoring='neg_mean_squared_error', cv=TimeSeriesSplit(n_splits=5), verbose=1, n_jobs=-1)
    grid_search.fit(X_train, y_train)

    best_params = grid_search.best_params_
    return best_params

def train_model(input_shape,X_train, y_train, best_params):
    model = build_dnn_model(input_shape)
    model.fit(X_train, y_train, **best_params)
    return model

# Initialize a dictionary to store models
models_by_product = {}
# Loop through each product
for product_name in products:
    print(f"\n--- Product: {product_name} ---")

    # Filter data for the current product
    train_product_data = train_data[train_data[product_column] == product_name]

    # Split data into features (X) and target (y)
    X_train_product = scaler.transform(train_product_data.drop(columns=[time_series_columns, product_column]))
    y_train_total_sales = train_product_data['totalSales']
    y_train_quantity = train_product_data['quantity']
    input_shape = X_train_product.shape[1]

    # Step 2: Find best params for totalSales
    best_params_total_sales = grid_search_best_params(X_train_product, y_train_total_sales) #['totalSales']
    best_params_quantity = grid_search_best_params(X_train_product, y_train_quantity) #['quantity']

    # Step 3: Train model for totalSales
    model_total_sales = train_model(input_shape,X_train_product, y_train_total_sales, best_params_total_sales)
    model_quantity = train_model(input_shape,X_train_product, y_train_quantity, best_params_quantity)

    # Store models in the dictionary
    models_by_product[product_name] = {'totalSales': model_total_sales, 'quantity': model_quantity}

for product_name in products:
   print(models_by_product[product_name]['totalSales'])
   print(models_by_product[product_name]['quantity'])   

### **STEP 6: PREDICT TOTALSALES AND QUANTITY FUNCTION**
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
    predictions_df = pd.DataFrame({'Date': forecast_index, 'Predicted_totalSales': predicted_total_sales, 'Predicted_quantity': predicted_quantity})

    return predictions_df

# Initialize a dictionary to store predictions
predictions_by_product = {}
# Loop through each product
for product_name in products:
  predictions_df = predict_future_for_product(product_name, models_by_product, scaler, pred_date)
  predictions_by_product[product_name] = predictions_df

### **STEP 7 : EVALUATE FUNCTION**
# Initialize dictionaries to store evaluation results
evaluation_results_total_sales = {}
evaluation_results_quantity = {}

# Loop through each product
for product_name in products:
    #print(f"\n--- Product: {product_name} ---")

    # Retrieve test data for the specific product
    test_product_data = test_data[test_data[product_column] == product_name]

    # Split the test data into features (X_test) and target variables (y_test_total_sales and y_test_quantity)
    X_test_product = scaler.transform(test_product_data.drop(columns=[time_series_columns, product_column]))
    y_test_total_sales = test_product_data['totalSales']
    y_test_quantity = test_product_data['quantity']

    # Retrieve the corresponding trained models
    model_total_sales = models_by_product[product_name]['totalSales']
    model_quantity = models_by_product[product_name]['quantity']

    # Predict totalSales and quantity using the trained models
    predicted_values_total_sales = model_total_sales.predict(X_test_product)
    predicted_values_quantity = model_quantity.predict(X_test_product)

    # Evaluate totalSales
    mse_total_sales = mean_squared_error(y_test_total_sales, predicted_values_total_sales)
    r2_total_sales = r2_score(y_test_total_sales, predicted_values_total_sales)
    #print(f"Evaluation for totalSales - MSE: {mse_total_sales}, R2: {r2_total_sales}")

    # Evaluate quantity
    mse_quantity = mean_squared_error(y_test_quantity, predicted_values_quantity)
    r2_quantity = r2_score(y_test_quantity, predicted_values_quantity)
    #print(f"Evaluation for quantity - MSE: {mse_quantity}, R2: {r2_quantity}")

    # Store evaluation results in dictionaries
    evaluation_results_total_sales[product_name] = {'MSE': round(mse_total_sales), 'R2': round(r2_total_sales)}
    evaluation_results_quantity[product_name] = {'MSE': round(mse_quantity), 'R2': round(r2_quantity)}

    # Plotting
    plt.plot(test_product_data['date'], predicted_values_total_sales, label=f'{product_name} - Predicted totalSales', linestyle='dashed', color='green')
    plt.plot(test_product_data['date'], predicted_values_quantity, label=f'{product_name} - Predicted quantity', linestyle='dashed', color='red')

    plt.plot(test_product_data['date'], test_product_data['totalSales'], label=f'{product_name} - Actual totalSales', linestyle='solid', color='blue')
    plt.plot(test_product_data['date'], test_product_data['quantity'], label=f'{product_name} - Actual quantity', linestyle='solid', color='orange')

    plt.title(f'{product_name} - Predicted vs Actual Test Total Sales and Quantity for the Next {pred_date} Days')
    plt.xlabel('Date')
    plt.ylabel('Total Sales and Quantity')
    plt.legend()
    plt.close()

### **STEP 8 : SHOW RESULT**
# Loop through each product
for product_name in products:
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
    # plt.savefig(f'{product_name}_Predicted_vs_Actual_TotalSales_and_Quantity.png')
    plt.close()

transformed_predictions = {
    'sale_forecast': {},
    'quantity_forecast': {}
}
def transformed_predictions_data(selected_data,transformedProduct, model):
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

transformed_predictions_data(predictions_by_product, transformed_predictions, "DNN-Tensorflow")

### **STEP 9 : Export predicted data**
data_to_save = {
    'predictedSalesValues': transformed_predictions['sale_forecast'].to_dict(orient='records'),
    'predictedQuantityValues': transformed_predictions['quantity_forecast'].to_dict(orient='records'),
    # Evaluate result
    'evalTotalSales': evaluation_results_total_sales,
    'evalQuantity': evaluation_results_quantity,
    'models': models_by_product
}
data_to_be_history = data_to_save.to_dict(orient='index')

ref_path = f'{user}/history/{actual_file_name}'
ref = db.reference(ref_path)
ref.update(data_to_be_history)