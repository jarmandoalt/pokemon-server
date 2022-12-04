require("dotenv").config();
const app = require("./app");
const connectdb = require("./db/mongodb");
const { dbConfig, discord } = require("./config");
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ],
});
let serversArk = require("./accessArkeanos")
const SocketIo = require("socket.io");
const { deleteAllDocuments, addNameServer, findServer } = require("./controllers/controllServers");

client.on("ready", () => {
  console.log("Logged In as", client.user.tag);
  console.log("Bot status: ", client.user.presence.status);
});

client.login(discord.token);

client.on("messageCreate" , async message => {
  if(message.author.bot || !message.guild || message.channel.type === 'dm') return
  const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setDescription('Hola! puedo mandarte una key por mensaje para jugar el multijugador de ¿Quien es ese Pokemon?,  solo presiona el siguiente boton.')
	.setTimestamp()
	.setFooter({ text: 'Ignora el mensaje "interaccion fallida"'});
	if (message.content === '--button') {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Obtener key')
					.setStyle(ButtonStyle.Primary),
			);
      const link = new ActionRowBuilder()
			.addComponents(
        new ButtonBuilder()
        .setURL("http://google.com")
					.setLabel('Ir a la pagina')
					.setStyle(ButtonStyle.Link)
			);
		await message.channel.send({  components: [row, link], embeds: [exampleEmbed]});
	}
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;
  let dataFind = await  findServer()
  if (dataFind === "full") {
    const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Hola!')
	.setDescription(`Lo sentimos pero por el momento no hay keys disponibles`)
	.setTimestamp()

  const link = new ActionRowBuilder()
			.addComponents(
        new ButtonBuilder()
        .setURL("http://google.com")
					.setLabel('Ir a la pagina')
					.setStyle(ButtonStyle.Link)
			);

    interaction.user.send({ components: [link], embeds: [exampleEmbed]})
      
    } else {
      const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Hola!')
	.setDescription(`Esta es tu key: ${dataFind}`)
	.setTimestamp()
	.setFooter({ text: 'La key solo sera valida por 5min asi que corre a usarla'});

  const link = new ActionRowBuilder()
			.addComponents(
        new ButtonBuilder()
        .setURL("http://google.com")
					.setLabel('Ir a la pagina')
					.setStyle(ButtonStyle.Link)
			);

      interaction.user.send({components: [link], embeds: [exampleEmbed]})
    }
});

connectdb(dbConfig);
const server = app.listen(5052, () => {
  console.log(`server on port ${5052}`);
  //addNameServer() 
});

const io = SocketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {

  socket.on("create", (create) => {
    socket.join(create.nameServer);
    socket.emit("create", { create: create, id: socket.id });
  });

  socket.on("join", (join) => {
    socket.to(join.nameServer).emit("join", { join: join, id: socket.id });
  });

  socket.on("updateData", (updateData) => {
    socket.broadcast.emit("updateData", updateData);
  });

  socket.on("startGame", (startGame) => {
    socket.broadcast.emit("startGame", startGame);
  });

  socket.on("correct", (correct) => {
    socket.broadcast.emit("correct", correct);
  });

  socket.on("deleteMember", (deleteMember) => {
    socket.broadcast.emit("deleteMember", deleteMember);
  });

  socket.on("deleteAdmin", (deleteAdmin) => {
    socket.broadcast.emit("deleteAdmin", deleteAdmin);
  });

  socket.on("returnGame", (returnGame) => {
    socket.broadcast.emit("returnGame", returnGame);
  });

  socket.on("dataGameMember", (dataGameMember) => {
    socket.broadcast.emit("dataGameMember", dataGameMember);
  });

  socket.on("exitMember", (exitMember) => {
    socket.broadcast.to(exitMember.nameServer).emit("exitMember", exitMember);
    socket.leave(exitMember.nameServer);
  });
});

