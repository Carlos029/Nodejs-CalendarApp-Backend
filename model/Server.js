const cors = require('cors')
const { dbConnection } = require('../database/config');
const express = require('express');  

const app = express();


class Server {

    constructor() {

        this.app = app;

        this.connectDB();
        this.middlewares();
        this.routes();

    }


    async connectDB() {
        await dbConnection();
    }

    routes() {
        this.app.use('/api/auth', require('../routes/auth'));
        this.app.use('/api/events', require('../routes/events'));
    }

    middlewares() {

        this.app.use(cors());
        this.app.use(express.static('public'));
        this.app.use(express.json())

    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
        });
    }



}


module.exports = Server