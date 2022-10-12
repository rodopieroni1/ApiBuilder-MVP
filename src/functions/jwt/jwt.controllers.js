
const validToken = (req, res) => {
   return res.status(200).json({
        status: 200,
        success: true,
        msg: 'Token valido',
    })
}

module.exports = {validToken}