const Server = require("../db/schemaServer");
const nameServer = require("../db/schemaNameServer")
let serversArk = require("../accessArkeanos")

async function addServer(req, res) {
  const { name, generations, creatorId, countMembers, namesMembers} = req.query,
    avaible = false 
  try {

    const server = Server({
      name,
      generations,
      creatorId,
      countMembers,
      namesMembers
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
    console.log("log",server.length);
    return 0
  }
}

async function getServerUpdateCountMembers(req, res) {
  console.log(req.query);
  let id = req.query.id,
    members = req.query.members,
    nameMember = req.query.nameMember
    console.log(id,members);
  const server = await Server.findByIdAndUpdate( id, {countMembers: members, namesMembers: nameMember })
  res.status(200).send({ server });
}

async function deleteServer(req, res) {
  const name = req.query.name,
    avaible = true
  console.log(name);
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
      console.log(error);
    } 
  nameServerUpdate(name, avaible)
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
  console.log(nameServers, avaibleServer);
  try {
    const name = await nameServer.findOneAndUpdate({name: nameServers},{
        name: nameServers,
        avaible: avaibleServer})
  } catch (error) {
  console.log(error);
  }
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
        console.log("este", auxServerName);
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

module.exports = {
  addServer,
  getServer,
  getServerName,
  getServerUpdateCountMembers,
  deleteServer,
  deleteAllDocuments,
  nameServerUpdate,
  addNameServer,
  findServer
};
