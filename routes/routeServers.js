const express = require ('express')
const { addServer, getServer, getServerName, getServerUpdateCountMembers, numberGamesUpdate, deleteServer, config, getNewUserApi} = require ('../controllers/controllServers')
const api = express.Router()


api.get('/config', config)
api.get('/newUser', getNewUserApi)
api.get('/server', getServer)
api.get('/serverName', getServerName)
api.post('/server', addServer)
api.put('/serverUpdate', getServerUpdateCountMembers)
api.put('/serverUpdateNumberGames', numberGamesUpdate)
api.delete('/serverDelete', deleteServer)

module.exports = api

