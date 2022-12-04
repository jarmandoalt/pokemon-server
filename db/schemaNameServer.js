const mongoose = require ('mongoose')
const { Schema } = mongoose

const schemaNameServer = new Schema ({
    name : String,
    avaible: Boolean
},{
    timestamps: true
})

module.exports = mongoose.model('nameServer', schemaNameServer)