var app = require("./app");
var connectDB = require('./DB/database');

connectDB();

app.listen(4000,()=>{
    console.log("Server is working")
})

module.exports = app;