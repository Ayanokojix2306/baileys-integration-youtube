async function handleForwardCommand(sock, message) {
  try {
    // Check if the message is sent by the bot
    if (!message.key.fromMe) {
      await sock.sendMessage(message.key.remoteJid, { text: 'Only the bot can forward messages.' });
      return;
    }

    const parts = message.message.conversation.split(' ');

    // Check if the JID is provided
    if (parts.length < 2) {
      await sock.sendMessage(message.key.remoteJid, { text: 'Please provide a user JID after the command.' });
      return;
    }

    const userJid = parts[1]; // Get the JID from the command

    // Check if the message is a reply
    if (!message.message?.conversation && message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedMessageKey = message.message.extendedTextMessage.contextInfo.quotedMessage.key; // Get the key of the quoted message
      await sock.sendMessage(userJid, { forward: quotedMessageKey }); // Forward the quoted message using its key
      await sock.sendMessage(message.key.remoteJid, { text: 'Message forwarded successfully!' });
    } else {
      await sock.sendMessage(message.key.remoteJid, { text: 'Please reply to a message to forward it.' });
    }
  } catch (error) {
    console.error('Error handling forward command:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while forwarding the message. Please try again later.' });
  }
}
module.exports = {handleForwardCommand}
