import { Post } from './entities/Post'
import { MikroORM } from '@mikro-orm/core'
import path from 'path'
const config = require('config')

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  entities: [Post],
  dbName: 'lireddit',
  user: config.postgreSQLU,
  password: config.postgreSQLP,
  debug: process.env.NODE_ENV !== 'production',
  type: 'postgresql',
} as Parameters<typeof MikroORM.init>[0]
