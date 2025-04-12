const { ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { owner } = require("../../config.json");
const { general, perms } = require("../../DataBaseJson");

module.exports = {
    name: "setdono",
    description: "[🔑] Definir o dono do bot.",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["Administrator"],
    run: async (client, interaction) => {

        const status = perms.get("senha");

        if (status) {
            const modal = new ModalBuilder()
                .setCustomId('recuperar')
                .setTitle('Recuperar dono');

            const textss = new TextInputBuilder()
                .setCustomId('key4')
                .setLabel("Chave de recuperção")
                .setPlaceholder("Insira sua chave de recuperção")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row1 = new ActionRowBuilder().addComponents(textss)

            modal.addComponents(row1);
            await interaction.showModal(modal);

        } else {
            const modal = new ModalBuilder()
                .setCustomId('setdono')
                .setTitle('Definir o dono do bot');

            const contentInput = new TextInputBuilder()
                .setCustomId('novodono')
                .setLabel("Senha")
                .setPlaceholder("Insira sua senha de recuperação")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row1 = new ActionRowBuilder().addComponents(contentInput);
            
            modal.addComponents(row1);
            await interaction.showModal(modal);
        
        }
    }
};
