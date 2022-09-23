import { Layout } from 'element-react'
import { useHistory } from 'react-router-dom'
import React from 'react'
import { useGA4React } from 'ga-4-react'

const Preferences = ({ container, routeState }) => {
  const ga = useGA4React()

  const {
    onboardingState: { neededWorkSkills: skills, survey },
    filters: { durationRanges = [] }
  } = container.useContainer()

  const history = useHistory()

  const contentStyle = {
    display: 'flex',
    padding: '12px 0 24px 0',
    flexWrap: 'wrap'
  }
  const skillsNodes = (
    <div style={contentStyle}>
      {skills.map(({ name }) => (
        <div key={name} className='onboarding__skill-tag'>
          <span>{name}</span>
        </div>
      ))}
    </div>
  )

  const hoursNode = (
    <div
      style={
        (contentStyle,
        { fontSize: '16px', fontWeight: '700', marginRight: '10px' })
      }
    >{`${durationRanges[0]?.maxHours || 1}h`}</div>
  )

  const layout = (title, content, pathname) => (
    <Layout.Col span='24'>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between'
        }}
      >
        <h4 style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>{title}</h4>
        <div
          className='preferences-change'
          onClick={() => {
            ga && ga.gtag('event', 'changed_learning_preferences')
            window.analytics &&
              window.analytics.track('changed_learning_preferences')
            history.replace(pathname, { ...routeState, backToDevPlan: true })
          }}
        >
          Change
        </div>
      </div>
      {content}
    </Layout.Col>
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
        alignItems: 'flex-start'
      }}
    >
      {layout(
        'Your selected skills ',
        skillsNodes,
        survey
          ? '/onboarding/survey-completed'
          : '/onboarding/skill-preferences'
      )}
      {layout(
        'Your learning time per week ',
        hoursNode,
        '/onboarding/learning-preferences'
      )}
    </div>
  )
}
//
export default Preferences
