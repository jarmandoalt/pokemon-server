const config = {
    dbConfig:{
        port: process.env.MONGO_PORT,
        host: process.env.MONGO_HOSTNAME,
        name: process.env.MONGO_DB
    }
}

module.exports = config