const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const dbConnect = require("./database")

const reduceRouter = require("./routes")

const {api:{port}} = require("./configs")

// ** App es una instancia de express
const app = express()

// ** Establecemos el puerto en 8080
app.set('port', port)

dbConnect()

// ** App (nuestro servidor), escucha a puerto
app.listen(app.get('port'), () => {
    console.log('Hola desde el servidor ' + app.get('port'))
})


app.use(morgan('dev'))

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))

reduceRouter(app)


// const knex = require('knex')({
//     client: 'mssql',
//     connection: {
//       host: 'localhost',
//       port:1433,
//       user: 'root',
//       password: 'root',
//       database: 'Northwind'
//     }
//   });
//   knex.raw(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`)
//     .then(function (resp) {
//       console.log({
//         status: 200,
//         success: true,
//         msg: 'Datos obtenidas con exito',
//         items: resp
//       })
//     }).catch(error => {
//       console.log({
//         status: 500,
//         success: false,
//         msg: error.message,
//         item: {}
//       })
//     }).then(() => {
//       knex.destroy()
//     })
