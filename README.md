# ZapChat
ZapChat, NoDB real-time messaging service made in NodeJS

## Overview

ZapChat allows users to exchange messages in real-time over the internet. It's designed for simplicity, ease of use, and privacy.


## Setting up

**Requirements:**
- NodeJS v18 or above is recommended. Not tested on older versions.
- npm v9 or above is recommended. Not tested on older versions.
- Minimum of 20Mib Storage for all the packages that are installed.
- *Not required:* Preferrably pm2, to keep the service alive.

## Starting the service

*ZapChat has a help command built in, accessed via `npm run help`.*

- Install all packages via `npm install`
- *Additional Step:* Check the help section via `npm run help`
- Start the service via `npm run live`

The service should now be live on port 8000. If you have an environment variable which defines which port to be used (via `process.env.port`) - the service will be live on that port instead.

Using pm2 to keep the process alive is recommended, although chat will get purged often.

ZapChat is licensed under the MiT Licence by [3ux4 (aka "Isabella" or "BellaGhxst")](https://github.com/3ux4)
