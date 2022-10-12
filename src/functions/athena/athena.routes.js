const { Router } = require('express')
const { sendQuery, getDataBases, getTables} = require('./athena.controllers')
const jwtValidator = require('../../middlewares/jwt-validator')
const router = Router()

router.post('/athena/query',[jwtValidator], sendQuery)
router.get('/athena/databases',[jwtValidator], getDataBases)
router.get('/athena/tables/:db',[jwtValidator], getTables)

module.exports = router