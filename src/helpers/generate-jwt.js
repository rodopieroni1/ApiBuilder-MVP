const jwt = require("jsonwebtoken");
const {secret_key} = require("../configs")
const generateJWT = (id) => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    jwt.sign(
      payload,
      secret_key,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          reject("No se pudo generar token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports =  generateJWT
