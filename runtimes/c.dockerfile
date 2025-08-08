FROM gcc:13
COPY ./code /code
WORKDIR /code
RUN gcc -o main main.c
CMD ["./main"]