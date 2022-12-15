require("dotenv").config();
const app = require("./app");
const connectdb = require("./db/mongodb");
const { dbConfig, discord } = require("./config");
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});
let serversArk = require("./accessArkeanos");
const SocketIo = require("socket.io");
const {
  deleteAllDocuments,
  addNameServer,
  findServer,
  addNewUser,
  getNewUser,
  updateNewUser,
  deleteServerOffline,
} = require("./controllers/controllServers");

client.on("ready", () => {
  console.log("Logged In as", client.user.tag);
  console.log("Bot status: ", client.user.presence.status);
});

client.login(discord.token);

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || message.channel.type === "dm")
    return;
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setDescription(
      "Hola! puedo mandarte una key por mensaje para jugar el multijugador de ¿Quien es ese Pokemon?,  solo presiona el siguiente boton."
    )
    .setTimestamp()
    .setFooter({ text: 'Ignora el mensaje "interaccion fallida"' });
  if (message.content === "--button") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("primary")
        .setLabel("Obtener key")
        .setStyle(ButtonStyle.Primary)
    );
    const link = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://who-is-this-pokemon.onrender.com/home")
        .setLabel("Ir a la pagina")
        .setStyle(ButtonStyle.Link)
    );
    await message.channel.send({
      components: [row, link],
      embeds: [exampleEmbed],
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  let dataFind = await findServer();
  if (dataFind === "full") {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Hola!")
      .setDescription(`Lo sentimos pero por el momento no hay keys disponibles`)
      .setTimestamp();

    const link = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://who-is-this-pokemon.onrender.com/home")
        .setLabel("Ir a la pagina")
        .setStyle(ButtonStyle.Link)
    );

    interaction.user.send({ components: [link], embeds: [exampleEmbed] });
  } else {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Hola!")
      .setDescription(`Esta es tu key: ${dataFind}`)
      .setTimestamp()
      .setFooter({
        text: "La key solo sera valida por 5min asi que corre a usarla",
      });

    const link = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://who-is-this-pokemon.onrender.com/home")
        .setLabel("Ir a la pagina")
        .setStyle(ButtonStyle.Link)
    );

    interaction.user.send({ components: [link], embeds: [exampleEmbed] });
  }
});

connectdb(dbConfig);
const server = app.listen(5052, () => {
  console.log(`server on port ${5052}`);
  //addNameServer()
  //addNewUser()
  setInterval(() => {
    deleteServerOffline();
  }, 7200000);
});

const io = SocketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  let resGetNewUser = await getNewUser();
  updateNewUser(resGetNewUser + 1);

  socket.on("create", (create) => {
    socket.join(create.nameServer);
    io.to(create.nameServer).emit("create", { create: create, id: socket.id });
  });

  socket.on("join", (join) => {
    socket.join(join.nameServer);
    io.to(join.nameServer).emit("join", { join: join, id: socket.id });
  });

  socket.on("updateData", (updateData) => {
    io.to(updateData.nameServer).emit("updateData", updateData);
  });

  socket.on("startGame", (startGame) => {
    io.emit("startGame", startGame);
  });

  socket.on("correct", (correct) => {
    io.emit("correct", correct);
  });

  socket.on("deleteMember", (deleteMember) => {
    io.emit("deleteMember", deleteMember);
  });

  socket.on("deleteAllMember", (deleteAllMember) => {
    io.to(deleteAllMember.nameServer).emit("deleteAllMember", deleteAllMember);
  });

  socket.on("returnGame", (returnGame) => {
    io.emit("returnGame", returnGame);
  });

  socket.on("dataGameMember", (dataGameMember) => {
    io.emit("dataGameMember", dataGameMember);
  });

  socket.on("deleteAdmin", (deleteAdmin) => {
    socket.leave(deleteAdmin.nameServer);
  });

  socket.on("leaveRoomMember", (deleteAllMember) => {
    socket.leave(deleteAllMember.nameServer);
  });

  socket.on("exitMember", (exitMember) => {
    //socket.leave(exitMember.nameServer);
    io.to(exitMember.nameServer).emit("exitMember", exitMember);
  });
});
