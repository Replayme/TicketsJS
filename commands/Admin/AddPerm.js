const { ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { general, perms } = require("../../DataBaseJson");
const { addperms } = require("../../Functions/painel");

module.exports = {
    name: "addperms",
    description: "[🔑] Adicionar permissões a um usuário.",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        if (interaction.user.id !== perms.get("owner")) {
            return interaction.reply({ content: "`🔴` **Você não tem permissão para usar este comando!**", ephemeral: true });
        }

        addperms(interaction, client);
    }
};

