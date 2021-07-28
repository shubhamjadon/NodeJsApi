const baseConfig = {
  port: 4000,
  secrets: {
    jwt: 'als;kjd2849',
    jwtExp: '1d',
  },
  dbUrl: 'mongodb://localhost:27017/test',
};

module.exports = baseConfig;
