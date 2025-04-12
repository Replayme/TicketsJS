const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { general, perms } = require("../DataBaseJson");

async function config(interaction, client) {

  const status = general.get("ticket.status") || false

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.username} - Gerenciamento Inicial`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`🔧\` Gerencie seu **SoluTicket** aqui.`)
    .setColor("#00FFFF")
    .addFields(
      { name: `Atendimento`, value: `${status ? '\`🟢 Online\`' : '\`🔴 Offline\`'}`, inline: true },
      { name: `Ping`, value: `\`${client.ws.ping} ms\``, inline: true },
      { name: `Uptime`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: `${interaction.guild.name} - Todos direitos reservados`, iconURL: interaction.guild.iconURL() })
    .setTimestamp()


  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("statusticket")
      .setLabel(status ? 'Online' : 'Offline')
      .setEmoji(status ? "1236021048470933575" : "1236021106662707251")
      .setStyle(status ? 3 : 4),
    new ButtonBuilder()
      .setCustomId("ticketconfig2024")
      .setLabel("Meu Ticket")
      .setEmoji("1246953296321577020")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("inteligenciaartificial")
      .setLabel("IA Service")
      .setEmoji("1302021031866929224")
      .setStyle(1)
  )

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("chaveReciboConfig")
      .setLabel("ChaveRecibo")
      .setEmoji("1302019361623769281")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("configuracoes")
      .setLabel("Icônicos")
      .setEmoji("1302020457276375050")
      .setStyle(2)
  )

  if (interaction.message == undefined) {
    interaction.reply({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true })
  } else {
    interaction.update({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true })
  }
}

async function configuracoes(interaction, client) {

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.username} - Gerenciamento Icônicos`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`🎈\` Gerenciamento dos **icônicos**.`)
    .setColor("#00FFFF")
    .addFields(
      { name: `Logs Privadas`, value: `${general.get("ticket.definicoes.logsstaff") ? `<#${general.get("ticket.definicoes.logsstaff")}>` : `\`🔴 Não configurado.\``}` },
      { name: `Cargo Staff`, value: `${general.get("ticket.definicoes.cargostaff") ? `<@&${general.get("ticket.definicoes.cargostaff")}>` : `\`🔴 Não configurado.\``}` },
      { name: `Categoria Tickets`, value: `${general.get("ticket.definicoes.categoriaticket") ? `<#${general.get("ticket.definicoes.categoriaticket")}>` : `\`🔴 Não configurado.\``}` },
    )
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp()


  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("alterarlogs")
      .setLabel("Logs Privadas")
      .setEmoji("1302020493779402872")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("alterarcargostaff")
      .setLabel("Cargo Staff")
      .setEmoji("1246955036433453259")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("alterarcategoriaticket")
      .setLabel("Categoria Tickets")
      .setEmoji("1302019349296713769")
      .setStyle(1)
  )

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("voltar00")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  )

  interaction.update({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true })
}

async function configticket(interaction, client) {

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.username} - Gerenciamento Ticket/Atendimento`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`🎫\` Gerenciamento do **Ticket/Atendimento**.`)
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp()


  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("configticket")
      .setLabel("Sistema")
      .setEmoji("1246954897509847194")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("configaparencia")
      .setLabel("Estrutura")
      .setEmoji("1246953386797174835")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("funcoesticket")
      .setLabel("Funções")
      .setEmoji("1297641727359979701")
      .setStyle(1),
  )

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("voltar00")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  )

  interaction.update({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true });
}

async function aparencia(interaction, client) {
  const status = general.get("ticket.tipomsg") || false
  const bannerUrl = general.get("ticket.aparencia.banner") || null;
  const miniaturaUrl = general.get("ticket.aparencia.miniatura") || null;

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.username} - Gerenciamento Estrutura`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`🎨\` Gerenciamento da **estrutura**.`)
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp()

  if (status) {

    embed4.addFields(
      { name: `Mode Send`, value: "\`🎨 Content\`" },
      { name: `Mensagem`, value: `\`\`\`${general.get("ticket.aparencia.content") || "👌 | Olá, utilize o botão abaixo para abrir um ticket"}\`\`\`` },
      { name: `Banner`, value: bannerUrl ? `[Abrir Imagem](${bannerUrl})` : "\`🔴 Não configurado.\`" }
    );

  } else {

    embed4.addFields(
      { name: `Mode Send`, value: "\`🎨 Embed\`" },
      { name: `Informações`, value: `**Título:** \`${general.get("ticket.aparencia.titulo") || "Atendimento ao cliente"}\`\n**Descrição:** \`${general.get("ticket.aparencia.descricao") || "👋 Olá, utilize o botão abaixo para abrir um ticket"}\`\n**Color:** \`${general.get("ticket.aparencia.cor") || "#000000"}\`` },
      { name: `Imagens`, value: `**Banner:** ${bannerUrl ? `[Abrir Imagem](<${bannerUrl}>)` : "\`🔴 Não configurado.\`"}\n**Miniatura:** ${miniaturaUrl ? `[Abrir Imagem](<${miniaturaUrl}>)` : "\`🔴 Não configurado.\`"}` }
    );

  };

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("gerenciaraparencia")
      .setLabel("Personalizar Design")
      .setEmoji("1294425656796381219")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("gerenciatipo")
      .setLabel(status ? "Mode Content" : "Mode Embed")
      .setEmoji("1297641351164203120")
      .setStyle(3),
    new ButtonBuilder()
      .setCustomId("configbotao")
      .setLabel("Button Config")
      .setEmoji("1297641727359979701")
      .setStyle(1)
  )

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticketconfig2024")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  )

  interaction.update({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true })
}

async function addperms(interaction, client) {

  const perm = perms.get("perms") || [];

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.globalName} - Gerenciamento Permissões`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`🔑\` Gerenciamento das **permissões**.`)
    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    .addFields(
      { name: `Permissões`, value: `\`${perm.length}/25x\`` }
    )
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp()

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("addperms").setLabel("Adicionar Permissões").setEmoji("1302020207753302166").setStyle(3).setDisabled(perm.length === 25 ? true : false),
    new ButtonBuilder().setCustomId("removeperms").setLabel("Remover Permissões").setEmoji("1320199952789667860").setStyle(4).setDisabled(perm.length === 0 ? true : false),
    new ButtonBuilder().setCustomId("listperms").setLabel("Listar Permissões").setEmoji("989616870212661278").setStyle(2).setDisabled(perm.length === 0 ? true : false),
  );

  if (interaction.message == undefined) {
    interaction.reply({ content: ``, components: [row], content: '', embeds: [embed4], ephemeral: true })
  } else {
    interaction.update({ content: ``, components: [row], content: '', embeds: [embed4], ephemeral: true })
  }
}


module.exports = {
  config,
  configuracoes,
  configticket,
  aparencia,
  addperms
}
