const JavaScriptObfuscator = require('javascript-obfuscator');

async function handleObfuscateCommand(sock, message) {
  try {
    const text = message.message.conversation || '';
    const code = text.replace(/^[.,!]?obfuscate\s*/i, ''); // Remove the command keyword

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
