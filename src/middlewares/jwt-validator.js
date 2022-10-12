// const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const {secret_key} = require('../configs')
const User = require("../entities/user/user.model")

const jwtValidator = async (req, res, next) => {
  const token = req.header("authorization");

  if (!token) {
    return res.status(401).json({
      status: 401,
      success: false,
      msg: "No hay token en la petición",
      type: 'auth'
    })
  }

  try {
    const { id } = jwt.verify(token, secret_key);
   
    //leer user
    const user = await User.findById(id);
    //si el user existe
    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        msg:"Token no válido - usuario no existe",
        type: 'auth'
      })
    }

    //verificar si el uid es de un user activo
    if (!user.status) {
      return res.status(401).json({
        status: 401,
        success: false,
        msg:"Token no válido - usuario inactivo",
        type: 'auth'
      })
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(JSON.stringify(error,null,2))
    return res.status(401).json({
      status: 401,
      success: false,
      msg: error.name === 'TokenExpiredError' ? "Sesión expirada" : "Token no válido" ,
      type: 'auth'
    })
  }
};

module.exports = jwtValidator;
