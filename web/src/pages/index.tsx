import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useState } from 'react'
import { EditDeletePostButton } from '../components/EditDeletePostButton'
import { Layout } from '../components/Layout'
import { UpvoteSection } from '../components/UpvoteSection'
import { useMeQuery, usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  })
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  })

  if (!fetching && !data) {
    return (
      <div>
        <div>There's nothing here</div>
        <div>{error?.message}</div>
      </div>
    )
  }

  return (
    <Layout>
      {fetching && !data ? (
        <div>...loading</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
                <UpvoteSection post={post} />
                <Box flex={1}>
                  <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize='xl'>{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {post.creator.username}</Text>
                  <Flex align='center'>
                    <Text flex={1} mt={4}>
                      {post.textSnippet}
                    </Text>
                    <Box ml='auto'>
                      <EditDeletePostButton
                        id={post.id}
                        creatorId={post.creator.id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
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
