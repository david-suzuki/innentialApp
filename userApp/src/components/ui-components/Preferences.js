import { Layout } from 'element-react'
import React from 'react'

const Preferences = ({
  skills,
  durationRanges = [],
  openSkillsSelector,
  openDurationSlider
}) => {
  const contentStyle = {
    display: 'flex',
    padding: '12px 0 24px 0',
    flexWrap: 'wrap',
    width: '100%'
  }

  const skillsNodes = handleClick => (
    <div style={contentStyle}>
      {skills.map(({ name }) => (
        <div key={name} className='skill-tag'>
          <span>{name}</span>
        </div>
      ))}
      {skills.length === 0 && (
        <p className='list-skill-selector__button-input' onClick={handleClick}>
          Please select a skill to continue
        </p>
      )}
    </div>
  )

  const hoursNode = () => (
    <div
      style={
        (contentStyle,
        { fontSize: '16px', fontWeight: '700', marginRight: '10px' })
      }
    >
      {durationRanges[0]?.maxHours ? `${durationRanges[0]?.maxHours}h` : '0h'}
    </div>
  )

  const layout = (title, content, handleClick, hideChange) => (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <h4 style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>{title}</h4>
        {!hideChange && (
          <div className='preferences-change' onClick={handleClick}>
            Change
          </div>
        )}
      </div>
      {content(handleClick)}
    </>
  )
  return (
    <div
      style={{
        margin: '-25px -24px',
        padding: '25px 24px',
        backgroundColor: 'white',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left'
      }}
    >
      {layout(
        'Your selected skills ',
        skillsNodes,
        openSkillsSelector,
        skills.length === 0
      )}
      {layout('Your learning time per week ', hoursNode, openDurationSlider)}
    </div>
  )
}
//
export default Preferences
