import sys
import csv
import pandas as pd
import matplotlib.pyplot as plt

print('Hello, '+ sys.argv[1],sys.argv[2],sys.argv[3])

csv_file = sys.argv[4]
try:
    with open(csv_file, 'r') as file:
        csv_reader = csv.reader(file)
        count = 0  

        for row in csv_reader:
            print(', '.join(row))
            count += 1
            
            if count == 10:
                break
            
except FileNotFoundError:
        print(f"File '{csv_file}' not found.")
        
df = pd.read_csv(csv_file)

df.plot(x='Age', y='Fare', kind='line')
plt.title("CSV Data Plot")
plt.xlabel("Fare")
plt.ylabel("Age")

plt.show()

        