const express = require ('express')
const cors = require ('cors')
const routeServer = require ('./routes/routeServers')
const app = express()

app.use(cors())
app.use(express.urlencoded())
app.use(express.json())


app.use('/v1', routeServer)

module.exports = app