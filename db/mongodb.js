const mongoose = require ('mongoose')

mongoose.connection.on('open', () => console.log('db Connect'))

async function connectdb ({host, port, name}){
    const uri = `mongodb://${host}:${port}/${name}`
    await mongoose.connect(uri, {useNewUrlParser: true})
}

module.exports = connectdb