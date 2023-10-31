## Deployment

- nextjs app is deployed on vercel
- there's a cloudflare proxy in front of it (important for headers)
- currently there's a separate nextjs image optimizer deployment on AWS using terraform
  - TODO: learn more about this and tidy up
- mysql on planetscale
- redis on upstash

## Database

### relational db (mysql)

- orm is drizzle (see `schema.ts`)
- migrations are drizzle too (`pnpm db:push`)
- local db is dockerized, simple MYSQL (see [compose file](_infrastructure/docker-compose.yml))

### non-relational db (redis)

- orm is upstash, which needs an http layer
- local is dockerized, simple redis with separate http layer (see [compose file](_infrastructure/docker-compose.yml))

## authentication

- jwt
