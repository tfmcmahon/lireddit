import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { Post } from './entities/Post'
import path from 'path'
import { Upvote } from './entities/Upvote'
import { createUserLoader } from './utils/createUserLoader'
import { createUpvoteLoader } from './utils/createUpvoteLoader'

const config = require('config')

//reruna
const main = async () => {
  const connection = await createConnection({
    type: 'postgres',
    database: 'lireddit2',
    username: config.postgreSQLU,
    password: config.postgreSQLP,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Post, User, Upvote],
  })

  await connection.runMigrations()
  //await Post.delete({})

  const app = express()

  const RedisStore = connectRedis(session)
  const redis = new Redis(config.redisURL)
  app.set('trust proxy', 1)
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )
  app.use(
    session({
      name: config.cookieName,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', //cookie only works in https
        domain: undefined,
      },
      saveUninitialized: false,
      secret: config.redisSecret,
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      upvoteLoader: createUpvoteLoader(),
    }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })

  app.listen(4000, () => {
    console.log('server start on 4000')
  })
}

main().catch((err) => {
  console.error(err)
})
