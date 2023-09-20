# About
This is a fullstack app that operates on two separate servers: one for frontend, one for backend.
Keep in mind that you need to get your Polygonscan API key in order to run this app.
Frontend is not pre-build and runs in dev mode.
## Requirements
1. Python (3.11+):
    - FastAPI: (0.103.1+)
    - requests: (2.31.0+)
    - python-dotenv: (1.0.0)
    - numpy: (1.26.0+)
    - pandas: (2.1.0+)
    - plotly: (5.15.0+)
2. Javascript (see package.json):
    - react: 18.2.0+
    - react-dom: 18.2.0+
    - react-scripts: 5.0.1
    - web-vitals: 2.1.4+
3. CSS:
    - tailwindcss: 3.3.3+

## Preparations
- It is highly suggested to create a python venv for this app
- Create a `.env` file inside a `project/project/` folder, then insert your API_KEY like that:
```
API_KEY='<YOUR POLYGONSCAN API KEY>'
```
## Running
1. In one terminal, go to `frontend-server` folder and run React app via `npm run start` command
2. In second terminal, activate your python venv, go to `project/project/` folder and run FastAPI app via `uvicorn main:app --reload` command