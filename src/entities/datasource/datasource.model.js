const { Schema, model } = require('mongoose')

const DataSourceSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        unique:true
    },
    client:{
        type: String,
        enum: ['MySql','MariaDB','PostgreSQL','CockroachDB','Amazon Redshift', 'Amazon Athena','MSSQL'],
        required: [true, 'Client is required']
    },
    driver:{
        type: String,
        enum: ['athena','knex']
    },
    user:{
        type: String,
        required: [true, 'User is required']
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    host:{
        type: String,
        required: [true, 'Host is required']
    },
    region:{
        type: String,
    },
    port:{
        type: Number,
    },
    status:{
        type: Boolean, 
        default: true
    }
})

DataSourceSchema.methods.toJSON = function () {
    const { _id, __v, ...rest } = this.toObject()
    const datasource = { id: _id, ...rest }
    return datasource
}


module.exports = model('DataSource', DataSourceSchema)