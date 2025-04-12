const {
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ChannelSelectMenuBuilder,
    AttachmentBuilder
} = require("discord.js");

const { general } = require("../../DataBaseJson");
const { painelticket, painelticketfunc } = require("../../Functions/restante");

module.exports = {
    name: "interactionCreate",
    run: async (interaction, client) => {
        const { customId } = interaction;
        if (!customId) return;

        let id = interaction.customId.split("_")[0];

        if (customId.endsWith("_trocaraberturaticket2024")) {
            const status = general.get(`${id}.ticket.statusabertura`) || false
            const resultado = !status
            general.set(`${id}.ticket.statusabertura`, resultado)
            painelticketfunc(id, interaction, client)
        }


        if (customId.endsWith("_add_funcao")) {
            const modal = new ModalBuilder()
                .setCustomId(`${id}_modaladd_funcao`)
                .setTitle('Adicionar função');

            const nomeFuncao = new TextInputBuilder()
                .setCustomId('nome_funcao')
                .setLabel('Nome da Função')
                .setPlaceholder('Insira aqui um nome, como: Suporte')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const preDescricao = new TextInputBuilder()
                .setCustomId('pre_descricao')
                .setLabel('Pré Descrição')
                .setPlaceholder('Insira aqui uma pré descrição, ex: "Preciso de suporte."')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);


            const Categoria = new TextInputBuilder()
                .setCustomId("categoria")
                .setLabel('Categoria (Opcional)')
                .setPlaceholder('Insira o id de uma categoria')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);


            const emojiFuncao = new TextInputBuilder()
                .setCustomId('emoji_funcao')
                .setLabel('Emoji da Função (Opcional)')
                .setPlaceholder('Insira um nome ou ID de um emoji do servidor.')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const modalRow1 = new ActionRowBuilder().addComponents(nomeFuncao);
            const modalRow2 = new ActionRowBuilder().addComponents(preDescricao);
            const modalRow5 = new ActionRowBuilder().addComponents(emojiFuncao);
            const modalRow6 = new ActionRowBuilder().addComponents(Categoria);

            modal.addComponents(modalRow1, modalRow2, modalRow6, modalRow5);

            return await interaction.showModal(modal);
        }

        if (customId.endsWith('_modaladd_funcao')) {
            const nome = interaction.fields.getTextInputValue('nome_funcao');
            const preDescricao = interaction.fields.getTextInputValue('pre_descricao');
            let emoji = interaction.fields.getTextInputValue('emoji_funcao') || null;
            const categoria = interaction.fields.getTextInputValue('categoria') || null;

            if (categoria) {
                const categoriars = interaction.guild.channels.cache.get(categoria);
                if (!categoriars) {
                    return interaction.reply({ content: "\`❌ A categoria inserida não existe.\`", ephemeral: true });
                }
            }

            const emojiRegex = /^<a?:\w+:\d+>$|^\p{Emoji}$/u;
            const emojiValido = emoji ? emojiRegex.test(emoji) : true;

            if (!emojiValido) {
                return interaction.reply({
                    content: "\`❌ O emoji inserido não é válido. Use um emoji padrão ou o ID de um emoji válido.\`",
                    ephemeral: true
                });
            }

            const funcao = {
                nome,
                preDescricao,
                emoji,
                categoria,
                status: true
            };

            let funcoes = general.get(`${id}.ticket.funcoes`) || [];
            if (funcoes.length >= 25) {
                return interaction.reply({
                    content: "\`❌ Você atingiu o limite de 25 Categorias.\`",
                    ephemeral: true
                });
            }

            funcoes.push(funcao);
            general.set(`${id}.ticket.funcoes`, funcoes);

            const funcData = { nome: id };
            if (categoria) {
                funcData.categoria = categoria;
            }
            general.set(`func_${nome}`, funcData);

            return await painelticketfunc(id, interaction, client);
        }

        if (customId.endsWith("_remover_funcao")) {
            const funcoes = general.get(`${id}.ticket.funcoes`) || [];

            if (funcoes.length === 0) {
                return interaction.update({
                    content: "\`❌ Nenhuma função configurada para remover.\`",
                    ephemeral: true
                });
            }

            const options = funcoes.map(funcao => ({
                label: funcao.nome,
                description: funcao.preDescricao,
                value: funcao.nome,
                ...(funcao.emoji ? { emoji: funcao.emoji } : {})
            }));

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`${id}_select_removerfuncao`)
                .setPlaceholder("Selecione uma função para remover")
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.update({
                content: "Qual categoria deseja deletar?",
                components: [row],
                embeds: [],
                ephemeral: true
            });
        }

        if (customId.endsWith("_select_removerfuncao")) {
            const nomeFuncao = interaction.values[0];
            let funcoes = general.get(`${id}.ticket.funcoes`) || [];

            funcoes = funcoes.filter(funcao => funcao.nome !== nomeFuncao);
            general.set(`${id}.ticket.funcoes`, funcoes);
            general.delete(`func_${nomeFuncao}`);

            await painelticketfunc(id, interaction, client);
        }

        if (customId.endsWith("_editar_funcao")) {
            const funcoes = general.get(`${id}.ticket.funcoes`) || [];

            if (funcoes.length === 0) {
                return interaction.reply({
                    content: "\`❌ Nenhuma função configurada para editar.\`",
                    ephemeral: true
                });
            }

            const options = funcoes.map(funcao => ({
                label: funcao.nome,
                description: funcao.preDescricao,
                value: funcao.nome,
                ...(funcao.emoji ? { emoji: funcao.emoji } : {})
            }));

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`${id}_select_editarfuncao`)
                .setPlaceholder("Clique aqui para ver as categorias")
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.reply({
                content: "Qual função deseja editar?",
                components: [row],
                embeds: [],
                ephemeral: true
            });
        }

        if (customId.endsWith("_select_editarfuncao")) {
            const nomeFuncao = interaction.values[0];
            const funcoes = general.get(`${id}.ticket.funcoes`) || [];
            const funcaoSelecionada = funcoes.find(funcao => funcao.nome === nomeFuncao);

            if (!funcaoSelecionada) {
                return interaction.update({
                    content: "\`❌ Função não encontrada.\`",
                    ephemeral: true
                });
            }

            const modal = new ModalBuilder()
                .setCustomId(`${id}_modal_editarfuncao`)
                .setTitle(`Editar função: ${nomeFuncao}`);

            const nomeFuncaoField = new TextInputBuilder()
                .setCustomId('nome_funcao')
                .setLabel('Nome da Função')
                .setValue(funcaoSelecionada.nome || "")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const preDescricaoField = new TextInputBuilder()
                .setCustomId('pre_descricao')
                .setLabel('Pré Descrição')
                .setValue(funcaoSelecionada.preDescricao || "")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const categoriaField = new TextInputBuilder()
                .setCustomId('categoria')
                .setLabel('Categoria (Opcional)')
                .setValue(funcaoSelecionada.categoria || "")
                .setStyle(TextInputStyle.Short)
                .setRequired(false);


            const emojiFuncaoField = new TextInputBuilder()
                .setCustomId('emoji_funcao')
                .setLabel('Emoji da Função (Opcional)')
                .setValue(funcaoSelecionada.emoji || "")
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const modalRow1 = new ActionRowBuilder().addComponents(nomeFuncaoField);
            const modalRow2 = new ActionRowBuilder().addComponents(preDescricaoField);
            const modalRow5 = new ActionRowBuilder().addComponents(emojiFuncaoField);
            const modalRow6 = new ActionRowBuilder().addComponents(categoriaField);

            modal.addComponents(modalRow1, modalRow2, modalRow6, modalRow5);

            await interaction.showModal(modal);
        }

        if (customId.endsWith('_modal_editarfuncao')) {
            const nome = interaction.fields.getTextInputValue('nome_funcao');
            const preDescricao = interaction.fields.getTextInputValue('pre_descricao');
            const emoji = interaction.fields.getTextInputValue('emoji_funcao') || null;
            let categoria = interaction.fields.getTextInputValue('categoria') || null;
        
            if (categoria) {
                const categoriars = interaction.guild.channels.cache.get(categoria);
                if (!categoriars) {
                    return interaction.reply({ content: "\`❌ A categoria inserida não existe.\`", ephemeral: true });
                }
            }
        
            const emojiRegex = /^<a?:\w+:\d+>$|^\p{Emoji}$/u;
            const emojiValido = emoji ? emojiRegex.test(emoji) : true;
        
            if (!emojiValido) {
                return interaction.update({
                    content: "\`❌ O emoji inserido não é válido. Use um emoji padrão ou o ID de um emoji válido.\`",
                    ephemeral: true
                });
            }
        
            let funcoes = general.get(`${id}.ticket.funcoes`) || [];
            funcoes = funcoes.map(funcao => 
                funcao.nome === nome ? { nome, preDescricao, emoji, categoria, status: funcao.status } : funcao
            );
            general.set(`${id}.ticket.funcoes`, funcoes);
        
            let funcData = general.get(`func_${nome}`) || {};
            funcData.nome = id;
        
            if (categoria) {
                funcData.categoria = categoria;
            } else if (funcData.categoria) {
                delete funcData.categoria;
            }
        
            general.set(`func_${nome}`, funcData);
        
            await interaction.update({ content: `\`✅ Mudança feita com sucesso!\``, ephemeral: true });
        }
        

        if (customId.endsWith("_postar")) {
            const selectMenu = new ChannelSelectMenuBuilder()
                .setCustomId(`${id}_select_channelpostar`)
                .setPlaceholder("Selecione o canal para postar")
                .addChannelTypes(0);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.reply({
                content: "Onde deseja setar o painel de ticket?",
                components: [row],
                ephemeral: true
            });
        }

        if (customId.endsWith("_select_channelpostar")) {
            const channelId = interaction.values[0];
            const channel = client.channels.cache.get(channelId);
            const funcoes = general.get(`${id}.ticket.funcoes`) || [];
            const configBotao = general.get(`ticket.botao`) || { emoji: "1246953296321577020", style: 1 };
            const tipoEnviarMsg = general.get(`${id}.ticket.tipoenviarmsgtckt`) || false;

            if (!channel) {
                return interaction.reply({
                    content: "\`❌ Canal inválido.\`",
                    ephemeral: true
                });
            }

            let message;

            if (tipoEnviarMsg) {
                const options = funcoes.map(funcao => ({
                    label: funcao.nome,
                    description: funcao.preDescricao,
                    value: `ticket_${funcao.nome}`,
                    emoji: funcao.emoji || configBotao.emoji
                }));

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId("ticket_select")
                    .setPlaceholder("Selecione as opções abaixo")
                    .addOptions(options);

                const row = new ActionRowBuilder().addComponents(selectMenu);

                const banner = general.get(`ticket.aparencia.banner`) || null
                const banners = new AttachmentBuilder(general.get(`ticket.aparencia.banner`)) || null
                const tipoMensagem = general.get(`ticket.tipomsg`) || false;

                if (tipoMensagem) {
                    let content = general.get(`ticket.aparencia.content`) || "👌 | Olá, utilize o botão abaixo para abrir um ticket";
                    if (banner) {
                        await interaction.update({
                            content: `\`✅\` Ticket postado com sucesso no canal <#${channelId}>!`,
                            components: [],
                            ephemeral: true
                        });
                        message = await channel.send({ content: content, embeds: [], components: Array.isArray(row) ? row : [row], files: [banners] })
                        return;
                    }
                    message = await channel.send({ content: content, embeds: [], components: Array.isArray(row) ? row : [row] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle(general.get(`ticket.aparencia.titulo`) || "Sistema de Tickets")
                        .setDescription(general.get(`ticket.aparencia.descricao`) || "Selecione uma função abaixo para abrir um ticket.")
                        .setColor(general.get(`ticket.aparencia.cor`) || "#000000")
                        .setImage(general.get(`ticket.aparencia.banner`) || null)
                        .setThumbnail(general.get(`ticket.aparencia.miniatura`) || null)
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();


                    message = await channel.send({ embeds: [embed], components: [row], files: [] });
                }

            } else {
                const buttons = funcoes.slice(0, 25).map(funcao => {
                    return new ButtonBuilder()
                        .setCustomId(`ticket_${funcao.nome}`)
                        .setLabel(funcao.nome)
                        .setEmoji(funcao.emoji || configBotao.emoji)
                        .setStyle(configBotao.style || 1);
                });

                const rows = [];
                for (let i = 0; i < buttons.length; i += 5) {
                    const row = new ActionRowBuilder().addComponents(buttons.slice(i, i + 5));
                    rows.push(row);
                }

                const tipoMensagem = general.get(`ticket.tipomsg`) || false;
                const banner = general.get(`ticket.aparencia.banner`) || null
                const banners = new AttachmentBuilder(general.get(`ticket.aparencia.banner`)) || null


                if (tipoMensagem) {
                    let content = general.get(`ticket.aparencia.content`) || "👌 | Olá, utilize o botão abaixo para abrir um ticket";
                    if (banner) {
                        await interaction.update({
                            content: `\`✅\` Ticket postado com sucesso no canal <#${channelId}>!`,
                            components: [],
                            ephemeral: true
                        });
                        message = await channel.send({ content: content, embeds: [], components: Array.isArray(rows) ? rows : [rows], files: [banners] })
                        return;
                    }
                    message = await channel.send({ content: content, embeds: [], components: Array.isArray(rows) ? rows : [rows] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle(general.get(`ticket.aparencia.titulo`) || "Sistema de Tickets")
                        .setDescription(general.get(`ticket.aparencia.descricao`) || "Selecione uma função abaixo para abrir um ticket.")
                        .setColor(general.get(`ticket.aparencia.cor`) || "#000000")
                        .setImage(general.get(`ticket.aparencia.banner`) || null)
                        .setThumbnail(general.get(`ticket.aparencia.miniatura`) || null)
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();


                    message = await channel.send({ embeds: [embed], components: rows, files: [] });
                }
            }

            general.set(`${id}.ticket.mensagemId`, message.id);
            general.set(`${id}.ticket.channelId`, channelId);

            await interaction.update({
                content: `\`✅\` Ticket postado com sucesso no canal <#${channelId}>!`,
                components: [],
                ephemeral: true
            });
        }

        if (customId.endsWith("trocarselect")) {
            const atualstatus = general.get(`${id}.ticket.tipoenviarmsgtckt`) || false;
            const resultado = !atualstatus
            general.set(`${id}.ticket.tipoenviarmsgtckt`, resultado)
            painelticketfunc(id, interaction, client)

        }


        if (customId.endsWith("sincronizar")) {
            const channelId = general.get(`${id}.ticket.channelId`);
            const mensagemId = general.get(`${id}.ticket.mensagemId`);
            const channel = client.channels.cache.get(channelId);

            if (!channel) {
                return interaction.reply({
                    content: "\`❌ O canal salvo não existe mais. Por favor, poste novamente.\`",
                    ephemeral: true
                });
            }

            const message = await channel.messages.fetch(mensagemId).catch(() => null);

            if (!message) {
                return interaction.reply({
                    content: "\`❌ A mensagem original não foi encontrada. Por favor, poste novamente.\`",
                    ephemeral: true
                });
            }

            const funcoes = general.get(`${id}.ticket.funcoes`) || [];
            const configBotao = general.get(`ticket.botao`) || { emoji: "1246953296321577020", style: 1 };
            const tipoEnviarMsg = general.get(`${id}.ticket.tipoenviarmsgtckt`) || false;

            let row;

            if (tipoEnviarMsg) {
                const options = funcoes.map(funcao => ({
                    label: funcao.nome,
                    description: funcao.preDescricao,
                    value: `ticket_${funcao.nome}`,
                    emoji: funcao.emoji || configBotao.emoji
                }));

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId("ticket_select")
                    .setPlaceholder("Clique aqui para ver as opções de atendimento")
                    .addOptions(options);

                row = new ActionRowBuilder().addComponents(selectMenu);

            } else {
                const buttons = funcoes.slice(0, 25).map(funcao => {
                    return new ButtonBuilder()
                        .setCustomId(`ticket_${funcao.nome}`)
                        .setLabel(funcao.nome)
                        .setEmoji(funcao.emoji || configBotao.emoji)
                        .setStyle(configBotao.style || 1);
                });

                const rows = [];
                for (let i = 0; i < buttons.length; i += 5) {
                    const row = new ActionRowBuilder().addComponents(buttons.slice(i, i + 5));
                    rows.push(row);
                }
                row = rows;
            }

            const tipoMensagem = general.get(`ticket.tipomsg`) || false;
            const banner = general.get(`ticket.aparencia.banner`) || null
            const banners = new AttachmentBuilder(general.get(`ticket.aparencia.banner`)) || null

            if (tipoMensagem) {
                let content = general.get(`ticket.aparencia.content`) || "👌 | Olá, utilize o botão abaixo para abrir um ticket";
                if (banner) {
                    await message.edit({ content: content, embeds: [], components: Array.isArray(row) ? row : [row], files: [banners] });
                } else {
                    await message.edit({ content: content, embeds: [], components: Array.isArray(row) ? row : [row], files: [] });
                }
            } else {
                const embed = new EmbedBuilder()
                    .setTitle(general.get(`ticket.aparencia.titulo`) || "Sistema de Tickets")
                    .setDescription(general.get(`ticket.aparencia.descricao`) || "Selecione uma função abaixo para abrir um ticket.")
                    .setColor(general.get(`ticket.aparencia.cor`) || "#000000")
                    .setImage(general.get(`ticket.aparencia.banner`) || null)
                    .setThumbnail(general.get(`ticket.aparencia.miniatura`) || null)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                    .setTimestamp();

                await message.edit({ embeds: [embed], content: "", components: Array.isArray(row) ? row : [row], files: [] });
            }

            await interaction.reply({
                content: "\`✅ Mensagens sincronizadas com sucesso!\`",
                ephemeral: true
            });
        }

        async function verFuncoes(id, interaction, client) {
            const funcoesConfiguradas = general.get(`${id}.ticket.funcoes`) || [];

            if (funcoesConfiguradas.length === 0) {
                return interaction.reply({
                    content: "\`❌ Nenhuma função configurada.\`",
                    ephemeral: true
                });
            }

            const function244 = funcoesConfiguradas.map((funcao, index) => `**${index + 1}.** \`${funcao.emoji ? `${funcao.emoji} - ` : ""}${funcao.nome}\``).join('\n')


            await interaction.reply({
                content: `# 📋 Categorias Existentes\n\n${function244}`,
                ephemeral: true
            });
        }


        if (customId.endsWith("ver_funcoes")) {

            verFuncoes(id, interaction, client)

        }


    }
};
