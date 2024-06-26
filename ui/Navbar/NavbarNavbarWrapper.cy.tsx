import React from 'react'
import NavbarWrapper from './Navbar'

describe('<NavbarWrapper />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<NavbarWrapper />)
  })
})