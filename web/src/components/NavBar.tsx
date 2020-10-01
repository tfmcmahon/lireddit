import { Box, Link, Flex, Button, Heading } from '@chakra-ui/core'
import React, { Fragment } from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })
  let body = null

  //data loading
  if (fetching) {
  } else if (!data?.me) {
    //user not logged in
    body = (
      <Fragment>
        <NextLink href='/login'>
          <Link color='white' mr={4}>
            login
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link color='white'>Register</Link>
        </NextLink>
      </Fragment>
    )
  } else {
    //user is logged in
    body = (
      <Flex>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          onClick={() => logout()}
          variant='link'
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex bg='tan' p={4} position='sticky' top={0} zIndex={1} align='center'>
      <NextLink href='/'>
        <Link>
          <Heading>LiReddit</Heading>
        </Link>
      </NextLink>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  )
}
