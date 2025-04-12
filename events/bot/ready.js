const { ActivityType, EmbedBuilder, Events, WebhookClient} = require("discord.js");
const axios = require("axios");
const config = require("../../config.json")

module.exports = {
    name: "ready",
    run: async (client) => {
        console.clear();
        console.log("\n");
        console.log('\x1b[37m%s\x1b[0m', "                                                                                                                           ");
        console.log('\x1b[37m%s\x1b[0m', "                                                                                                                         ");
        console.log('\x1b[37m%s\x1b[0m', "                          ██████╗ █████╗ ██╗ ██████╗ ██╗  ██╗                                   ");
        console.log('\x1b[37m%s\x1b[0m', "                         ██╔════╝██╔══██╗██║██╔═══██╗╚██╗██╔╝                                   ");
        console.log('\x1b[37m%s\x1b[0m', "                         ██║     ███████║██║██║   ██║ ╚███╔╝                                    ");
        console.log('\x1b[37m%s\x1b[0m', "                         ██║     ██╔══██║██║██║   ██║ ██╔██╗                                    ");
        console.log('\x1b[37m%s\x1b[0m', "                         ╚██████╗██║  ██║██║╚██████╔╝██╔╝ ██╗                                   ");
        console.log('\x1b[37m%s\x1b[0m', "                          ╚═════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝                                   ");
        console.log('\x1b[37m%s\x1b[0m', "                                                                             ");
        console.log('\x1b[37m%s\x1b[0m', "                                                                                                                      ");
        console.log('\x1b[37m%s\x1b[0m', "                                                                                          ");
        console.log('\x1b[37m%s\x1b[0m', "                                                                                        ");
        console.log('\x1b[37m%s\x1b[0m', '                              > Desenvolvido por @Caiox (reidelas24444) <');
        console.log('\x1b[37m%s\x1b[0m', `                               > Iniciado Em ${client.user.username} <`);
        console.log('\x1b[37m%s\x1b[0m', `                                > Estou em ${client.guilds.cache.size} Servidores <`);
        console.log('\x1b[37m%s\x1b[0m', `                                 > discord.gg/nqp693B22X <`);
        console.log('\x1b[37m%s\x1b[0m', `                                  > Versão 1.0.0 <`);

        const { token } = require("../../config.json");


		const mudardesc = () => {
        const description = `**- <a:purple_rocket:1276860639628890125> | Ticket System\n- <a:Sky_earth:1259056794999984249> | Tecnologia Replay Apps\n- <:ZK_link:1250526430643880127> | Replay apps: convite aqui**`;
         axios.patch(`https://discord.com/api/v10/applications/${client.user.id}`, {
            description: description
        }, {
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": 'application/json',
            }
        });
    }

    const customActivities = [
        { name: "🎫 Gerenciando Tickets", type: ActivityType.Playing },
        { name: "👀 Atendendo Tickets", type: ActivityType.Watching },
        { name: "⭐ Replay Apps", type: ActivityType.Watching },
        { name: "🔗 convite aqui", type: ActivityType.Playing },
        { name: "🤖 Atendimento Automático", type: ActivityType.Listening },
    ];
  
    const updateActivity = () => {
        const randomActivity = customActivities[Math.floor(Math.random() * customActivities.length)];
        client.user.setPresence({
            activities: [randomActivity],
            status: "online",
        });
    };
  
    updateActivity();
    setInterval(updateActivity, 5000);

    mudardesc();
    setInterval(mudardesc, 90000);
    }
}
