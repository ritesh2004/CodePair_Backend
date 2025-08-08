FROM openjdk:17
COPY ./code /code
WORKDIR /code
RUN javac Main.java
CMD ["java", "Main"]