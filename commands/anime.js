const axios = require('axios');

async function getAnimeInfo(animeName) {
  try {
    const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${animeName}&sfw`);
    return response.data.data[0]; // Return the first result
  } catch (error) {
    console.error('Error fetching anime data:', error);
    return null; // Return null on error
  }
}

async function handleAnimeCommand(sock, message) {
  const parts = message.message.conversation.split(' ');
  if (parts.length < 2) {
    await sock.sendMessage(message.key.remoteJid, { text: 'Please provide an anime name after the command.' });
    return;
  }
  
  const animeName = parts.slice(1).join(' '); // Join the parts back into the anime name
  const animeInfo = await getAnimeInfo(animeName);

  if (animeInfo) {
    const responseText = `
      **Title:** ${animeInfo.title}
      **Synopsis:** ${animeInfo.synopsis}
      **Score:** ${animeInfo.score}
      **Episodes:** ${animeInfo.episodes}
      **Status:** ${animeInfo.status}
      **Image:** ${animeInfo.images.jpg.image_url}
    `;
    await sock.sendMessage(message.key.remoteJid, { text: responseText });
  } else {
    await sock.sendMessage(message.key.remoteJid, { text: 'Anime not found or an error occurred.' });
  }
}

module.exports = { handleAnimeCommand };
