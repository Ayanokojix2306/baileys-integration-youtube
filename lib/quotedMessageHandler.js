// Check if the message is a quoted message
function isQuotedMessage(message) {
  return (
    message.message &&
    message.message.extendedTextMessage &&
    message.message.extendedTextMessage.contextInfo &&
    message.message.extendedTextMessage.contextInfo.stanzaId
  );
}

// Get the text of the quoted message
function getQuotedText(message) {
  if (isQuotedMessage(message)) {
    // Add debugging information to see what the quoted message contains
    console.log("Quoted Message Context:", message.message.extendedTextMessage.contextInfo);
    return message.message.extendedTextMessage.contextInfo.quotedMessage?.conversation || '';
  }
  return '';
}

// Reply to the quoted message
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

    console.log("Attempting to reply to quoted message with context:", contextInfo);

    try {
      // Send the reply with the quoted context
      await sock.sendMessage(
        quotedRemoteJid,
        { text: replyText },
        { quoted: { key: { id: quotedId, participant }, contextInfo } }
      );
    } catch (error) {
      console.error("Error sending quoted reply:", error);
      await sock.sendMessage(message.key.remoteJid, { text: "An error occurred while replying to the quoted message." });
    }
  } else {
    // Inform the user if there's no quoted message
    console.log("No quoted message found.");
    await sock.sendMessage(message.key.remoteJid, { text: "No quoted message found." });
  }
}

// Export the functions for use in other modules
module.exports = {
  isQuotedMessage,
  getQuotedText,
  replyToQuotedMessage,
};
