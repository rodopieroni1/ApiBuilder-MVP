const { Router } = require('express')
const { validToken } = require('./jwt.controllers')
const jwtValidator = require('../../middlewares/jwt-validator')
const router = Router()

router.get('/jwt/validate',[jwtValidator], validToken)

module.exports = router