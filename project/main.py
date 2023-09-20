from dotenv import load_dotenv
import os

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

import requests
import json

from data_procesing import compose_interactive_graph_as_html, prepare_statistics

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
    url = 'https://api.polygonscan.com/api' +\
        f'?module=account&action=txlist&address={address}' +\
            f'&sort=asc&apikey={API_KEY}'
    
    request = requests.get(url)
    retrieved_data = json.loads(request.content)['result']
    
    if not retrieved_data:
        return {'status': 'bad response'}
    
    result = {'status': 'ok'}
    result.update(prepare_statistics(retrieved_data))
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


@app.get('/api/inner/ask-polygonsacan/visualize/', response_class=HTMLResponse)
def get_visualized_data(address: str):
    url = 'https://api.polygonscan.com/api' +\
        f'?module=account&action=txlist&address={address}' +\
            f'&sort=asc&apikey={API_KEY}'
    
    request = requests.get(url)
    retrieved_data = json.loads(request.content)['result']
    if not retrieved_data:
        return {'status': 'bad response'}
    
    html_string = compose_interactive_graph_as_html(retrieved_data)
    return html_string