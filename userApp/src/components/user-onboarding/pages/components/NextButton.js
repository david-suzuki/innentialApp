import React from 'react'
import { ReactComponent as ArrowIcon } from '../../../../static/chevron-right.svg'

const NextButton = ({ signUp, label = 'Next' }) => (
  <>
    <div className='bottom-nav__button-next'>{label}</div>
    <ArrowIcon />
  </>
)

export default NextButton
