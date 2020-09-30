import { Flex, IconButton } from '@chakra-ui/core'
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface UpvoteSectionProps {
  post: PostSnippetFragment
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading')
  const [, vote] = useVoteMutation()
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        icon='chevron-up'
        aria-label='upvote post'
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
        isLoading={loadingState === 'upvote-loading'}
        onClick={async () => {
          if (post.voteStatus === 1) return
          setLoadingState('upvote-loading')
          await vote({
            postId: post.id,
            value: 1,
          })
          setLoadingState('not-loading')
        }}
      />
      {post.points}
      <IconButton
        icon='chevron-down'
        aria-label='downvote post'
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
        isLoading={loadingState === 'downvote-loading'}
        onClick={async () => {
          if (post.voteStatus === -1) return
          setLoadingState('downvote-loading')
          await vote({
            postId: post.id,
            value: -1,
          })
          setLoadingState('not-loading')
        }}
      />
    </Flex>
  )
}
