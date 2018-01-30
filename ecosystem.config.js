module.exports = {
  apps: [
    {
      name: 'soundcloud-to-youtube',
      script: 'npm',
      args: 'start',
      cron_restart: '*/15 * * * *',
    },
  ],
}
