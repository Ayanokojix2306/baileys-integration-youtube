// commands/vv.js
async function handleViewOnceCommandNotForward(sock, message) {
    // Check if the message is a reply to a view-once message
    if (!message.reply_message || 
        (!message.quoted?.message.hasOwnProperty('viewOnceMessage') && 
        !message.quoted?.message.hasOwnProperty('viewOnceMessageV2'))) {
        await sock.sendMessage(message.key.remoteJid, { text: "_Not a view once msg!_" });
        return; // Exit the function
    }

    // Get the quoted message
    message.quoted.message = message.quoted.message.viewOnceMessage?.message || message.quoted.message.viewOnceMessageV2?.message;
    message.quoted.message[Object.keys(message.quoted.message)[0]].viewOnce = false;

    // Forward the message
    await sock.sendMessage(message.key.remoteJid, { forward: message.quoted });
}

module.exports = { handleViewOnceCommandNotForward };
