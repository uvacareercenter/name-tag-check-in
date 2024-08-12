# Server Setup

This should provide an overview of how to configure dependencies / startup tasks for running event-interaction-tracker on the office server (running Windows Server).

## Tool Setup

1. Install Chocolatey (https://chocolatey.org/install). This is a great package manager for Windows that I used to install all the others tools.
2. Install Git: `choco install git`
3. Install Node.js (currently v14.15.5): `choco install nodejs-lts`
4. Install Nodepad++ (not necessary, just a helpful tool for me): `choco install nodepadplusplus`
5. Install the GitHub CLI: `choco install gh`
6. Close + open a new administrative command prompt (so the newly installed tools are in PATH)
7. Authenticate Git with the `uvacareercenter` user: `gh auth login`

## Prepare HTTPS certificate

Our production HTTPS certificates are issued by Let's Encrypt and managed by certbot. You can follow [their instructions](https://certbot.eff.org/instructions?ws=other&os=windows) to configure a local certificate and scheduled renewal job. Note the file locations of certificate `fullchain.pem`, key `privkey.pem` and certificate `cert.pem` for later.

## Prepare the server

1. cd into the parent directory of where you'd like the server files to live (have been using "C:\Users\Manwe")
2. Clone the repository from GitHub: `git clone https://github.com/uvacareercenter/event-interaction-tracker`. This will prompt a login dialog - enter the generated personal access token.
3. cd into the cloned repo
4. Run `npm install` to install server dependencies. These may already be present from a migration but npm will skip this step if so.
5. Run `npm run build` to build the frontend (required after any repo changes)
6. Copy `.env.example` to a new `.env` file and complete with the necessary credentials:
   1. Auth0 values can be obtained from the admin dashboard (login credentials are on our network drive)
   2. `HTTPS_KEY_FILE` should be `C:/Certbot/live/uvacc.eservices.virginia.edu/privkey.pem` (or whatever was provided by certbot)
   3. `HTTPS_CERT_FILE` should be `C:/Certbot/live/uvacc.eservices.virginia.edu/cert.pem`
   4. `HTTPS_CA_FILE` should be `C:/Certbot/live/uvacc.eservices.virginia.edu/chain.pem`
7. Test by running `npm start` - should start as expected! Control+C to exit.

## Configure PM2 for Node startup on server boot

1. Create a `C:\pm2` directory and set a system environment variable of `PM2_HOME` with a value of `C:\pm2`. This will hold the PM2 configuration.
2. Instal PM2: `npm install -g pm2`
3. cd into the repo directory and run `pm2 start`
4. Running `pm2 status` should show the process is alive and connections should be accepted.
5. If all is well, run `pm2 save` (should indicate it was saved to `C:\pm2`, _not_ `C:\Users\Manwe\.pm2`)
6. Open Task Scheduler and create a new task with the following options:
   1. Choose "Run whether user is logged on or not"
   2. Choose "Run with highest privileges"
   3. The trigger should be "At system startup"
   4. The action should be "Start a program". The program/script is the path to pm2 which can be obtained by running `where pm2`. The argument is just `resurrect`.
