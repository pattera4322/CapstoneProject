import tensorflow as tf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Set the hyperparameters   
window_size = 12

# Load the dataset
df = pd.read_csv('./server/AirPassengers.csv')
df['Month'] = pd.to_datetime(df['Month'], format='%Y-%m')
df.index = df['Month']
del df['Month']
print(df)

# Explore the data
plt.figure(figsize=(10,6))
plt.plot(df)
plt.grid(True)
plt.xlabel('Years')
plt.ylabel('Number of Passengers')
plt.show()

# Split the data into training and testing setsv
train = df.iloc[:len(df)-window_size]
test = df.iloc[len(df)-window_size:]

plt.figure(figsize=(10,6))
plt.plot(train, 'green', label='Train Data')
plt.plot(test, 'red', label='Test Data')
plt.grid(True)
plt.legend()
plt.xlabel('Years')
plt.ylabel('Number of Passengers')
plt.show()

# Prepare the data for training (sliding window approach)
x_train = []
y_train = []
series = train['#Passengers'].values
for i in range(len(series)-window_size):
    x_train.append(series[i:i+window_size])
    y_train.append(series[i+window_size])

x_train = np.array(x_train)
y_train = np.array(y_train)
print(series)
print(x_train)
print(y_train)

#Build the model
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(window_size,)),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1, activation='linear')
])

# Compile the model
model.compile(optimizer='adam', loss='mse')

# Train the model
history = model.fit(x_train, y_train, epochs=500, batch_size=64)
plt.plot(history.history['loss'])
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.show()

# Make predictions
forecast = []
forecast_range = 12
test_series = series[-window_size:]

for time in range(forecast_range):
    y_pred = model.predict(test_series[np.newaxis])
    forecast = np.append(forecast, y_pred)
    test_series = np.append(test_series, y_pred)
    test_series = test_series[-window_size:]
    
# Visualize the results
df_test = test.copy()
df_test['Prediction'] = pd.Series(forecast, index=test.index)
plt.figure(figsize=(10,6))
plt.plot(train, 'green', label='Train Data')
plt.plot(df_test['#Passengers'], 'red', label='Test Data')
plt.plot(df_test['Prediction'], 'blue', label='Prediction')
plt.grid(True)
plt.legend()
plt.xlabel('Years')
plt.ylabel('Number of Passengers')
plt.show()
