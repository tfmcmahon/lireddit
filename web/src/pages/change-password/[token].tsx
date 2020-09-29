import React, { useState } from 'react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { Box, Button, Flex, Link } from '@chakra-ui/core'
import { Formik, Form } from 'formik'
import { InputField } from '../../components/InputField'
import { Wrapper } from '../../components/Wrapper'
import { toErrorMap } from '../../utils/toErrorMap'
import { useChangePasswordMutation } from '../../generated/graphql'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../utils/createUrqlClient'

const ChangePassword: NextPage = () => {
  const router = useRouter()
  const [, changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === 'string' ? router.query.token : '',
          })
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ('token' in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(errorMap)
          } else if (response.data?.changePassword.user) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              placeholder='new password'
              label='New Password'
              type='password'
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} color='red'>
                  {' '}
                  {tokenError}
                </Box>
                <NextLink href='/forgot-password'>
                  <Link>Click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type='submit'
              variantColor='teal'
              isLoading={isSubmitting}
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
