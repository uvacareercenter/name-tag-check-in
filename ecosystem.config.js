module.exports = {
  apps: [
    {
      name: 'Event Interaction Tracker',
      script: 'app.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
