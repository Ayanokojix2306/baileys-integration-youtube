const beautify = require('js-beautify').js;
const atob = require('atob');

async function handleDeobfuscateCommand(sock, message) {
  try {
    const text = message.message.conversation || '';
    const code = text.replace(/^[.,!]?deobfuscate\s*/i, ''); // Remove the command keyword

    let decodedCode;
    try {
      decodedCode = atob(code); // Attempt to decode if Base64 encoded
    } catch {
      decodedCode = code; // If not, use as-is
    }

    const beautifiedCode = beautify(decodedCode, { indent_size: 2 });

    await sock.sendMessage(message.key.remoteJid, { text: `✨ De-obfuscated Code:\n\n${beautifiedCode}` });
  } catch (error) {
    console.error('Error deobfuscating code:', error);
    await sock.sendMessage(message.key.remoteJid, { text: '❌ Error deobfuscating code. Please check the input!' });
  }
}

module.exports = { handleDeobfuscateCommand };
