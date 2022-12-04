const mongoose = require ('mongoose')

mongoose.connection.on('open', () => console.log('db Connect'))

async function connectdb ({host, port, name, atlas}){
    const uri = atlas
    await mongoose.connect(uri, {useNewUrlParser: true})
}

module.exports = connectdb