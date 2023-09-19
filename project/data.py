import requests
import json
address = '0x0000000000000000000000000000000000001010'
API_KEY = 'B69E26UJTN7NWMYJCRYSZ8XQDEYJE6NPHD'

url = 'https://api.polygonscan.com/api' +\
    f'?module=account&action=txlist&address={address}' +\
        f'&sort=asc&apikey={API_KEY}'

request = requests.get(url)
retrieved_data = json.loads(request.content)['result']

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sea
from datetime import datetime
import plotly.express as px

date_value = [(datetime.fromtimestamp(int(dict_['timeStamp'])).strftime('%Y-%m'), dict_['value']) for dict_ in retrieved_data]
df = pd.DataFrame(date_value)
df.head()


