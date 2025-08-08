FROM python:3.10
COPY ./code /code
WORKDIR /code
CMD ["python", "main.py"]