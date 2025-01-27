module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://api.getpaidontheweb.com/:path*',
      },
    ];
  },
};
