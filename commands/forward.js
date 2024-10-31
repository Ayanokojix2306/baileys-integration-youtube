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

    // Forward the original message to the specified JID
    await sock.sendMessage(userJid, { forward: message.key }); // Forward the message using its key
    await sock.sendMessage(message.key.remoteJid, { text: 'Message forwarded successfully!' });
  } catch (error) {
    console.error('Error handling forward command:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while forwarding the message. Please try again later.' });
  }
}
module.exports = { handleForwardCommand };
