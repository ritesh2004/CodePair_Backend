FROM node:18
COPY ./code /code
WORKDIR /code
CMD ["node", "main.js"]