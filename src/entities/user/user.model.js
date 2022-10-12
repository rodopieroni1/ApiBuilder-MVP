const { Schema, model } = require('mongoose')

const schema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum:['USER_ROLE', 'ADMIN_ROLE'],
        default: 'USER_ROLE'
    },
    status:{
        type: Boolean, 
        default: true
    }
})

schema.methods.toJSON = function () {
    const { __v, _id, password, ...rest } = this.toObject()
    rest.id = _id
    return rest
}


module.exports = model('User', schema)