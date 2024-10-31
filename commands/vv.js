// vv.js
const { proto } = require('@whiskeysockets/baileys');

async function handleViewOnceCommand(sock, message) {
  try {
    // Check if the message is a reply to a view-once message
    const quotedMessage = message.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMessage || (!quotedMessage.viewOnceMessage && !quotedMessage.viewOnceMessageV2)) {
      await sock.sendMessage(message.key.remoteJid, { text: "_Not a view-once message!_" });
      return;
    }

    // Get the actual message content and set viewOnce to false
    const viewOnceMsg = quotedMessage.viewOnceMessage?.message || quotedMessage.viewOnceMessageV2?.message;
    viewOnceMsg[Object.keys(viewOnceMsg)[0]].viewOnce = false;

    // Forward the modified message
    await sock.sendMessage(message.key.remoteJid, viewOnceMsg);
  } catch (error) {
    console.error('Error handling view-once command:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while processing the view-once message.' });
  }
}

// Export the command function
module.exports = handleViewOnceCommand;
