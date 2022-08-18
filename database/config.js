const mongoose = require("mongoose");

const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN);

        // await mongoose.connect(process.env.MONGODB_CNN, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useCreateIndex: true,
        //     useFindAndModify: false
        // });

        console.log('BD OnLine');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de niciar la base de datos');
    }

}

module.exports = {
  dbConnection,
};
