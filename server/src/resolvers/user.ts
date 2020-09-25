import { User } from '../entities/User'
import { MyContext } from '../types'
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
  Query,
} from 'type-graphql'
import argon2 from 'argon2'
import { EntityManager } from '@mikro-orm/postgresql'
const config = require('config')

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null
    }

    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Length bust be greater than 2',
          },
        ],
      }
    }

    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Length bust be greater than 3',
          },
        ],
      }
    }

    const hashedPassword = await argon2.hash(options.password)
    let user
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('*')

      user = result[0]
    } catch (error) {
      if (error.detail.includes('already exists')) {
        return {
          errors: [
            {
              field: 'username',
              message: 'Username already exists',
            },
          ],
        }
      }
    }

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username })

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Invalid login',
          },
        ],
      }
    }

    const valid = await argon2.verify(user.password, options.password)

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Invalid login',
          },
        ],
      }
    }

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(config.cookieName)
        if (err) {
          console.log(err)
          resolve(false)
          return
        }

        resolve(true)
      })
    )
  }
}
