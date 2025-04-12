const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { owner } = require("../../config.json")
const { perms } = require("../../DataBaseJson")


module.exports = {
    name:"reset", 
    description:"[💻] Realizar um reset nas configurações do sistema.", 
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => { 

        const perm = perms.get("perms") || [];

        if(!perm.includes(interaction.user.id) && interaction.user.id !== perms.get("owner")) {
            return interaction.reply({ content: '\`❌ Você não tem permissão para isso\`', ephemeral: true })
        }

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username} - Resetar Config Operacional`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
        .setDescription(`-# \`💻\` Confirmação para **resetar as configs operacionais**.\n\n-# **Observação:** Você está prestes a resetar todo banco de dados e armazenamento do seu sistema atual, clique em **Confirmar** abaixo caso deseje prosseguir e **Cancelar** para descontinuar a confirmação.`)
        .setColor("#00FFFF")
        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
        .setTimestamp()

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("resetarconfigs")
            .setLabel("Confirmar")
            .setEmoji("1303149098135982212")
            .setStyle(3),
            new ButtonBuilder()
            .setCustomId("cancelarresetconfigs")
            .setLabel("Cancelar")
            .setEmoji("1303149111742038128")
            .setStyle(4),
        )

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })

    }
}