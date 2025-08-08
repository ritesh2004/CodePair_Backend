var httpServer = require('./app');
var connectDB = require('./DB/database');

connectDB();

httpServer.listen(4000, () => {
    console.log("Server is working");
});

module.exports = httpServer;