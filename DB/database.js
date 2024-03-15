var mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI,({
        dbName : 'textDB'
    })).then((resp) => {
        console.log(`Database connected at port ${resp.connection.host}`);
    })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDB;