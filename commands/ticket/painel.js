const { ApplicationCommandType } = require("discord.js");
const { owner } = require("../../config.json")
const { config } = require("../../Functions/painel")
const { perms } = require("../../DataBaseJson")


module.exports = {
    name:"botconfig", 
    description:"[👷] Comece a configurar o seu sistema de atendimento!", 
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => { 

        const perm = perms.get("perms") || [];

        if(!perm.includes(interaction.user.id) && interaction.user.id !== perms.get("owner")) {
            return interaction.reply({ content: '\`❌ Você não tem permissão para isso\`', ephemeral: true })
        }

        config(interaction, client)

    }
}