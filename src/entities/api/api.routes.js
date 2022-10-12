const { Router } = require('express')
const { post, get, getById, patch, remove, simulateApi } = require('./api.controllers')
const jwtValidator = require('../../middlewares/jwt-validator')
const router = Router()
// es para no hacer esto
// Router().metodo()
//  y para que quede asi
// router.metodo()


router.post('/apis',[jwtValidator], post)
router.get('/apis',[jwtValidator], get)

router.get('/:endpoint', simulateApi)

router.get('/apis/:id',[jwtValidator], getById)
router.patch('/apis/:id',[jwtValidator], patch)
router.delete('/apis/:id',[jwtValidator], remove)

module.exports = router