const { isQuotedMessage, getQuotedText, replyToQuotedMessage } = require('../lib/quotedMessageHandler');

// Main function to handle the quote responder command
async function handleQuoteResponderCommand(sock, message) {
  try {
    if (isQuotedMessage(message)) {
      const quotedText = getQuotedText(message);
      
      // Customize the response based on the quoted message's content
      const replyText = `You quoted: "${quotedText}"`;
      
      // Reply to the quoted message
      await replyToQuotedMessage(sock, message, replyText);
    } else {
      // Inform user that no quoted message was detected
      await sock.sendMessage(message.key.remoteJid, { text: "Please quote a message to use this command." });
    }
  } catch (error) {
    console.error("Error handling quote responder command:", error);
    await sock.sendMessage(message.key.remoteJid, { text: "An error occurred. Please try again later." });
  }
}


module.exports = { handleQuoteResponderCommand };
