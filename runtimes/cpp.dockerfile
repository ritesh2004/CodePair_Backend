FROM gcc:13
COPY ./code /code
WORKDIR /code
RUN g++ -o main main.cpp
CMD ["./main"]