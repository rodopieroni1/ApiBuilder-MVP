const { Router } = require('express')
const { postMany, get, getById, patch, removeMany, getAllByApiId, getMethods } = require('./filter.controllers')
const jwtValidator = require('../../middlewares/jwt-validator')
const router = Router()

router.post('/filters',[jwtValidator], postMany)
router.get('/filters',[jwtValidator], get)
router.get('/filters/methods',[jwtValidator], getMethods)
router.get('/apis/filters/:id',[jwtValidator], getAllByApiId)
router.get('/filters/:id',[jwtValidator], getById)
router.patch('/filters/:id',[jwtValidator], patch)
router.delete('/filters',[jwtValidator], removeMany)

module.exports = router