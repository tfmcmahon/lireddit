import { withUrqlClient } from 'next-urql'
import { Fragment } from 'react'
import { NavBar } from '../components/NavBar'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
  const [{ data }] = usePostsQuery()
  return (
    <Fragment>
      <NavBar />
      <div>Hello test</div>
      <br />
      {!data ? (
        <div>...loading</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </Fragment>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
