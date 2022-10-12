const { Schema, model } = require('mongoose')

const ApiSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        unique:true
    },
    datasource:{
        type: Schema.Types.ObjectId,
        ref: 'DataSource',
        required: [true, 'Datasource is required']
    },
    endpoint:{
        type: String,
        required:[true, "Endpoint is required"],
        unique: true
    },
    query:{
        type: String,
        required: [true, 'Query is required']
    },
    database:{
        type: String,
        required: [true, 'Database is required']
    },
    limit: {
        type: Number,
        default: 10
    },
    table:{
        type: String,
        required: [true, 'Table is required']
    },
    author:{
        type: String,
        required: [true, 'Author is required']
    },
    advanced_query:{
        type: Boolean,
        default: false
    },
    status:{
        type: Boolean,
        default: true
    }
})

ApiSchema.methods.toJSON = function () {
    console.log(this.toObject())
    const { _id, __v, ...rest } = this.toObject()
    const api = { id: _id,  ...rest  }
    return api
}


module.exports = model('Api', ApiSchema)