const DataSource = require('./datasource.model')
const Api = require('../api/api.model')
const ncrypt = require("ncrypt-js");
const { secret_key } = require('../../configs')
const { encrypt } = new ncrypt(secret_key);
const { makeQuery, drivers, clients } = require('../../services/datasource.service')

const post = async (req, res) => {
  console.log(req.body)
  try {
    const { password, client } = req.body
    req.body.password = encrypt(password)
    const driver = drivers[clients[client]] || ''
    const newDataSource = new DataSource({ ...req.body, driver })

    await newDataSource.save()

    res.status(201).json({
      status: 201,
      success: true,
      msg: 'El datasource se guardó correctamente',
      item: newDataSource
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
    const { password, client } = req.body
    if(password) req.body.password = encrypt(password)
    const driver = drivers[clients[client]] || ''
    await DataSource.findByIdAndUpdate(req.params.id, { ...req.body, driver })

    const api = await DataSource.findById(req.params.id)

    res.status(201).json({
      status: 201,
      success: true,
      msg: 'El datasource se guardó correctamente',
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
    const api = await Api.find({ datasource: req.params.id })
    if (api.length) {
      console.log(api)
      res.status(400).json({
        status: 500,
        success: false,
        msg: 'El origen de datos esta en uso',
        items: []
      })
      return
    }
    const item = await DataSource.findById(req.params.id)

    await DataSource.findByIdAndDelete(req.params.id)

    res.status(201).json({
      status: 201,
      success: true,
      msg: 'El datasource se elimino correctamente',
      item
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
    const result = await DataSource.find()
    res.json({
      status: 200,
      success: true,
      msg: 'Datasources obtenidos con exito',
      items: result
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
const getClients = async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      success: true,
      msg: 'Clientes obtenidos con exito',
      item: {
        drivers,
        clients: {
          object: clients,
          array: Object.keys(clients)
        }
      }

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
    const api = await DataSource.findById(req.params.id)
    res.status(200).json({
      status: 200,
      success: true,
      msg: 'Filtro obtenido con exito',
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
const testConnection = async (req, res) => {
  try {
    const query = 'SHOW DATABASES'
    makeQuery({ ...req.body, query }, true).then(data => {
      res.status(200).json(data)
    }).catch(error => {
      res.status(500).json(error)
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      msg: error.message,
      item: {}
    })
  }
}
const sendQuery = async (req, res) => {
  try {
    const { datasource_id, query, database, limit } = req.body
    const { _doc: datasource } = await DataSource.findById(datasource_id)
    if (!datasource.status) {
      throw new Error('El origen de datos esta desactivado')
    }
    makeQuery({ ...datasource, query, database, limit }).then(data => {
      res.status(200).json(data)
    }).catch(error => {
      console.log(error)
      res.status(500).json(error)
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
const getDataBases = async (req, res) => {
  try {
    const { datasource_id } = req.body
    const { _doc: datasource } = datasource_id ? await DataSource.findById(datasource_id) : {_doc: req.body }
    console.log(datasource)
    if (!datasource.status && datasource_id) {
      throw new Error('El origen de datos esta desactivado')
    }
    let query 
    switch (clients[datasource.client]) {
      case 'mysql2':
      case 'athena':
        query= 'SHOW DATABASES'
        break
      case 'mssql':
        query= 'SELECT name, database_id FROM sys.databases'
        break;
    }
    console.log(query)
    makeQuery({ ...datasource, query }, !datasource_id).then(data => {
      res.status(200).json(data)
    }).catch(error => {
      console.log(error)
      res.status(500).json(error)
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
const getTables = async (req, res) => {
  try {
    const { datasource_id, database } = req.body
    const { _doc: datasource } = await DataSource.findById(datasource_id)
    if (!datasource.status) {
      throw new Error('El origen de datos esta desactivado')
    }
    let query 
    switch (clients[datasource.client]) {
      case 'mysql2':
      case 'athena':
        query= 'SHOW TABLES'
        break
      case 'mssql':
        query= 'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES'
        break;
    }
    makeQuery({ ...datasource, query, database }).then(data => {
      res.status(200).json(data)
    }).catch(error => {
      console.log(error)
      res.status(500).json(error)
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
const getColumns = async (req, res) => {
  try {
    const { datasource_id, database, table } = req.body
    const { _doc: datasource } = await DataSource.findById(datasource_id)
    if (!datasource.status) {
      throw new Error('El origen de datos esta desactivado')
    }
    let query 
    switch (clients[datasource.client]) {
      case 'mysql2':
      case 'athena':
        query= `SELECT * FROM ${table} LIMIT 1`
        break
      case 'mssql':
        query= `SELECT TOP 1 * FROM ${table}`
        break;
    }
    makeQuery({ ...datasource, query, database }).then(data => {
      res.status(200).json(data)
    }).catch(error => {
      console.log(error)
      res.status(500).json(error)
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

module.exports = {
  post,
  get,
  getById,
  patch,
  remove,
  getClients,
  sendQuery,
  testConnection,
  clients,
  getDataBases,
  getTables,
  getColumns
}