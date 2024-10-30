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
  const animeName = message.message.conversation.split(' ')[1]; // Extract anime name from the command
  try {
    const animeInfo = await getAnimeInfo(animeName);

    if (animeInfo) {
      const responseText = `
        Title: ${animeInfo.title}
        Synopsis: ${animeInfo.synopsis}
        Score: ${animeInfo.score}
        Episodes: ${animeInfo.episodes}
        Status: ${animeInfo.status}
        Image: ${animeInfo.images.jpg.image_url}
      `;
      await sock.sendMessage(message.key.remoteJid, { text: responseText });
    } else {
      await sock.sendMessage(message.key.remoteJid, { text: 'Anime not found or an error occurred.' });
    }
  } catch (error) {
    console.error('Error handling anime command:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while processing your request.' });
  }
}

// Export the handleAnimeCommand function


module.exports = { handleAnimeCommand };
