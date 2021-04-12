import React from 'react'
import { render } from '../testUtils'
import { Index } from '../../pages/index'

describe('Index page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Index />, {})
    expect(asFragment()).toMatchSnapshot()
  })
})
