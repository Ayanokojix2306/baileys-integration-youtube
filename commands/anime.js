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
  try {
    const parts = message.message.conversation.split(' ');

    // Check if an anime name is provided
    if (parts.length < 2) {
      await sock.sendMessage(message.key.remoteJid, { text: 'Please provide an anime name after the command. Example: .anime Naruto' });
      return;
    }
    
    const animeName = parts.slice(1).join(' '); // Join the parts back into the anime name
    const animeInfo = await getAnimeInfo(animeName); // Fetch the anime information

    // Check if the anime information is available
    if (animeInfo) {
      const responseText = `
        **Title:** ${animeInfo.title || 'N/A'}
        **Japanese title:**:${animeInfo.title_japanese || 'N/A'}
        **Type**:${animeInfo.type || 'N/A'}
        **Minutes per episode**:${animeInfo.duration|| 'N/A'}
        **Episodes:** ${animeInfo.episodes || 'N/A'}
        **Score:** ${animeInfo.score || 'N/A'}
        **Status:** ${animeInfo.status || 'N/A'}
        **Synopsis:** ${animeInfo.synopsis || 'N/A'}
        **Image:** ${animeInfo.images?.jpg?.image_url || 'No image available'}
      `;
      // Send the anime details as a text message
      await sock.sendMessage(message.key.remoteJid, { text: responseText });

      // Attempt to send the image
      try {
        await sock.sendMessage(message.key.remoteJid, {
          image: { url: animeInfo.images.jpg.image_url },
          caption: 'Here is the anime image.'
        });
      } catch (imageError) {
        console.error('Error sending anime image:', imageError);
        await sock.sendMessage(message.key.remoteJid, { text: 'Image could not be sent. Please try again later.' });
      }
      
    } else {
      await sock.sendMessage(message.key.remoteJid, { text: 'Anime not found or an error occurred.' });
    }
  } catch (error) {
    console.error('Error handling anime command:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while processing your request. Please try again later.' });
  }
}


module.exports = { handleAnimeCommand };
