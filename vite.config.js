export default {
  server: {
    proxy: {
      '/uploads': {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true,
      },
    },
  },
}