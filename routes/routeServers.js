const express = require ('express')
const { addServer, getServer, getServerName, getServerUpdateCountMembers, deleteServer } = require ('../controllers/controllServers')
const api = express.Router()

api.post('/server', addServer)
api.get('/server', getServer)
api.get('/serverName', getServerName)
api.put('/serverUpdate', getServerUpdateCountMembers)
api.delete('/serverDelete', deleteServer)

module.exports = api

