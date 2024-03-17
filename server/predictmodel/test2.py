import sys
import csv
import pandas as pd
import time

# print('Hello user , '+ sys.argv[1])
# print('This is file '+ sys.argv[2])

def flush():
    sys.stdout.flush()
time.sleep(2)
print("12")
flush()
time.sleep(5)
print("15")
flush()
time.sleep(2)
print("30")
flush()
# for x in range(60):
#   print(x)
#   flush()
time.sleep(5)
print("70")
flush()
time.sleep(5)
print("100")
flush()