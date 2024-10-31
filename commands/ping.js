// ping.js
async function handlePingCommand(sock, message) {
  const startTime = Date.now(); // Get the current time
  await sock.sendMessage(message.key.remoteJid, { text: 'Pong!' }); // Send pong response
  const endTime = Date.now(); // Get the time after sending the message

  const timeTaken = endTime - startTime; // Calculate the time taken
  const responseText = `Pong! 🏓 Response time: ${timeTaken} ms`;
  await sock.sendMessage(message.key.remoteJid, { text: responseText }); // Send response time
}

module.exports = { handlePingCommand };
