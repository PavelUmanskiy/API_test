def compose_interactive_graph_as_html(data: dict) -> str:
    from datetime import datetime
    import numpy as np
    import pandas as pd
    import plotly.express as px
    
    import io
    
    from warnings import filterwarnings

    filterwarnings("ignore")
    
    time_list = []
    value_list = []
    for i in range(len(data)):
        time_list.append((datetime.fromtimestamp(int(data[i]['timeStamp']))\
            .strftime('%Y-%m-%d')))
        value_list.append(int(data[i]['value']))

    temp_dict = {'timeStamp':time_list, 'Transactions':value_list}
    
    data_df = pd.DataFrame(temp_dict)
    data_df.describe(include='object')
    data_df = data_df.astype({'Transactions':np.longdouble})
    data_df['timeStamp'] = pd.to_datetime(data_df['timeStamp'])

    grouped_count = data_df\
        .groupby(['timeStamp'], as_index=False)['Transactions'].count()

    fig = px.bar(
        data_frame=grouped_count[:-1],
        x='timeStamp',
        y='Transactions',
        title='Amount of Transactions per Month',
        color='Transactions',
        template='simple_white',
        hover_name='Transactions'
    )
    fig.update_layout(
        xaxis_title='Month',
        yaxis_title='Amount',
        showlegend=False
    )
    fig.update_traces(hovertemplate='Month: %{x}<br>Amount: %{y}')
    
    buffer = io.StringIO()
    fig.write_html(buffer, full_html=False)
    print(f'data_buffer: {buffer}')
    return buffer.getvalue()


def prepare_statistics(data: dict) -> dict:
    import numpy as np
    
    values_list = [int(dict_['value']) for dict_ in data]
    values_array = np.array(values_list)
    
    prepared_statistics = {
        'avgTransactions': np.average(values_array),
        'sumTransactions': np.sum(values_array),
        'amountTransactions': values_array.size,
    }
    return prepared_statistics
