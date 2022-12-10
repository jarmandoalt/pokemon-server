const mongoose = require ('mongoose')
const { Schema } = mongoose

const schemaNewUser = new Schema ({
    numberUser : Number
},{
    timestamps: true
})

module.exports = mongoose.model('newUser', schemaNewUser)