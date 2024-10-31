// quotedMessageHandler.js

// Function to check if a message is quoted
function isQuotedMessage(message) {
  return !!message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
}

// Function to get the text of the quoted message
function getQuotedText(message) {
  return message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || '';
}

// Function to reply to a quoted message with custom text
async function replyToQuotedMessage(sock, message, replyText) {
  if (isQuotedMessage(message)) {
    const quotedId = message.message.extendedTextMessage.contextInfo.stanzaId;
    const quotedRemoteJid = message.key.remoteJid;
    
    await sock.sendMessage(quotedRemoteJid, { text: replyText }, { quoted: message });
  } else {
    await sock.sendMessage(message.key.remoteJid, { text: "No quoted message found." });
  }
}

module.exports = { isQuotedMessage, getQuotedText, replyToQuotedMessage };
