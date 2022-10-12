const User = require('./user.model')
const bcryptjs = require('bcryptjs')
const generateJWT = require('../../helpers/generate-jwt')
const {api:{default_page_count}} = require("../../configs")
const name = 'Usuario'
const pronoun = 'o'

const post = async (req, res) => {
  try {
    const {password} = req.body
    const user = new User(req.body)

    const salt = bcryptjs.genSaltSync()
    user.password = bcryptjs.hashSync(password, salt)
    await user.save()
  
    res.status(201).json({
      status: 201,
      success: true,
      msg: `${name} cread${pronoun} correctamente`,
      result: user
    })

  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      msg: error.message,
      result: {}
    })
  }
}
const patch = async (req, res) => {
  try {
    const {password} = req.body
    if(password) {
      const salt = bcryptjs.genSaltSync()
      req.body.password = bcryptjs.hashSync(password, salt)
    }
    await User.findByIdAndUpdate(req.params.id, req.body)

    const user = await User.findById(req.params.id)

    res.status(201).json({
      status: 201,
      success: true,
      msg:  `${name} editad${pronoun} correctamente`,
      result: user
    })

  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      msg: error.message,
      result: {}
    })
  }
}
const remove = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user)  res.status(404).json({
      status: 404,
      success: false,
      msg: `${name} no encontrad${pronoun}`,
      result: {}
    })
    await User.findByIdAndDelete(req.params.id)

    res.status(201).json({
      status: 201,
      success: true,
      msg:  `${name} eliminad${pronoun} correctamente`,
      result: user
    })

  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      msg: error.message,
      result: {}
    })
  }
}

const get = async (req, res) => {
  console.log('get')
  const {page_count = default_page_count, page_number= 0} = req.query
  try {
    const users = await User.find().limit(Number(page_count)).skip(Number(page_number))
    res.status(200).json({
      status: 200,
      success: true,
      msg: `${name}s obtenid${pronoun}s con exito`,
      result: users
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      msg: error.message,
      result: []
    })
  }
}

const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json({
      status: 200,
      success: true,
      msg: `${name} obtenid${pronoun} con exito`,
      result: user
    })

  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      msg: error.message,
      result: {}
    })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        msg: "Usuario o contraseña incorrectos",
        result: {}
      })
    }

    if (!user.status) {
      return res.status(400).json({
        msg: "El usuario se encuentra desactivado",
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        status: 400,
        success: false,
        msg: "Usuario o contraseña incorrectos",
        result: {}
      })
    }

    const token = await generateJWT(user.id);
    res.status(200).json({
      status: 200,
      success: true,
      msg: `Inicio de sesión exitoso`,
      result: {
        user,
        token
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      msg: "Ocurrió un error inesperado. Intentalo mas tarde",
      result: {}
    })
  }
};


module.exports = {
  post,
  get,
  getById,
  patch,
  remove,
  login
}