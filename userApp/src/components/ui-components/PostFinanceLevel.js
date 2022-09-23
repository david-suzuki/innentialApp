import React from 'react'

const levels = [' - ', 'Zu wenig', 'Wenig', 'Stark', 'Übertrieben', ' - ']

const PostFinanceLevel = ({ level = 5 }) => {
  return (
    <>
      <span className='skills-framework__level-display'>{levels[level]}</span>
      <style>{`
        .skills-framework__level-display {
          font-size: 13px;
          font-weight: bold;
        }
      `}</style>
    </>
  )
}

export default PostFinanceLevel
