from dotenv import load_dotenv
import os

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import requests
import json
import pandas as pd
import numpy as np

# INITIALIZATION ↓
app = FastAPI()

origins = [
    'http://localhost',
    'http://localhost:3000',
    'http://127.0.0.1',
    'http://127.0.0.1:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    print('.env found, starting app')
    load_dotenv(dotenv_path)
    API_KEY = os.getenv('API_KEY')
else:
    raise FileNotFoundError('.env not found, exception raised')
# INITIALIZATION ↑


@app.get('/api/inner/ask-polygonscan/statistics/')
def get_statistics_data(address: str):
    print('OK!')
    url = 'https://api.polygonscan.com/api' +\
        f'?module=account&action=txlist&address={address}' +\
            f'&page=1&offset=50&sort=asc&apikey={API_KEY}'
    
    request = requests.get(url)
    retrieved_data = json.loads(request.content)['result']
    values_list = [int(dict_['value']) for dict_ in retrieved_data]
    values_array = np.array(values_list)
    result = {
        'avgTransactions': np.average(values_array),
        'sumTransactions': np.sum(values_array),
        'amountTransactions': values_array.size,
    }
    print(result)
    return result


@app.get('/api/inner/ask-polygonscan/paginated/')
def get_display_data(address: str, page: str='1', offset: str='10'):
    url = 'https://api.polygonscan.com/api' +\
        f'?module=account&action=txlist&address={address}' +\
            f'&page={page}&offset={offset}&sort=asc&apikey={API_KEY}'
    request = requests.get(url)
    retrieved_data = json.loads(request.content)['result']
    values_list = [int(dict_['value']) for dict_ in retrieved_data]
    
    return values_list
    