from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse

app = FastAPI()


@app.get('/', response_class=FileResponse)
def main() -> FileResponse:
    return FileResponse('view/index.html', status_code=200)

@app.get('/static/js/index.js', response_class=FileResponse)
def get_script() -> FileResponse:
    return FileResponse('view/static/js/index.js',status_code=200)