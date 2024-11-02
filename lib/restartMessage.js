const config = require('../config.js');

const sendRestartMessage = async (sock) => {
  const restartMessage = 'Bot has restarted and is now online 🚀';
  try {
    for (const number of config.SUDO) {
      const adminJid = `${number}@s.whatsapp.net`; // Append @s.whatsapp.net here
      await sock.sendMessage(adminJid, { text: restartMessage });
    }
    console.log("Restart message sent to SUDO numbers");
  } catch (error) {
    console.error("Error sending restart message:", error);
  }
};

module.exports = sendRestartMessage;
