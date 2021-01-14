const mongoose = require('mongoose')

const config = require('config')

const db = config.get('mongoURI')

const connectDB = async () => {
    try{
        console.log('Connecting to MongoDB')
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateindex: true,
            // createIndexes: true,
            useFindAndModify: true,

        });
        console.log('MongoDB Connected')
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

const stuff = {
    "skills": [
        "C",
        "C++",
        "Python",
        "Java",
        "Javascript"
    ],
    "_id": "5f26f5dad96d13b28e31880a",
    "user": {
        "_id": "5f26b6a158a7c9872977c42e",
        "name": "Abdisa Tsegaye",
        "email": "abdisa7@mail.com",
        "avatar": "//www.gravatar.com/avatar/897185dd31895351e9743a08c86264f1?s=200&r=pg&d=mm"
    },
    "status": "Developer",
    "experience": [],
    "education": [],
    "date": "2020-08-02T17:20:26.686Z",
    "__v": 0
}

module.exports = connectDB;