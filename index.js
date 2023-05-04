const mongoose = require('mongoose');
const express = require('express');

const cors = require('./middlewares/cors');
const usersController = require('./controllers/users');
const auth = require('./middlewares/auth');


async function start() {
    try {
        const db = await mongoose.connect('mongodb+srv://gocataabvbg:krastavi4akos@cluster0.g5ftcpw.mongodb.net/?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        console.log('DB Ready');
    } catch (err) {
        console.log('Error connecting to database');
        return process.exit(1);
    }

    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use(auth());
    app.use('/users', usersController);

    app.listen(3030, () => console.log('REST Service started on port 3030'));
}


start();