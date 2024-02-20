module.exports = {
  apps: [{
    name: 'serviceApp',
    script: 'index.js',

    instances: 1,
    autorestart: false,
    watch: 'src/server',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
