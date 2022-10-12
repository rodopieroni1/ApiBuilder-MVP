const { Router } = require('express')
const jwtValidator = require('../../middlewares/jwt-validator')
const { post, get, getById, patch, remove, login } = require('./user.controllers')
const router = Router()
const path = 'users'

router.post(`/login`, login)
router.post(`/${path}`, post)
router.get(`/${path}`, get)
router.get(`/${path}/:id`, getById)
router.patch(`/${path}/:id`,[jwtValidator], patch)
router.delete(`/${path}/:id`,[jwtValidator], remove)

module.exports = router