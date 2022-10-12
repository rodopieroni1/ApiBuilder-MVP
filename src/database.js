const mongoose = require('mongoose')
const {api:{uri}} = require("./configs")
const dbConnect = () => {
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(error => console.log('Ocurrio un error', error))

        const connection = mongoose.connection

        connection.once('open', () => console.log('Base de datos conectada', uri))
}

module.exports = dbConnect