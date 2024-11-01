const JavaScriptObfuscator = require('javascript-obfuscator');

async function handleObfuscateCommand(sock, message) {
  try {
    const text = message.message.conversation || '';
    const code = text.replace(/^[.,!]?obfuscate\s*/i, '').trim(); // Remove the command keyword and trim spaces

    // Check if any code is provided
    if (!code) {
      await sock.sendMessage(message.key.remoteJid, { text: '❌ No code detected. Please provide the code you want to obfuscate after the command.' });
      return;
    }

    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
    });

    await sock.sendMessage(message.key.remoteJid, { text: `✨ Obfuscated Code:\n\n${obfuscationResult.getObfuscatedCode()}` });
  } catch (error) {
    console.error('Error obfuscating code:', error);
    await sock.sendMessage(message.key.remoteJid, { text: '❌ Error obfuscating code. Please check the input!' });
  }
}

module.exports = { handleObfuscateCommand };
