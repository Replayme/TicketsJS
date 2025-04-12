const { 
    EmbedBuilder, 
    ChannelType, 
    ButtonBuilder, 
    ActionRowBuilder, 
    ThreadAutoArchiveDuration,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle,
    ApplicationCommandType
} = require("discord.js");
const { owner } = require("../../config.json");
const { config } = require("../../Functions/painel");
const { tickets, general } = require("../../DataBaseJson/index");
const { perms } = require("../../DataBaseJson")

module.exports = {
    name: "painelstaff",
    description: "[💎] Painel de staff, utilizar em um atendimento aberto.",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        const perm = perms.get("perms") || [];

        if(!perm.includes(interaction.user.id) && interaction.user.id !== perms.get("owner")) {
            return interaction.reply({ content: '`❌ Você não tem permissão para isso`', ephemeral: true });
        }

        const ticketInfo = tickets.get(`${interaction.channel.id}`);
        if (!ticketInfo) {
            return interaction.reply({ content: '`❌ Este canal não é um ticket.`', ephemeral: true });
        }

        try {
            const idCanalTicket = interaction.channel.id;
            const donoTicket = tickets.get(`${idCanalTicket}.dono`);
            const idCargoStaff = general.get("ticket.definicoes.cargostaff");
        
            if (owner && (owner === interaction.user.id || interaction.member.roles.cache.has(idCargoStaff))) {
        
                const functions = general.get("ticket.functions");
        
                const options = [
                    {
                        label: 'Criar Call',
                        value: 'criar_call',
                        emoji: '1218966570458550343'
                    },
                    {
                        label: 'Gerenciar Call',
                        value: 'gerenciarcall',
                        emoji: '1246954849719816284'
                    }
                ];

                if (functions.poker) {
                    options.push({
                        label: 'Notificar Membro',
                        value: 'painelstaffpoker',
                        emoji: '1218964993601699970'
                    });
                }

                if (functions.renomear) {
                    options.push({
                        label: 'Renomear Ticket',
                        value: 'renomear_342345ticket432',
                        emoji: '1246953149009367173'
                    });
                }

                if (functions.adicionar_usuario) {
                    options.push({
                        label: 'Adicionar Usuário',
                        value: 'adicionar_usuario',
                        emoji: '1246953350067388487'
                    });
                }
        
        
                if (functions.remover_usuario) {
                    options.push({
                        label: 'Remover Usuário',
                        value: 'remover_usuario',
                        emoji: '1218967523349889057'
                    });
                }
        
        
        
                const row = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('painelstaff2024')
                        .setPlaceholder('Selecione uma opção')
                        .addOptions(options)
                );
        
                await interaction.reply({ embeds: [], components: [row], ephemeral: true });
            }
        } catch (error) {
            return interaction.reply({ content: '`❌ Ocorreu um erro ao exibir o painel staff.`', ephemeral: true });
        }
    }
};
