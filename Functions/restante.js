const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require("discord.js");
const { general } = require("../DataBaseJson");


async function configbotao(interaction, client) {

  const config = general.get("ticket.botao") || []
  const row24 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Button Preview")
      .setCustomId("configbotaoteste2024random")
      .setEmoji(config.emoji || "1240863968042418247")
      .setStyle(config.style || 2)
      .setDisabled(true)
  )


  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("configemojibotao")
      .setLabel("Emoji Button")
      .setEmoji("1246955047280185385")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("configcorbotao")
      .setLabel("Style Button")
      .setEmoji("1294425656796381219")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("configaparencia")
      .setEmoji("1246953097033416805")
      .setStyle(2),
  )



  interaction.update({ content: `O que deseja personalizar no botão de atendimento?`, components: [row24, row], embeds: [], ephemeral: true })

}

async function configinteligenciaartifial(interaction, client) {

  const status = await general.get("ticket.statusgermine") || false
  const prompt = await general.get("ticket.germine.prompt") || "🔴 Não configurado."

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.username} - Gerenciamento IA`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`💡\` Gerenciamento da **Inteligência Artificial**.\n\n-# **Obeservação:** Se um usuário perguntar, por exemplo, sobre 'robux', e você tiver configurado uma resposta para esse tema, a IA responderá **automaticamente** com a **mensagem associada ao prompt** configurado.`)
    .setColor("#00FFFF")
    .addFields(
      { name: `IA Service`, value: `${status ? '\`🟢 Online\`' : '\`🔴 Offline\`'}`, inline: true },
      { name: `IA Prompt`, value: `\`${prompt}\``, inline: true }
    )
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp()


  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("statusgermine")
      .setLabel(status ? 'Online' : 'Offline')
      .setEmoji(status ? "1236021048470933575" : "1236021106662707251")
      .setStyle(status ? 3 : 4),
    new ButtonBuilder()
      .setCustomId("configurarprompt")
      .setLabel("Gerenciar Prompt")
      .setEmoji("1302020615192187031")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("voltar00")
      .setEmoji("1246953097033416805")
      .setStyle(2),
  )

  interaction.update({ components: [row], embeds: [embed4], ephemeral: true })

}

async function configfuncoes(interaction, client) {
  const statusRenomear = general.get("ticket.functions.renomear") || false;
  const statusMotivo = general.get("ticket.functions.motivo_ticket") || false;
  const statusRemoverUsuario = general.get("ticket.functions.remover_usuario") || false;
  const statusAdicionarUsuario = general.get("ticket.functions.adicionar_usuario") || false;
  const statusPoker = general.get("ticket.functions.poker") || false;

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.username} - Gerenciamento Funções Ticket`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`⭐\` Gerenciamento das **funções ticket**.`)
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp()

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('configuracoesFuncoes')
    .setPlaceholder('⭐ Opções')
    .addOptions(
      {
        label: 'Poker',
        description: `${statusPoker ? '🟢 Habilitado' : '🔴 Desabilitado'}`,
        emoji: "1302020863339663370",
        value: '4324324432poker',
      },
      {
        label: 'Renomear',
        description: `${statusRenomear ? '🟢 Habilitado' : '🔴 Desabilitado'}`,
        emoji: "1284680830043557888",
        value: '243234renomear',
      },
      {
        label: 'Adicionar Usuário',
        description: `${statusAdicionarUsuario ? '🟢 Habilitado' : '🔴 Desabilitado'}`,
        emoji: "1284680870497620009",
        value: '34242344adicionar_usuario',
      },
      {
        label: 'Remover Usuário',
        description: `${statusRemoverUsuario ? '🟢 Habilitado' : '🔴 Desabilitado'}`,
        emoji: "1277488588442828830",
        value: '234234234remover_usuario',
      }
    );

  const row4 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticketconfig2024")
      .setEmoji("1246953097033416805")
      .setStyle(2),
  );

  const row = new ActionRowBuilder().addComponents(selectMenu);

  interaction.update({
    components: [row, row4],
    embeds: [embed4],
    ephemeral: true
  });
}
async function painelticket(interaction, client) {
  const funcoesConfiguradas = await general.get("ticket.funcoes") || [];
  const panel = general.get("paineis") || [];

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.username} - Gerenciamento Paineis Ticket`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`🟢\` Configuração **Paineis Ticket**.`)
    .addFields(
      { name: `Paineis`, value: `\`25/${panel.length}x\``, inline: true },
    )
    .setThumbnail(interaction.guild.iconURL())
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  const maxOptions = 25;
  const options = panel.length > 0 
    ? panel.slice(0, maxOptions).map(p => ({
        label: p.nome || 'Painel Desconhecido',
        value: p.nome,
        emoji: "1246953215380160593"
      }))
    : [{ 
        label: 'Nenhum painel disponível',
        value: 'notcreated',
        emoji: "1337824357292183722",
      }];

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("SelectPainelConfig")
    .setPlaceholder('Selecione um painel')
    .addOptions(options)
    .setMaxValues(1)
    .setDisabled(panel.length === 0);

  const row1 = new ActionRowBuilder().addComponents(selectMenu);
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("addpainel").setLabel("Adicionar Painel").setStyle(3).setEmoji("1246953350067388487").setDisabled(panel.length >= maxOptions),
    new ButtonBuilder().setCustomId("rempainel").setLabel("Remover Painel").setStyle(4).setEmoji("1246953362037932043").setDisabled(panel.length === 0),
    new ButtonBuilder().setCustomId("ticketconfig2024").setStyle(2).setEmoji("1246953097033416805"),
  );

  interaction.update({
    embeds: [embed],
    components: [row1, row2],
    ephemeral: true
  });
}

async function painelticketfunc(id, interaction, client) {
  const funcoesConfiguradas = await general.get(`${id}.ticket.funcoes`) || [];

  const tipomsg = general.get(`${id}.ticket.tipoenviarmsgtckt`) || false;
  const statusabertura = general.get(`${id}.ticket.statusabertura`) || false;

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${interaction.user.username} - Gerenciamento Sistema Ticket`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
    .setDescription(`-# \`💻\` Gerenciamento do **sistema ticket**.`)
    .addFields(
      { name: `Categorias`, value: `\`x${funcoesConfiguradas.length}\``, inline: true },
      { name: `Abertura`, value: `\`${tipomsg ? "Select Menu" : "Botões"}\``, inline: true },
      { name: `Mode Ticket`, value: `\`${statusabertura ? "Tópico" : "Categoria"}\``, inline: true }
    )
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${id}_add_funcao`)
      .setLabel("Adicionar")
      .setStyle(3)
      .setEmoji("1246953350067388487"),
    new ButtonBuilder()
      .setCustomId(`${id}_remover_funcao`)
      .setLabel("Deletar")
      .setStyle(4)
      .setEmoji("1246953338541441036")
      .setDisabled(funcoesConfiguradas.length === 0),
    new ButtonBuilder()
      .setCustomId(`${id}_editar_funcao`)
      .setLabel("Editar Categoria")
      .setStyle(2)
      .setEmoji("1246953149009367173")
      .setDisabled(funcoesConfiguradas.length === 0)
  );

  const row3 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${id}_ver_funcoes`)
      .setLabel("Ver Categorias")
      .setStyle(1)
      .setDisabled(funcoesConfiguradas.length === 0)
      .setEmoji("1246954883182100490"),
    new ButtonBuilder()
      .setCustomId(`${id}_postar`)
      .setLabel("Enviar Painel")
      .setStyle(1)
      .setDisabled(funcoesConfiguradas.length === 0)
      .setEmoji("1302021031866929224"),
    new ButtonBuilder()
      .setCustomId(`${id}_sincronizar`)
      .setLabel("Sincronizar")
      .setStyle(2)
      .setDisabled(funcoesConfiguradas.length === 0)
      .setEmoji("1246953228655132772"),
  );

  const row4 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${id}_trocarselect`)
      .setLabel(tipomsg ? "Usar Botão" : "Usar Select")
      .setEmoji("1246953228655132772")
      .setStyle(3),
    new ButtonBuilder()
      .setCustomId(`${id}_trocaraberturaticket2024`)
      .setLabel(statusabertura ? "Mode Tópico" : "Mode Category")
      .setEmoji("1302019349296713769")
      .setStyle(3),
    new ButtonBuilder()
      .setCustomId("configticket")
      .setStyle(2)
      .setEmoji("1246953097033416805")
  );

  interaction.update({
    embeds: [embed],
    components: [row2, row3, row4],
    content: "",
    ephemeral: true
  });
}





module.exports = {
  configbotao,
  configinteligenciaartifial,
  configfuncoes,
  painelticketfunc,
  painelticket
}
