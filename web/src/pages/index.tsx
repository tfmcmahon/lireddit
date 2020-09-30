import { withUrqlClient } from 'next-urql'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import {
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Icon,
  IconButton,
} from '@chakra-ui/core'
import NextLink from 'next/link'
import { useState } from 'react'
import { UpvoteSection } from '../components/UpvoteSection'

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  })
  const [{ data, fetching, ...other }] = usePostsQuery({
    variables,
  })

  if (!fetching && !data) {
    return <div>There's nothing here</div>
  }

  return (
    <Layout>
      <Flex align='center'>
        <Heading>LiReddit</Heading>
        <NextLink href='/create-post'>
          <Link ml='auto'>Create post</Link>
        </NextLink>
      </Flex>
      <br />
      {fetching && !data ? (
        <div>...loading</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
              <UpvoteSection post={post} />
              <Box>
                <Heading fontSize='xl'>{post.title}</Heading>
                <Text>posted by {post.creator.username}</Text>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }}
            isLoading={fetching}
            m='auto'
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
