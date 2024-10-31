async function handleForwardCommand(sock, message) {
  try {
    // Check if the message is sent by the bot itself
    if (!message.key.fromMe) {
      await sock.sendMessage(message.key.remoteJid, { text: 'Only the bot can forward messages.' });
      return;
    }

    const parts = message.message.conversation.split(' ');

    // Check if the JID is provided in the command
    const userJid = parts[1] || '2348073765008@s.whatsapp.net'; // default to a specific JID if none provided

    // Check if there's a quoted message (replied message)
    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (quotedMessage) {
      // Forward the replied message
      await sock.sendMessage(userJid, { forward: quotedMessage }); 
      await sock.sendMessage(message.key.remoteJid, { text: 'Message forwarded successfully!' });
    } else {
      await sock.sendMessage(message.key.remoteJid, { text: 'Please reply to a message to forward it.' });
    }
  } catch (error) {
    console.error('Error handling forward command:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while forwarding the message. Please try again later.' });
  }
}

module.exports = { handleForwardCommand };
