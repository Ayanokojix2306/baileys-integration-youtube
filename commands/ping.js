async function handlePingCommand(sock, message) {
    // Check if the message has a conversation
    const text = (message.message && message.message.conversation) ? message.message.conversation : '';

    // Optional: You can respond only if 'ping' is found in the message
    const pingRegex = /^[.,!]?ping\s/i;
    if (!pingRegex.test(text)) return; // Return early if not a ping command

    const startTime = Date.now(); // Get the current time
    await sock.sendMessage(message.key.remoteJid, { text: 'Pong!' }); // Send pong response
    const endTime = Date.now(); // Get the time after sending the message

    const timeTaken = endTime - startTime; // Calculate the time taken
    const responseText = `Pong! 🏓 Response time: ${timeTaken} ms`;
    await sock.sendMessage(message.key.remoteJid, { text: responseText }); // Send response time
}

module.exports = { handlePingCommand };
