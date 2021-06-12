const mongoose = require('mongoose')

// MONGO_URI='mongodb+srv://trading:Reeta@2000@cluster0.d5u7i.mongodb.net/trading?retryWrites=true&w=majority'

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useCreateIndex: true,  
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connected!'))