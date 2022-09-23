import React from 'react'
import pageStyle from '../../styles/pageStyle'

const Page = ({ children, development, lessPadding }) => {
  return (
    <div
      className={
        development
          ? 'page-container development-plan'
          : lessPadding
          ? 'page-container less-padding'
          : 'page-container'
      }
    >
      {children}
      <style jsx>{pageStyle}</style>
    </div>
  )
}

export default Page
