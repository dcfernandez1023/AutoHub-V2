# Autohub V2

Autohub V2 is a web app for users to track and manage the maintenance, repairs, and various info about their cars.

## Overview

This repo contains the source code for client and server.

`/client` contains the React app

`/server` contains the Node.js Express app

## Local Development

### Basic Local Setup

#### Environment vars:

- Create `.env.dev`
- Variables:
  - DATABASE_URL
  - DIRECT_URL
  - EMAIL_USER
  - EMAIL_PASS
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - ALLOWED_EMAILS_FOR_REGISTRATION

#### Start client and server:

- `npm install` to install deps
- `npm run prisma:generate` to generate types
- `npm run start` in `/client` to start React app
- `npm run dev` in `/server` to start Express app
- Client runs at `localhost:3000`
- Server runs at `localhost:5000`

### Docker

#### Environment vars:

- Create `.env.prod`
- Variables:
  - DATABASE_URL
  - DIRECT_URL
  - EMAIL_USER
  - EMAIL_PASS
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - ALLOWED_EMAILS_FOR_REGISTRATION

#### Build image and start container:

- `docker compose up --build -d`
- Application running at `localhost:5000`

#### Stop container:

- ` docker compose down`

### K8s (with Vagrant + VirtualBox)

Setting up VMs:

- `vagrant up` to start up VirtualBox VMs
- `vagrant status` to ensure VMs were created

Additional steps in progress...
