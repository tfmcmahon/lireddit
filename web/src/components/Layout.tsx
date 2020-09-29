import React, { Fragment } from 'react'
import { NavBar } from './NavBar'
import { Wrapper, WrapperVariant } from './Wrapper'

interface LayoutProps {
  variant?: WrapperVariant
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <Fragment>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </Fragment>
  )
}
