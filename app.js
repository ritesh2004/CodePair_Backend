var express = require("express");
var router = require("./routes/texts");
var cors = require('cors');
var dotenv = require('dotenv');

const app = express();
app.use(express.json());

dotenv.config({path:'./.env'});
const corsOptions = {
   origin: 'http://localhost:5173',
   methods: ['GET', 'POST'],
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true,
 };

// app.options('*',cors(corsOptions));
app.use(cors(corsOptions));

app.get('/',(req,res)=>{
   return res.send('Working');
})

app.use('/api/v1',router);

module.exports = app;