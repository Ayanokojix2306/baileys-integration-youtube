// config.js
module.exports = {
  SUDO: process.env.SUDO ? process.env.SUDO.split(',') : ['2347017895743'], // Fallback to default if not set
};
