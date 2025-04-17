const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Adiciona um cargo a um usuário.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('O usuário para quem adicionar o cargo.')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('cargo')
                .setDescription('O cargo que será adicionado.')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const role = interaction.options.getRole('cargo');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'Usuário não encontrado no servidor.', ephemeral: true });
        }

        try {
            await member.roles.add(role);
            await interaction.reply(`O cargo **${role.name}** foi adicionado ao usuário **${user.tag}** com sucesso!`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Ocorreu um erro ao tentar adicionar o cargo.', ephemeral: true });
        }
    },
};
