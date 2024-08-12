Ultimate Twitter REST API Clone Project
=======================================
This project is a clone of the Twitter REST API. The project is built using Bun, Hono, and Postgres.js.

TASKS :
-------
- [x] Setup Project
- [x] Script to migrate database
- [x] Script to seed database
- [x] Script to generate modules
- [x] Script to generate typescript types from pg tables
- [x] User Module
- [x] Auth module : Google Authentication
- [x] Tweets Module
- [x] Polls Module
- [x] Likes and comments Module
- [x] Direct Message Module
- [x] Follow Module
- [x] Mention Module
- [x] Search Module
- [ ] Trending Module
- [x] Hashtags & Mention Module
- [ ] Feeds Module
- [x] Caching (w @aiven/redis)
- [x] Setup Logger (w winston)
- [x] Setup Health Monitoring
- [x] Setup Metrics & Logs Monitoring (w prometheus, grafana, loki )
- [ ] Ratelimiting (w rate-limiter-flexible)
- [x] Email Feature
- [ ] Setup BullMQ for background jobs
- [ ] Setup CRON jobs

## Running the project locally

- Clone the project
- Run `docker compose up -d`
- replace .env.example with .env.local
- Update the .env.local file with your database and other credentials
- Run `bun install`
- Run `bun db:migrate all`
- Run `bun db:generate`
- Run `bun db:seed`
- Run `bun start`

## Building the docker image
- Run `docker build -t twitter-api .`
- Run `docker run -p 3000:3000 twitter-api`
