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
    TextInputStyle
} = require("discord.js");
const discordTranscripts = require("discord-html-transcripts")

const { general, tickets, perms } = require("../../DataBaseJson");
const { owner } = require("../../config.json");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: "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" });

module.exports = {
    name: "interactionCreate",
    run: async (interaction, client) => {
        if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

        const { customId, values } = interaction;
        if (interaction.isButton() && customId === 'sairticket') {
            const idCanalTicket = interaction.channel.id;
            const donoTicket = tickets.get(`${idCanalTicket}.dono`);

            if (donoTicket !== interaction.user.id) {
                return interaction.reply({
                    content: "\`❌ Apenas o dono do ticket pode sair do ticket.\`",
                    ephemeral: true
                });
            }

            await interaction.update({ components: [] });

            if (interaction.channel.type === ChannelType.PrivateThread || interaction.channel.type === ChannelType.PublicThread) {
                await interaction.channel.members.remove(interaction.user.id);
                const linhaAcoes = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('fecharticket')
                        .setStyle(4)
                        .setEmoji("1246953338541441036")
                );
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} - Atendimento Abandonado`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`-# \`🚪\` O cliente ${interaction.user}, abandonou seu atendimento.\n\n-# **Observação:** Veja o histórico de mensagens do atendimento logo acima, se caso precisar deletar permanentemente este canal/tópico, clique no botão de lixeira abaixo.`)
                    .setColor("#FF0000")
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                    .setTimestamp()

                await interaction.channel.send({ embeds: [embed], components: [linhaAcoes], content: `${general.get("ticket.definicoes.cargostaff") ? `<@&${general.get("ticket.definicoes.cargostaff")}>` : `${owner}`}` });

            } else {
                await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
                    ViewChannel: false
                });

                const linhaAcoes = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('fecharticket')
                        .setStyle(4)
                        .setEmoji("1246953338541441036")
                );
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} - Atendimento Abandonado`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`-# \`🚪\` O cliente ${interaction.user}, abandonou seu atendimento.\n\n-# **Observação:** Veja o histórico de mensagens do atendimento logo acima, se caso precisar deletar permanentemente este canal/tópico, clique no botão de lixeira abaixo.`)
                    .setColor("#FF0000")
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                    .setTimestamp()

                await interaction.channel.send({ embeds: [embed], components: [linhaAcoes], content: `<@&${general.get("ticket.definicoes.cargostaff") ? `${general.get("ticket.definicoes.cargostaff")}>` : `${owner}`}` });

            }
        }

        if (interaction.isButton() && customId === '4444444444444432544244354352ucy2hsjkqnf2j3525') {
            await interaction.reply({ content: "https://discord.gg/nqp693B22X", ephemeral: true })
        }

        if (interaction.isButton() && customId === "fecharticket") {
            const idCanalTicket = interaction.channel.id;
            const channel = interaction.channel;
            const donoTicket = tickets.get(`${idCanalTicket}.dono`);
            const idCargoStaff = general.get("ticket.definicoes.cargostaff");
            const yyy24 = interaction.guild.members.cache.get(donoTicket);

            if (interaction.user.id === perms.get("owner") || interaction.member.roles.cache.has(idCargoStaff)) {
                const nomeFuncao = tickets.get(`${interaction.channel.id}.nmfunc`) || "Não Definido";

                const transcript = await discordTranscripts.createTranscript(interaction.channel, {
                    limit: -1,
                    returnType: 'buffer',
                    saveImages: true,
                    footerText: `https://discord.gg/nqp693B22X`,
                    poweredBy: false
                });

                const filePath = path.join(__dirname, "..", "..", "transcripts", `downloadTranscript-${idCanalTicket}.html`);
                fs.writeFileSync(filePath, transcript, 'utf8');

                try {
                    const response = await axios.post(`https://zendapplication.squareweb.app/transcripts/v1/${idCanalTicket}`, {
                        content: transcript.toString('utf8')
                    });

                    const transcriptLink = response.data.link;

                    const embed24 = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.username} - Sistema de Atendimento`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setDescription(`-# \`📫\` Logs de **finalizado** do sistema de atendimento.`)
                        .addFields(
                            { name: `\`📁\` Atendimento`, value: `\`${nomeFuncao}\`` },
                            { name: `\`👤\` Cliente`, value: `\`${yyy24.user.username || "Não encontrado."}\`` },
                            { name: `\`👷\` Staff Comandante`, value: `\`${tickets.get(`${idCanalTicket}.assumido`) || "Nenhum."}\`` },
                            { name: `\`🔍\` Ticket Info`, value: `\`(${channel.name}) - [${channel.id}]\`` },
                            { name: `\`❌\` Finalizador`, value: `${interaction.user}` }
                        )
                        .setColor("#FF0000")
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp()

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setURL(transcriptLink || "https://discord.gg/nqp693B22X")
                            .setLabel("Transcript")
                            .setStyle(5)
                            .setEmoji("1302020493779402872"),
                        new ButtonBuilder()
                            .setCustomId(`downloadTranscript-${idCanalTicket}`)
                            .setLabel("Download")
                            .setStyle(3)
                            .setEmoji("1303147982375485521")
                    );

                    const logs = general.get("ticket.definicoes.logsstaff");
                    const canallogs24 = await client.channels.cache.get(logs);
                    if (canallogs24) {
                        canallogs24.send({ embeds: [embed24], components: [row] });
                    };

                    const row4 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setURL(transcriptLink)
                            .setLabel("Transcript")
                            .setStyle(5)
                            .setEmoji("1302020493779402872"),
                    );

                    const embed244 = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.username} - Sistema de Atendimento`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setDescription(`-# \`📫\` Logs de **finalizado** do sistema de atendimento.`)
                        .addFields(
                            { name: `\`📁\` Atendimento`, value: `\`${nomeFuncao}\`` },
                            { name: `\`👤\` Cliente`, value: `\`${yyy24.user.username || "Não encontrado."}\`` },
                            { name: `\`👷\` Staff Comandante`, value: `\`${tickets.get(`${idCanalTicket}.assumido`) || "Nenhum."}\`` },
                            { name: `\`🔍\` Ticket Info`, value: `\`(${channel.name}) - [${channel.id}]\`` },
                            { name: `\`❌\` Finalizador`, value: `${interaction.user}` }
                        )
                        .setColor("#FF0000")
                        .setFooter({ text: `Não hesite em abrir um ticket novamente.`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp()

                    yyy24.send({ embeds: [embed244], components: [row4] });

                    tickets.delete(`${idCanalTicket}`);
                    await interaction.channel.delete();

                } catch (error) {
                    console.log(error)
                    interaction.reply({ content: '`❌ Erro ao gerar o transcript.`', ephemeral: true });
                }

            } else {
                return interaction.reply({
                    content: "\`❌\` Somente membros da equipe (staff) podem fechar esse ticket.",
                    ephemeral: true
                });
            }
        }

        if (interaction.isButton() && interaction.customId.startsWith("downloadTranscript-")) {
            const idCanalTicket = interaction.customId.split("downloadTranscript-")[1];
            const filePath = path.join(__dirname, "..", "..", "transcripts", `downloadTranscript-${idCanalTicket}.html`);

            try {
                if (fs.existsSync(filePath)) {
                    await interaction.user.send({
                        content: `\`📁\` Faça o **download** do transcript logo abaixo.`,
                        embeds: [],
                        files: [{
                            attachment: filePath,
                            name: `transcript-${idCanalTicket}.html`
                        }]
                    });

                    await interaction.reply({ content: `\`✅ Download do transcript realizado com êxito.\``, embeds: [], ephemeral: true });
                } else {
                    await interaction.reply({ content: '`❌ O transcript não foi encontrado.`', ephemeral: true });
                }
            } catch (error) {
                await interaction.reply({ content: '`❌ Erro ao enviar o transcript.`', ephemeral: true });
            }
        }

        if (interaction.isButton() && customId === "painelstaff") {
            const idCanalTicket = interaction.channel.id;
            const donoTicket = tickets.get(`${idCanalTicket}.dono`);
            const idCargoStaff = general.get("ticket.definicoes.cargostaff");

            if (interaction.user.id === perms.get("owner") || interaction.member.roles.cache.has(idCargoStaff)) {

                const functions = general.get("ticket.functions");

                const options = [
                    {
                        label: 'Criar Call',
                        value: 'criar_call',
                        emoji: '1302021790599479356'
                    },
                    {
                        label: 'Gerenciar Call',
                        value: 'gerenciarcall',
                        emoji: '1302020493779402872'
                    }
                ];

                if (functions.poker) {
                    options.push({
                        label: 'Notificar Membro',
                        value: 'painelstaffpoker',
                        emoji: '1302020863339663370'
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
                        .setPlaceholder('👷 Opções')
                        .addOptions(options)
                );

                await interaction.reply({ embeds: [], components: [row], ephemeral: true });
            } else {
                return interaction.reply({
                    content: "`\`❌\` Somente membros da equipe (staff) podem acessar esse painel.`",
                    ephemeral: true
                });
            }
        }

        if (interaction.isStringSelectMenu() && interaction.values[0] === "criar_call") {
            const selectMenu = new ChannelSelectMenuBuilder()
                .setCustomId('selecionarcategoriacriarcall2024')
                .setPlaceholder('Selecione uma categoria')
                .setChannelTypes([4])

            const row = new ActionRowBuilder()
                .addComponents(selectMenu);

            await interaction.reply({
                content: '\`🎫 Selecione a categoria que a call sera criada\`',
                components: [row],
                ephemeral: true
            });
        }

        if (interaction.isStringSelectMenu() && interaction.values[0] === "gerenciarcall") {
            const donoTicket = tickets.get(`${interaction.channel.id}.dono`);
            const yyy = interaction.guild.members.cache.get(donoTicket);

            const existecall = interaction.guild.channels.cache.find(channel =>
                channel.name === `📞 ・ ${yyy.user.username} ・ ${interaction.channel.id}`
            );

            if (existecall) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} - Gerenciamento da Call`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`-# \`📱\` Gerenciando a \`${existecall.name}\`.`)
                    .setColor("#00FFFF")
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${existecall.id}_addusuario`)
                        .setLabel("Adicionar Usuario")
                        .setStyle(3)
                        .setEmoji("1246953350067388487"),
                    new ButtonBuilder()
                        .setCustomId(`${existecall.id}_remusuario`)
                        .setLabel("Retirar Usuario")
                        .setStyle(4)
                        .setEmoji("1246953338541441036"),
                    new ButtonBuilder()
                        .setCustomId(`${existecall.id}_apagar`)
                        .setLabel(`Deletação`)
                        .setStyle(2)
                        .setEmoji("1302020774709952572")
                )

                return interaction.update({ embeds: [embed], components: [row], ephemeral: true });
            } else {
                return interaction.reply({ content: '`❌ Crie uma call para começar a gerencia ela...`', ephemeral: true });
            }
        }

        if (interaction.isStringSelectMenu() && interaction.values[0] === "remover_usuario") {
            const modal = new ModalBuilder()
                .setCustomId('removerUsuarioModal')
                .setTitle('Remover Usuário do Ticket');

            const userIdInput = new TextInputBuilder()
                .setCustomId('userIdInput')
                .setLabel('Insira o ID do usuário a ser removido')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('ID do usuário')
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(userIdInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        }

        if (interaction.isStringSelectMenu() && interaction.values[0] === "adicionar_usuario") {
            const userselectmenu2024 = new UserSelectMenuBuilder()
                .setCustomId('userSelectMenu2443434')
                .setPlaceholder('Selecione até 8 usuários')
                .setMinValues(1)
                .setMaxValues(8)
                .setDisabled(false);

            const row24 = new ActionRowBuilder().addComponents(userselectmenu2024);

            await interaction.reply({
                content: "`👥 Selecione ate 8 usuários para serem adicionados no ticket:`",
                components: [row24],
                ephemeral: true
            });
        }

        if (interaction.isStringSelectMenu() && interaction.values[0] === "renomear_342345ticket432") {
            const modal = new ModalBuilder()
                .setCustomId('renomearTicketModal')
                .setTitle('Renomear Ticket');

            const ticketNameInput = new TextInputBuilder()
                .setCustomId('ticketNameInput')
                .setLabel('Novo nome do ticket')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Digite o novo nome')
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(ticketNameInput);

            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        }


        if (interaction.isStringSelectMenu() && interaction.values[0] === "painelstaffpoker") {
            const channel = interaction.channel;
            const ticketOwnerId = tickets.get(`${channel.id}.dono`);
            const ticketOwner = interaction.guild.members.cache.get(ticketOwnerId);

            await interaction.reply({ content: "`✅ Notificação enviada com êxito.`", ephemeral: true });

            const embed = new EmbedBuilder()
                .setTitle("**Poker**")
                .setDescription(`**👋 | ${ticketOwner}, o membro da equipe \`${interaction.user.username}\`, está aguardando sua presença no ticket.**`)
                .setColor("#00FFFF")
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel.id}`)
                    .setLabel("Ir ao Ticket")
                    .setEmoji("1246953471111069786")
                    .setStyle(5)
            );

            ticketOwner.send({ embeds: [embed], components: [row] })
                .catch(error => {
                    if (error.code === 50007) {
                        interaction.followUp({ content: "`⚠️ O usuário desativou mensagens privadas.`", ephemeral: true });
                    }
                });
        }

        if (interaction.isButton() && customId === "paymentTicketClick") {

            const sistemaMp = await general.get("auto.sistemaMp") || false;
            const mp = await general.get("auto.mp") || null;
        
            const sistemaSemi = await general.get("semi.sistema") || false;
            const chave = await general.get("semi.chave") || null;

            if (!sistemaMp && !sistemaSemi) {
                return interaction.reply({ content: `\`❌\` Nenhuma forma de pagamento está ativa no momento.`, ephemeral: true });
            };

            if (!mp && !chave) {
                return interaction.reply({ content: `\`❌\` Nenhuma forma de pagamento foi configurada ainda.`, ephemeral: true });
            };

            interaction.reply({
                content: `Qual será a forma de pagamento?`,
                embeds: [],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`automaticPay`).setLabel(`Automático`).setEmoji(`1256808767325081683`).setStyle(1).setDisabled(!sistemaMp),
                            new ButtonBuilder().setCustomId(`semiAutoPay`).setLabel(`Semi Auto`).setEmoji(`1302020615192187031`).setStyle(1).setDisabled(!sistemaSemi)
                        )
                ],
                ephemeral: true
            });

        };

        if (interaction.isButton() && customId === "assumirticket") {
            const idCanalTicket = interaction.channel.id;
            const donoTicket = tickets.get(`${idCanalTicket}.dono`);
            const idCargoStaff = general.get("ticket.definicoes.cargostaff");

            const dono244 = interaction.guild.members.cache.get(donoTicket);

            if (interaction.user.id === perms.get("owner") || interaction.member.roles.cache.has(idCargoStaff)) {
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`)
                        .setLabel("Ir ao Ticket")
                        .setEmoji("1258516598172418148")
                        .setStyle(5)
                );

                const embeds = new EmbedBuilder()
                    .setDescription(`👋 | Olá ${dono244}, seu ticket foi assumido pelo staff ${interaction.user}.`)
                    .setColor("#00FFFF");

                const nomefuncao4 = tickets.get(`${interaction.channel.id}.nmfunc`) || "Não encontrado.";

                await dono244.send({ embeds: [embeds], components: [row] });

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} - Atendimento ao cliente`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setTitle(`Atendimento: ${nomefuncao4}`)
                    .setDescription(`-# \`👋\` Olá ${dono244}, a equipe de **atendimento** já está ciente da abertura do seu ticket. Enquanto aguarda um staff, sinta-se à vontade para informar seu problema.`)
                    .addFields(
                        { name: `\`📁\` Atendimento`, value: `\`${nomefuncao4}\``, inline: true },
                        { name: `\`👤\` Cliente`, value: `\`${dono244.user.username}\``, inline: true },
                        { name: `\`👷\` Staff Comandante`, value: `\`${interaction.user.username}\``, inline: true }
                    )
                    .setColor("#00FFFF")
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const linhaAcoes = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('sairticket')
                        .setLabel("Sair do ticket")
                        .setStyle(2)
                        .setEmoji("1302020774709952572"),
                    new ButtonBuilder()
                        .setCustomId('assumirticket')
                        .setLabel("Assumir")
                        .setStyle(1)
                        .setDisabled(tickets.get(`${interaction.channel.id}.assumido`) || true)
                        .setEmoji("1302020615192187031"),
                    new ButtonBuilder()
                        .setCustomId('painelstaff')
                        .setLabel("Painel Staff")
                        .setStyle(1)
                        .setEmoji("1246955036433453259")
                );

                const linhaAcoes2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('paymentTicketClick')
                        .setLabel("Realizar Pagamento")
                        .setStyle(3)
                        .setEmoji("1302019727471804416"),
                    new ButtonBuilder()
                        .setCustomId('fecharticket')
                        .setLabel(`Deletar`)
                        .setStyle(4)
                        .setEmoji("1246953338541441036")
                );

                await interaction.update({ embeds: [embed], components: [linhaAcoes, linhaAcoes2] });
                tickets.set(`${interaction.channel.id}.assumido`, interaction.user.username);
                tickets.set(`${interaction.channel.id}.assumidostatus`, true);

                const embed24 = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} - Sistema de Atendimento`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`-# \`📫\` Logs de **ticket assumido** do sistema de atendimento.`)
                    .addFields(
                        { name: `\`📁\` Atendimento`, value: `\`${nomefuncao4}\`` },
                        { name: `\`👤\` Cliente`, value: `\`${dono244.user.username || "Não encontrado."}\`` },
                        { name: `\`👷\` Staff Comandante`, value: `\`${interaction.user.username}\`` }
                    )
                    .setColor("#00FF00")
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                    .setTimestamp()

                const logs = general.get("ticket.definicoes.logsstaff");
                const canallogs24 = await client.channels.cache.get(logs);
                if (canallogs24) {
                    canallogs24.send({ embeds: [embed24], components: [row] })
                }
            } else {
                return interaction.reply({
                    content: "\`❌ Somente membros da equipe (staff) podem assumir esse ticket.\`",
                    ephemeral: true
                });
            }
            return;
        }

        if (interaction.isButton() && !customId.startsWith("ticket_")) return;
        if (interaction.isStringSelectMenu() && !values[0].startsWith("ticket_")) return;

        const nomeFuncao = interaction.isStringSelectMenu()
            ? values[0].replace("ticket_", "")
            : customId.replace("ticket_", "");

        const usuario = interaction.user;
        const idUsuario = usuario.id;
        const nomeTicket = `🎫・${usuario.username}・${nomeFuncao}`;
        const configuracaoTicket = general.get("ticket");

        if (!configuracaoTicket?.status) {
            return interaction.reply({
                content: "\`❌ O sistema de ticket está desativado no momento.\`",
                ephemeral: true
            });
        }

        const ticketExistente = interaction.guild.channels.cache.find(
            (c) => c.name.startsWith(`🎫・${usuario.username}`)
        );

        if (ticketExistente) {
            const botao = new ButtonBuilder()
                .setLabel("Ir para o Ticket")
                .setStyle(5)
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${ticketExistente.id}`);

            const linhaAcoes = new ActionRowBuilder().addComponents(botao);

            return interaction.reply({
                content: `👋 | Olá ${interaction.user.username}, detectamos que você já tem um ticket aberto em ${ticketExistente}!`,
                components: [linhaAcoes],
                ephemeral: true
            });
        }

        const categoriaTicket = general.get("ticket.definicoes.categoriaticket");
        const cargoStaff = general.get("ticket.definicoes.cargostaff");
        const res = general.get(`func_${nomeFuncao}`) || [];
        const statusAberturaTopico = general.get(`${res.nome}.ticket.statusabertura`) || false;


        if (!categoriaTicket || !cargoStaff) {
            return interaction.reply({
                content: "\`❌ A categoria ou cargo de staff não estão configurados corretamente.\`",
                ephemeral: true
            });
        }

        await criarTicket(interaction, client, usuario, nomeFuncao, categoriaTicket, cargoStaff, statusAberturaTopico);
    }
};

async function criarTicket(interaction, client, usuario, nomeFuncao, categoriaTicket, cargoStaff, statusAberturaTopico) {
    let canal;

    await interaction.update({})

    if (statusAberturaTopico) {
        const canal24 = interaction.channel.id;
        const canalBase = await client.channels.cache.get(canal24);

        if (!canalBase) {
            return interaction.reply({
                content: "\`❌ Ocorreu um erro, contacte o dono.\`",
                ephemeral: true
            });
        }

        canal = await interaction.channel.threads.create({
            name: `🎫・${usuario.username}・${nomeFuncao}`,
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
            reason: `Ticket criado por ${usuario.username}`,
            invitable: false,
        });
    } else {
        const categoria = general.get(`func_${nomeFuncao}.categoria`) || null;
        canal = await interaction.guild.channels.create({
            name: `🎫・${usuario.username}・${nomeFuncao}`,
            type: ChannelType.GuildText,
            parent: categoria ? categoria : categoriaTicket,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: ["ViewChannel"]
                },
                {
                    id: usuario.id,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles"]
                },
                {
                    id: cargoStaff,
                    allow: ["ViewChannel", "SendMessages"]
                }
            ]
        });
    }

    tickets.set(`${canal.id}.nmfunc`, nomeFuncao)


    const logs = general.get("ticket.definicoes.logsstaff");
    const canallogs24 = await client.channels.cache.get(logs);

    const embed24 = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username} - Sistema de Atendimento`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
        .setDescription(`-# \`📫\` Logs de **abertura** do sistema de atendimento.`)
        .addFields(
            { name: `\`📁\` Atendimento`, value: `\`${nomeFuncao}\``, inline: true },
            { name: `\`👤\` Cliente`, value: `\`${interaction.user.username}\``, inline: true }
        )
        .setColor("#00FF00")
        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
        .setTimestamp()

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setURL(`https://discord.com/channels/${interaction.guild.id}/${canal.id}`)
            .setLabel("Ir ao Ticket")
            .setEmoji("1258516598172418148")
            .setStyle(5)
    );

    if (canallogs24) {
        const logmsg2024 = await canallogs24.send({ embeds: [embed24], components: [row] });
        tickets.set(`${canal.id}.idmsglogs`, logmsg2024.id);
    }

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username} - Atendimento ao cliente`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
        .setTitle(`Atendimento: ${nomeFuncao}`)
        .setDescription(`-# \`👋\` Olá ${interaction.user}, a equipe de **atendimento** já está ciente da abertura do seu ticket. Enquanto aguarda um staff, sinta-se à vontade para informar seu problema.`)
        .addFields(
            { name: `\`📁\` Atendimento`, value: `\`${nomeFuncao}\``, inline: true },
            { name: `\`👤\` Cliente`, value: `\`${interaction.user.username}\``, inline: true }
        )
        .setColor("#00FFFF")
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();


    const botaoTicket = new ButtonBuilder()
        .setLabel("Ir para o Ticket")
        .setStyle(5)
        .setURL(`https://discord.com/channels/${interaction.guild.id}/${canal.id}`);

    const linhaAcoes = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('sairticket')
            .setLabel("Sair do ticket")
            .setStyle(2)
            .setEmoji("1302020774709952572"),
        new ButtonBuilder()
            .setCustomId('assumirticket')
            .setLabel("Assumir")
            .setStyle(1)
            .setEmoji("1302020615192187031"),
        new ButtonBuilder()
            .setCustomId('painelstaff')
            .setLabel("Painel Staff")
            .setStyle(1)
            .setEmoji("1246955036433453259")
    );

    const linhaAcoes2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('paymentTicketClick')
            .setLabel("Realizar Pagamento")
            .setStyle(3)
            .setEmoji("1302019727471804416"),
        new ButtonBuilder()
            .setCustomId('fecharticket')
            .setLabel(`Deletar`)
            .setStyle(4)
            .setEmoji("1246953338541441036")
    );

    await canal.send({
        content: `<@&${cargoStaff}> - ${interaction.user}.`,
        embeds: [embed],
        components: [linhaAcoes, linhaAcoes2]
    });

    tickets.set(`${canal.id}.dono`, usuario.id);
    tickets.set(`${canal.id}.assumidostatus`, false);

    const linhaAcoesFinal = new ActionRowBuilder().addComponents(botaoTicket);


    return interaction.followUp({
        content: `\`✅ Seu ticket foi criado com sucesso.\``,
        components: [linhaAcoesFinal],
        ephemeral: true
    });
}
