const defaultRoute = '/api/v1'
const userRoutes = require("./entities/user/user.routes")
const apiRoutes = require('./entities/api/api.routes')
const athenaRoutes= require("./functions/athena/athena.routes")
const filterRoutes = require("./entities/filters/filter.routes")
const jwtRoutes = require("./functions/jwt/jwt.routes")
const datasourceRoutes = require("./entities/datasource/datasource.routes")
const reduceRouter = (app) => {
    app.use(defaultRoute, datasourceRoutes)
    app.use(defaultRoute, userRoutes)
    app.use(defaultRoute, athenaRoutes)
    app.use(defaultRoute, filterRoutes)
    app.use(defaultRoute, jwtRoutes)
    // api routes siempre tiene que estar al final
    app.use(defaultRoute, apiRoutes)
    
}

module.exports = reduceRouter