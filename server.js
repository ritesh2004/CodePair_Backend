var httpServer = require('./app');
var connectDB = require('./DB/database');

connectDB();

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is working on port ${process.env.PORT}`);
});

module.exports = httpServer;