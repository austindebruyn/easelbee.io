. /etc/profile
yarn
NODE_ENV=production yarn build
NODE_ENV=production node bin/migrate
pm2 startOrRestart /var/easelbee.io/ecosystem.json --env production
