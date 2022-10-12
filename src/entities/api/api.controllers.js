const Api = require('./api.model')
const Filter = require('./../filters/filter.model')
const { filterHandler } = require('../../services/filters.service')
const {makeQuery} = require('../../services/datasource.service')
const post = async (req, res) => {
  console.log(req.body)
  try {

    const newApi = new Api(req.body)

    await newApi.save()

    res.status(201).json({
      status: 201,
      success: true,
      msg: 'La api se guardó correctamente',
      item: newApi
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      success: false,
      msg: error.message,
      item: {}
    })
  }
}

const patch = async (req, res) => {
  console.log(req.body)
  try {

    await Api.findByIdAndUpdate(req.params.id, req.body)

    const api = await Api.findById(req.params.id)

    res.status(201).json({
      status: 201,
      success: true,
      msg: 'La api se guardó correctamente',
      item: api
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      success: false,
      msg: error.message,
      item: {}
    })
  }
}
const remove = async (req, res) => {
  console.log(req.body)
  try {
    const api = await Api.findById(req.params.id)

    await Api.findByIdAndDelete(req.params.id)

    res.status(201).json({
      status: 201,
      success: true,
      msg: 'La api se elimino correctamente',
      item: api
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      success: false,
      msg: error.message,
      item: {}
    })
  }
}

const get = async (req, res) => {
  try {
    const apis = await Api.find()
    res.status(200).json({
      status: 200,
      success: true,
      msg: 'Apis obtenidas con exito',
      items: apis
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      success: false,
      msg: error.message,
      items: []
    })
  }
}

const getById = async (req, res) => {
  try {
    const api = await Api.findById(req.params.id)
    res.status(200).json({
      status: 200,
      success: true,
      msg: 'Api obtenida con exito',
      item: api
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      success: false,
      msg: error.message,
      item: {}
    })
  }
}
const simulateApi = async (req,res) =>{
  try {
    const {endpoint} = req.params
    const { limit} = req.query
    const filterNames = Object.keys(req.query)

    const api = await Api.findOne({endpoint}, 'query name database status limit id')
    .populate('datasource', '-_id -__v')
    if (!api.datasource.status) {
      throw new Error('El origen de datos esta desactivado')
    }
    if (!api) {
      return res.status(404).json({
        status: 404,
        success: false,
        msg: `${endpoint} does not exist`,
        items: []
      })
    }
    const filters = (filterNames.length ? await Filter.find({api_id: api.id, name: { $in: filterNames }, status: true}, 'name field operator api_id') : []).map(e => ({...e._doc, data: req.query[e.name]}))
    const sqlFilter = filterHandler(filters)
    if (api.status) {
      const query = `${api.query}${sqlFilter}`
      const {datasource:{_doc}, database} = api
      makeQuery({..._doc, database, query, limit: limit || api.limit}).then(data => {
        res.status(200).json(data)
      }).catch(error => {
        res.status(500).json(error)
      })
   } else {
      res.status(400).json({
          status: 400,
          success: false,
          msg: `${api.name} api not running`,
          items: []
      })
   }
  }catch (error) {
      res.status(500).json({
          status: 500,
          success: false,
          msg: error.message,
          items: []
      })
  }
}



module.exports = {
  post,
  get,
  getById,
  patch,
  remove,
  simulateApi
}