const config = {
    dbConfig:{
        port: process.env.MONGO_PORT,
        host: process.env.MONGO_HOSTNAME,
        name: process.env.MONGO_DB
    },
    discord: {
        token: process.env.TOKEN
    }
}

module.exports = config