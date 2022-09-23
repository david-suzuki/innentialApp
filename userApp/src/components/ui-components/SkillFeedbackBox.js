import React, { useEffect } from 'react'
import { StarBar } from './'
import Container from '../../globalState'

const SkillFeedbackBox = ({ skills, setSkillLevel }) => {
  const { setFrameworkState } = Container.useContainer()

  useEffect(() => {
    setFrameworkState({ visible: true })

    return () => setFrameworkState({ visible: false })
  }, [])

  // const [frameworkState, setFrameworkState] = useState({ frameworkId: null, level: 0, name: "" })

  // const {
  //   frameworkId: selectedFrameworkId,
  //   level: selectedLevel,
  //   name: skillName
  // } = frameworkState

  return (
    <div>
      {skills.map(({ _id, name, frameworkId, level }) => (
        <div style={{ padding: '15px 0' }} key={_id}>
          <StarBar
            name={name}
            level={level}
            updateSkillLevels={setSkillLevel}
            handleHover={(level, skillName) => {
              if (frameworkId) {
                setFrameworkState({
                  visible: true,
                  frameworkId,
                  level,
                  skillName
                })
              } else {
                setFrameworkState({
                  visible: true,
                  frameworkId: 'no_framework',
                  level,
                  skillName
                })
              }
            }}
            handleMouseOut={() =>
              setFrameworkState({
                visible: true,
                frameworkId: null,
                level: 0,
                skillName: ''
              })
            }
          />
        </div>
      ))}
    </div>
  )
}

export default SkillFeedbackBox
