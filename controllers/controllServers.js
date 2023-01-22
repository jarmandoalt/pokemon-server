const moment = require('node-moment');
const Server = require("../db/schemaServer");
const nameServer = require("../db/schemaNameServer")
const newUser = require("../db/schemaNewUser")
let serversArk = require("../accessArkeanos")

async function addServer(req, res) {
  const { name, generations, creatorId, countMembers, namesMembers, numberGames} = req.query,
    avaible = false 
  try {

    const server = Server({
      name,
      generations,
      creatorId,
      countMembers,
      namesMembers,
      numberGames
    });

    const servers = await server.save();
    res.status(201).send({ servers });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
  nameServerUpdate(name, avaible)
}

async function getServer(req, res) {
  const findServers = await Server.find().lean().exec();
  res.status(200).send({ findServers });
}

async function getServerName(req, res) {
  let name = req.query.name
  const server = await Server.find({ name: `${name}` })
  res.status(200).send({ server });
}

async function serverName(name) {
  const server = await Server.find({ name: `${name}` })
  if (server.length === 0) {
    return 0
  } else {
    return server
  }
}

async function getServerUpdateCountMembers(req, res) {
  let id = req.query.id,
    members = req.query.members,
    nameMember = req.query.nameMember
  const server = await Server.findByIdAndUpdate( id, {countMembers: members, namesMembers: nameMember })
  res.status(200).send({ server });
}

async function deleteServer(req, res) {
  const name = req.query.name,
    avaible = true
    try {
      const result = await Server.deleteMany({ name: name });
      if (result) {
        res.json({
          estado: true,
          message: "eliminado",
        });
      } else {
        res.json({
          estado: false,
          message: "Fallo eliminar",
        });
      }
    } catch (error) {
      console.log(error)
    } 
  nameServerUpdate(name, avaible)
}

async function deleteServerInto(names) {
  const avaible = true
    try {
      const result = await Server.deleteMany({ name: names });
      
    } catch (error) {
      console.log(error)
    } 
  nameServerUpdate(names, avaible)
}

async function deleteAllDocuments(res) {
    try {
      const result = await Server.deleteMany();
      
    } catch (error) {
      console.log(error);
    } 
}

async function addNameServer(res) {
  try {
    for (let index = 0; index < serversArk.length; index++) {
      const nameserver = nameServer({
        name : serversArk[index],
        avaible : true
      });
  
      const nameservers = await nameserver.save();
      
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}

async function nameServerUpdate(nameServers, avaibleServer) {
  try {
    const name = await nameServer.findOneAndUpdate({name: nameServers},{
        name: nameServers,
        avaible: avaibleServer})
  } catch (error) {
  console.log(error);
  }
}

async function numberGamesUpdate(req, res) {
  let nameServer = req.query.name,
    numberGames = req.query.number
    console.log(req.query);
  try {
    const name = await Server.findOneAndUpdate({name: nameServer},{
        name: nameServer,
        numberGames: numberGames})
  } catch (error) {
  console.log(error);
  }
}

async function config(req, res) {
  res.status(200).send("hola")
}

async function findServer () {
  try {
    const nameFindServer = await nameServer.findOne({avaible: true})
    let avaible = false 

    if (nameFindServer === null) {
      return "full"
    } else {
      nameServerUpdate(nameFindServer.name, avaible)
      setTimeout(async () => {
        const auxServerName = await serverName(nameFindServer.name)
        avaible = true
        if (auxServerName === 0) {
          nameServerUpdate(nameFindServer.name, avaible)
        }
      }, 300000);
      return nameFindServer.name
    }

  } catch (e) {
    console.log(e);
  }
}

 
async function deleteServerOffline () {
  try {
    const nameFindServer = await nameServer.find({avaible: false})
    if (nameFindServer === null) {
      return "full"
    } else {
      //bucle para buscar en el array de servidores en uso
      for (let index = 0; index < nameFindServer.length; index++) { 
        const nameServerUse = nameFindServer[index].name;
        //obteniendo informacion de cada uno de los servidores en uso
        const dataServers = await serverName(nameServerUse)
        
          let auxUpdateHr = Number(moment(dataServers[index].updatedAt, moment.ISO_8601).format("HH")),
          auxUpdateMin = Number(moment(dataServers[index].updatedAt, moment.ISO_8601).format("mm")),
          auxActualHr = Number(moment().format("HH")),
          auxActualMin = Number(moment().format("mm"))
          console.log(`update: ${auxUpdateHr}:${auxUpdateMin} ` );

          if (auxActualHr !== auxUpdateHr) {
            let auxMinActual = 59 - auxUpdateMin,
              auxSumMin = auxMinActual + auxActualMin
            if (auxSumMin < 50) {
              console.log(`borrado el server ${dataServers[index].name} por falta de uso`);
              await deleteServerInto(dataServers[index].name)
            }
          } else {
            let auxRes = auxActualMin - auxUpdateMin 
            console.log("difUpdate: ",auxRes);
            if (auxRes > 50) {
              console.log(`borrado el server ${dataServers[index].name} por falta de uso`);
              await deleteServerInto(dataServers[index].name)
            }
          }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function addNewUser(res) {
  console.log("dentro");
  try {
      
    const newuser = newUser({
        numberUser : 1
      });
  
    const newusers = await newuser.save();
      
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}

async function getNewUser(req, res) {
  const findNewUser = await newUser.find().lean().exec();
  return findNewUser[0].numberUser
}

async function getNewUserApi(req, res) {
  const findNewUser = await newUser.find().lean().exec();
  res.status(200).send({ findNewUser });
}

async function updateNewUser(number, res) {
  const server = await newUser.findByIdAndUpdate( "63944046b32fe74b626de5de", {numberUser: number })
}

module.exports = {
  addServer,
  getServer,
  getServerName,
  getServerUpdateCountMembers,
  deleteServer,
  numberGamesUpdate,
  deleteAllDocuments,
  nameServerUpdate,
  addNameServer,
  findServer,
  config,
  addNewUser,
  getNewUser,
  updateNewUser,
  getNewUserApi,
  deleteServerOffline
};
