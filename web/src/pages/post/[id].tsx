import { Box, Heading } from '@chakra-ui/core'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import { EditDeletePostButton } from '../../components/EditDeletePostButton'
import { Layout } from '../../components/Layout'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl'

const Post = ({}) => {
  const router = useRouter()
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{ data, error, fetching }] = useGetPostFromUrl()

  if (fetching) {
    return (
      <Layout>
        <div>...Loading</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    )
  }

  if (!data?.post) {
    return (
      <Layout>
        <div>couldn't find post</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
      <EditDeletePostButton
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
