const { Router } = require('express')
const {  post, get, getById, patch, remove, getClients, sendQuery, testConnection, getDataBases, getTables, getColumns } = require('./datasource.controllers')
const jwtValidator = require('../../middlewares/jwt-validator')
const router = Router()

router.get('/datasources/clients',[jwtValidator], getClients)
router.get('/datasources',[jwtValidator], get)
router.get('/datasources/:id',[jwtValidator], getById)
router.patch('/datasources/:id',[jwtValidator], patch)
router.delete('/datasources/:id',[jwtValidator], remove)
router.post('/datasources',[jwtValidator], post)
router.post('/datasources/databases',[jwtValidator], getDataBases)
router.post('/datasources/tables',[jwtValidator], getTables)
router.post('/datasources/columns',[jwtValidator], getColumns)
router.post('/datasources/query',[jwtValidator], sendQuery)
router.post('/datasources/test-connection',[jwtValidator], testConnection)

module.exports = router