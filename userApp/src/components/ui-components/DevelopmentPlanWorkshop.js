import React from 'react'

export default ({
  title,
  author,
  startDate,
  selected,
  onSelect = function() {},
  price,
  url,
  mainTags = [],
  secondaryTags = [],
  status,
  endDate
}) => {
  const isPaid = price.value > 0
  return (
    <div
      className={`development-plan__workshop development-plan__workshop--selectable ${!selected &&
        'not-selected-workshop'}`}
    >
      <div className='development-plan__workshop-wrapper'>
        <div className='development-plan__info'>
          {isPaid && (
            <div className='development-plan__workshop-paid'>Paid</div>
          )}
          <div className='development-plan__workshop-heading'>
            <a href={url} target='_bblank'>
              {title}
            </a>
          </div>
          {author && (
            <div className='development-plan__workshop-name'>{author}</div>
          )}
          {startDate && (
            <div className='development-plan__workshop-date'>
              {new Date(startDate).toLocaleString('en-GB', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}
            </div>
          )}
        </div>
        <div className='development-plan__workshop-caption'>
          {mainTags.length > 0 &&
            mainTags.map((skill, ix) => (
              <div
                key={`maintag${ix}`}
                className='development-plan__workshop-skill-tag development-plan__workshop-skill-tag--main'
              >
                {skill.name}
              </div>
            ))}
          {secondaryTags.length > 0 &&
            secondaryTags.map((skill, ix) => (
              <div
                key={`secondtag${ix}`}
                className='development-plan__workshop-skill-tag'
              >
                {skill.name}
              </div>
            ))}
        </div>
      </div>
      {status && status === 'COMPLETED' && endDate ? (
        <div
          className='development-plan__workshop-icons'
          style={{ cursor: 'default' }}
        >
          <p>Completed: {new Date(endDate).toDateString()}</p>
        </div>
      ) : (
        <div className='development-plan__workshop-icons' onClick={onSelect}>
          <i
            className={`icon ${selected ? 'el-icon-minus' : 'el-icon-plus'}`}
          />
        </div>
      )}
    </div>
  )
}
