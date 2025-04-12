const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { general } = require("../DataBaseJson");

async function payments(interaction, client) {

  const sistemaMp = await general.get("auto.sistemaMp") || false;
  const mp = await general.get("auto.mp") || null;

  const sistemaSemi = await general.get("semi.sistema") || false;
  const chave = await general.get("semi.chave") || null;

  interaction.update({
    content: ``,
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username} - Gerenciando ChaveRecibo`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`-# \`👤\` Gerenciamento do sistema **ChaveRecibo**.`)
        .addFields(
          { name: `⚡ Automático`, value: `${sistemaMp ? "\`(✅ | ON)\` **Sistema**" : "\`(🔴 | OFF)\` **Sistema**"}\n${!mp ? "\`(🔎 | NOT FOUND)\` **API**" : "\`(📡 | RUNNING)\` **API**"}`, inline: true },
          { name: `📋 Semi Auto`, value: `${sistemaSemi ? "\`(✅ | ON)\` **Sistema**" : "\`(🔴 | OFF)\` **Sistema**"}\n${!chave ? "\`(🔎 | NOT FOUND)\` **Chave**" : "\`(📫 | SETADA)\` **Chave**"}`, inline: true },
          { name: `💳 Cartão Stripe`, value: `\`(🔴 | OFF)\` **Sistema**\n\`(🔎 | NOT FOUND)\` **Stripe**`, inline: true },
          { name: `💱 Bit Coin`, value: `\`(🔴 | OFF)\` **Sistema**\n\`(🔎 | NOT FOUND)\` **Configuração**`, inline: true }
        )
        .setColor(`#00FFFF`)
        .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
    ],
    components: [
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`automaticConfig`).setLabel(`Gerenciar Automático`).setEmoji(`1302019699176902717`).setStyle(1),
          new ButtonBuilder().setCustomId(`semiAutoConfig`).setLabel(`Sistema de Semi Auto`).setEmoji(`1302018395851722763`).setStyle(1)
        ),
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`stripeConfig`).setLabel(`Setar Cartão Stripe`).setEmoji(`1295039474891489301`).setStyle(1).setDisabled(true),
          new ButtonBuilder().setCustomId(`bitCoinConfig`).setLabel(`Configurar Bit Coin`).setEmoji(`1295039423582441546`).setStyle(1).setDisabled(true)
        ),
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`voltar00`).setEmoji(`1246953097033416805`).setStyle(2)
        )
    ]
  });

};

async function automatic(interaction, client) {

  const sistemaMp = await general.get("auto.sistemaMp") || false;
  const mp = await general.get("auto.mp") || null;
  const banksOffArray = await general.get("auto.banksOff") || [];

  const banksOff = banksOffArray.map(bank => `${bank} `).join('\n');

  interaction.update({
      content: ``,
      embeds: [
          new EmbedBuilder()
              .setAuthor({ name: `${interaction.user.username} - Gerenciando Automático`, iconURL: interaction.user.displayAvatarURL() })
              .setDescription(`-# \`⚡\` Gerenciamento do sistema **Automático**.\n\n-# **Observação:** Na área de automação de pagamento, você vai agilizar o seu processo sem ter que aprovar manualmente um carrinho criado. Use as funções abaixo para setar sua **Creandencia do Access Token** & **Bloquear bancos** que tem índices de fraudes.`)
              .addFields(
                  { name: `Sistema`, value: `${sistemaMp ? "\`🟢 Online\`" : "\`🔴 Offline\`"}` },
                  { name: `Crendencias Access Token`, value: `${!mp ? "\`\`\`APP_USR-000000000000000-XXXXXXX-XXXXXXXXX\`\`\`" : `\`\`\`${mp.slice(0, -33) + '***************************'}\`\`\``}` },
                  { name: `Bancos Bloqueados`, value: `${banksOffArray.length <= 0 ? `Nenhum` : `\`\`\`${banksOff}\`\`\``}` }
              )
              .setColor(`#00FFFF`)
              .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
              .setTimestamp()
      ],
      components: [
          new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder().setCustomId(`sistemaMpOnOff`).setLabel(sistemaMp ? "Online" : "Offline").setEmoji(sistemaMp ? "1236021048470933575" : "1236021106662707251").setStyle(sistemaMp ? 3 : 4),
                  new ButtonBuilder().setCustomId(`setAccessToken`).setLabel(`Access Token`).setEmoji(`1249371859925864572`).setStyle(1),
                  new ButtonBuilder().setCustomId(`antFraudSet`).setLabel(`Anti Fraude`).setEmoji(`1302021690045497424`).setStyle(2)
              ),
          new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder().setCustomId(`chaveReciboConfig`).setEmoji(`1246953097033416805`).setStyle(2)
              )
      ]
  });

};

async function semiAuto(interaction, client) {

  const sistemaSemi = await general.get("semi.sistema") || false;
  const chave = await general.get("semi.chave") || null;
  const roleAprove = await general.get("semi.roleAprove") || null;

  interaction.update({
      content: ``,
      embeds: [
          new EmbedBuilder()
              .setAuthor({ name: `${interaction.user.username} - Gerenciando Semi Auto`, iconURL: interaction.user.displayAvatarURL() })
              .setDescription(`-# \`📋\` Gerenciamento do sistema **Semi Auto**.\n\n-# **Observação:** A área de Semi Auto é um sistema útil para quem não tem o mercado pago, esse sistema é preciso aprovar manualmente o pagamento da pessoa que está adquirindo os alugueis da loja/apps. Configire **Tipo/Chave** & **Cargo Aprovador** logo abaixo.`)
              .addFields(
                  { name: `Sistema`, value: `${sistemaSemi ? "\`🟢 Online\`" : "\`🔴 Offline\`"}` },
                  { name: `Agências (PIX)`, value: `\`${chave ? "🟢 Configurado" : "🔴 Não configurado."}\`` },
                  { name: `Agências (ROLE)`, value: `\`${roleAprove ? "🟢 Configurado" : "🔴 Não configurado."}\`` }
              )
              .setColor(`#00FFFF`)
              .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
              .setTimestamp()
      ],
      components: [
          new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder().setCustomId(`sistemaSemiOnOff`).setLabel(sistemaSemi ? "Online" : "Offline").setEmoji(sistemaSemi ? "1236021048470933575" : "1236021106662707251").setStyle(sistemaSemi ? 3 : 4),
                  new ButtonBuilder().setCustomId(`setAgenceSemi`).setLabel(`Setar Agências`).setEmoji(`1302020457276375050`).setStyle(1)
              ),
          new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder().setCustomId(`chaveReciboConfig`).setEmoji(`1246953097033416805`).setStyle(2)
              )
      ]
  });

};

async function setAgenceSemi(interaction, client) {

  const tipo = await general.get("semi.tipo") || null;
  const chave = await general.get("semi.chave") || null;
  const roleAprove = await general.get("semi.roleAprove") || null;

  const roleMention = await interaction.guild.roles.cache.get(roleAprove);

  interaction.update({
      content: ``,
      embeds: [
          new EmbedBuilder()
              .setAuthor({ name: `${interaction.user.username} - Gerenciando Agências`, iconURL: interaction.user.displayAvatarURL() })
              .setDescription(`-# \`🧪\` Gerenciamento do sistema **Agências**.`)
              .addFields(
                  { name: `Configuração`, value: `${tipo && chave ? `\`${chave} | ${tipo}\`` : `\`🔴 Não configurado.\``}`, inline: true },
                  { name: `Cargo Aprovador`, value: `${!roleAprove ? `\`🔴 Não configurado.\`` : `${roleMention}`}`, inline: true }
              )
              .setColor(`#00FFFF`)
              .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
              .setTimestamp()
      ],
      components: [
          new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder().setCustomId(`setConfigSemi`).setLabel(`Setar Configuração`).setEmoji(`1302019361623769281`).setStyle(1),
                  new ButtonBuilder().setCustomId(`aprovedRoleSemi`).setLabel(`Cargo Aprovador`).setEmoji(`1302018377279078581`).setStyle(1),
              ),
          new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder().setCustomId(`semiAutoConfig`).setEmoji(`1246953097033416805`).setStyle(2)
              )
      ]
  });

};

module.exports = {
  payments,
  automatic,
  semiAuto,
  setAgenceSemi
}
