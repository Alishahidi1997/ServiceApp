module.exports = {
  apps: [{
    name: 'cpsc671-hw-problem9',
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
