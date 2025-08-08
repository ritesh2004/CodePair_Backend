FROM openjdk:17
COPY ./code /code
WORKDIR /code
RUN javac *.java
CMD ["java", "main"]