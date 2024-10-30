const express = require('express');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { MongoClient } = require('mongodb');
const useMongoDBAuthState = require('./mongoAuthState');
const { DisconnectReason } = require('@whiskeysockets/baileys'); // Add this line
const QRCode = require('qrcode');

const app = express();
const port = process.env.PORT || 10000;
const mongoURL = process.env.MONGODB_URI || 'mongodb+srv://Saif:Arhaan123@cluster0.mj6hd.mongodb.net';

// Declare qrCodeData in a higher scope
let qrCodeData = '';

async function connectionLogic() {
  const mongoClient = new MongoClient(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  await mongoClient.connect();
  const collection = mongoClient.db('whatsapp_api').collection('auth_info_baileys');
  const { state, saveCreds } = await useMongoDBAuthState(collection);

  const sock = makeWASocket({
    auth: state,
  });

  // Handle QR Code generation
  sock.ev.on('connection.update', async (update) => {
    const { qr, connection, lastDisconnect } = update;
    if (qr) {
      qrCodeData = await QRCode.toDataURL(qr); // Convert to a data URL for display
    }

    if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
      connectionLogic(); // Reconnect if not logged out
    }
  });

  // Message event handler to respond to "hi" or "hello"
  sock.ev.on('messages.upsert', async (messageInfo) => {
    const message = messageInfo.messages[0];
    if (message.key.fromMe || !message.message) return;

    const text = message.message.conversation || '';
    if (text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello') {
      await sock.sendMessage(message.key.remoteJid, { text: 'Hello there! 👋' });
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

connectionLogic();

// Serve the QR code at the root URL
app.get('/', (req, res) => {
  if (qrCodeData) {
    res.send(`<h2>Scan the QR Code below with WhatsApp:</h2><img src="${qrCodeData}" />`);
  } else {
    res.send('<h2>QR Code not generated yet. Please wait...</h2>');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
