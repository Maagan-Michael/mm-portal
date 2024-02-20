FROM python:3.12-slim-bookworm

ADD main.py requirements.txt /app/

WORKDIR /app

RUN pip install -r requirements.txt

ENTRYPOINT [ "python", "main.py" ]