from dotenv import load_dotenv
import os

from fastapi import FastAPI
from fastapi.responses import FileResponse

import requests
import json


# INITIALIZATION ↓
app = FastAPI()

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    print('.env found, starting app')
    load_dotenv(dotenv_path)
    API_KEY = os.getenv('API_KEY')
else:
    raise FileNotFoundError('.env not found, exception raised')
# INITIALIZATION ↑


# FRONTEND ↓
@app.get('/', response_class=FileResponse)
def main() -> FileResponse:
    return FileResponse('view/build/index.html', status_code=200)


@app.get('/static/js/{file_name}', response_class=FileResponse)
def get_script(file_name: str) -> FileResponse:
    return FileResponse(
        path=f'view/build/static/js/{file_name}',
        status_code=200
    )
# FRONTEND ↑


@app.get('/api/inner/ask-polygonscan')
def ask_polygonscan(address: str):
    url = 'https://api.polygonscan.com/api' +\
        f'?module=account&action=txlist&address={address}' +\
            f'&sort=asc&apikey={API_KEY}'
    
    request = requests.get(url)
    retrieved_data = json.loads(request.content)
    print(retrieved_data)
    return retrieved_data
    
    