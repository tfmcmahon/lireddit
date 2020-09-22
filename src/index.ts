import { MikroORM } from '@mikro-orm/core'
const config = require('config')

const main = async () => {
  const orm = MikroORM.init({
    dbName: 'lireddit',
    user: 'postgres',
    password: config.postgreSQL,
    debug: process.env.NODE_ENV !== 'production',
    type: 'postgresql',
  })
}

main()
