async function replyToQuotedMessage(sock, message, replyText) {
  if (isQuotedMessage(message)) {
    const quotedId = message.message.extendedTextMessage.contextInfo.stanzaId;
    const quotedRemoteJid = message.key.remoteJid;
    const participant = message.message.extendedTextMessage.contextInfo.participant || message.key.participant;

    // Create the context info for the quoted message
    const contextInfo = {
      stanzaId: quotedId,
      participant: participant,
      quotedMessage: message.message.extendedTextMessage.contextInfo.quotedMessage,
    };

    await sock.sendMessage(quotedRemoteJid, { text: replyText }, { quoted: { key: { id: quotedId, participant }, contextInfo } });
  } else {
    await sock.sendMessage(message.key.remoteJid, { text: "No quoted message found." });
  }
}
