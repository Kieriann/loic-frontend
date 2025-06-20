require('dotenv').config()

module.exports = {
  server: {
    proxy: {
      '/uploads': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
      },
    },
  },
}
