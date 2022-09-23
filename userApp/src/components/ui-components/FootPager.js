import React from 'react'
import pagerStyle from '../../styles/pagerStyle'

const FootPager = props => {
  const { screenList, currentScreen } = props
  const screenPager = screenList.map((s, index) => (
    <li
      key={index}
      className={
        index === currentScreen
          ? 'footer-pager-item--active'
          : 'footer-pager-item'
      }
    />
  ))
  return (
    <div>
      <div>
        <ul className='footer-pager'>{screenPager}</ul>
      </div>
      <style jsx>{pagerStyle}</style>
    </div>
  )
}

export default FootPager
