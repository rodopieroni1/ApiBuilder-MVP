const { Schema, model } = require('mongoose')

const FilterSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    field:{
        type: String,
        required: [true, 'Field is required']
    },
    operator:{
        type: String,
        required: [true, 'Operator is required']
    },
    api_id:{
        type: String,
        required: [true, 'FilterId is required']
    },
    status:{
        type: Boolean, 
        default: true
    }
})

FilterSchema.methods.toJSON = function () {
    const { _id, __v,...rest } = this.toObject()
    const api = { id: _id,  ...rest   }
    return api
}


module.exports = model('Filter', FilterSchema)