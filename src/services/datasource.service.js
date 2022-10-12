
const ncrypt = require("ncrypt-js");
const { secret_key } = require('../configs')
const { decrypt } = new ncrypt(secret_key)
const clients = {
  'Amazon Athena': 'athena',
  'MySql': 'mysql2',
  'MSSQL': 'mssql',
  'MariaDB': 'mysql2',
  // 'PostgreSQL': 'pg',
  // 'CockroachDB': 'pg',
  // 'Amazon Redshift': 'pg'
}
const drivers = {
  'mysql2': 'knex',
  'mssql': 'knex',
  // 'pg': 'knex',
  'athena': 'athena'
}
const connections = {
  knex: ({ user, password, host, client, port, query, database }, skipDecrypt) => {
    return new Promise((resolve, reject) => {
      const knex = require('knex')({
        client: clients[client],
        connection: {
          host,
          port: Number(port),
          user,
          password: skipDecrypt ? password : decrypt(password),
          database
        }
      });
      knex.raw(query)
        .then(function (resp) {
          resolve({
            status: 200,
            success: true,
            msg: 'Datos obtenidas con exito',
            items: client === 'MySql' ? resp[0] : resp
          })
        }).catch(error => {
          reject({
            status: 500,
            success: false,
            msg: error.message,
            item: {}
          })
        }).then(() => {
          knex.destroy()
        })
    })
  },
  athena: ({ user, password, region, host, database = 'default', query }, skipDecrypt) => {
    return new Promise((resolve, reject) => {
      const athena = require('./athena.service')({
        user,
        password: skipDecrypt ? password : decrypt(password),
        region,
        host,
        database
      })
      athena.raw(query)
        .then(function (resp) {
          resolve({
            status: 200,
            success: true,
            msg: 'Datos obtenidas con exito',
            items: resp
          })
        }).catch(error => {
          console.log('error', error)
          reject({
            status: 500,
            success: false,
            msg: error.message,
            item: {}
          })
        })
    })
  }
}
const makeQuery = ({ driver, client, limit, ...rest }, skipDecrypt) => {
  const splitedQuery = rest.query.split(' ')
  if (limit){
    switch (clients[client]) {
      case 'mysql2':
      case 'athena':
        splitedQuery[splitedQuery.length - 1] += ` LIMIT ${limit}`
        break
      case 'mssql':
        splitedQuery[0] += ` TOP ${limit}`
        break;
    }
  }
  rest.query = splitedQuery.join(' ')
  console.log(rest.query)
  return connections[driver || drivers[clients[client]]]({ driver, client, ...rest }, skipDecrypt)
}


module.exports = { makeQuery, drivers, clients }