const { isQuotedMessage, getQuotedInfo, replyToQuotedMessage } = require('../lib/quotedMessageHandler');

// Main function to handle the quote responder command
async function handleQuoteResponderCommand(sock, message) {
  console.log("Handling quote responder command with message:", JSON.stringify(message, null, 2)); // Log here
  try {
    if (isQuotedMessage(message)) {
      const quotedInfo = getQuotedInfo(message);
      // Log the quoted message details
      console.log("Quoted Message:", message.message.extendedTextMessage.contextInfo.quotedMessage);
      
      // Customize the response based on the quoted message's full context
      const replyText = `Quoted Message Info:\nStanza ID: ${quotedInfo.stanzaId || 'N/A'}\nParticipant: ${quotedInfo.participant || 'N/A'}\nMessage: "${quotedInfo.quotedMessage?.conversation || 'No conversation text'}"`;
      
      // Reply to the quoted message
      await replyToQuotedMessage(sock, message, replyText);
    } else {
      // Inform user that no quoted message was detected
      await sock.sendMessage(message.key.remoteJid, { text: "Please quote a message to use this command, baka!" });
    }
  } catch (error) {
    console.error("Error handling quote responder command:", error);
    await sock.sendMessage(message.key.remoteJid, { text: "An error occurred. Please try again later." });
  }
}
