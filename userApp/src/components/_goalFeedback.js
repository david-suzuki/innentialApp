import React, { useState, useEffect } from 'react'
import { Button, MessageBox, Notification } from 'element-react'
import { GoalItemDashboard, SkillFeedbackBox } from './ui-components'
import { useMutation, useQuery } from 'react-apollo'
import { assessSkills, currentUserSkillsProfile } from '../api'
import { useHistory, useLocation, Redirect } from 'react-router-dom'
import { captureFilteredError, LoadingSpinner } from './general'
import slug from 'slug'

const GoalFeedback = ({ initialSkills, callback }) => {
  const [skills, setSkills] = useState(initialSkills ? initialSkills : [])

  const setSkillLevel = (name, level) => {
    setSkills(
      skills.map(skill => {
        if (skill.name === name) {
          return {
            ...skill,
            level
          }
        }
        return skill
      })
    )
  }

  const [mutate, { loading }] = useMutation(assessSkills)

  // useEffect(() => {
  //   const mainWrapper = document.getElementById('main-wrapper')

  //   if (!mainWrapper.classList.contains('wrapper--right')) {
  //     mainWrapper.className = 'container-main__wrapper wrapper--right'
  //   }

  //   const clearClasses = main => {
  //     main.className = 'container-main__wrapper'
  //   }

  //   return () => clearClasses(mainWrapper)
  // })

  return (
    <>
      <div className='component-block'>
        <SkillFeedbackBox skills={skills} setSkillLevel={setSkillLevel} />
      </div>
      <div className='page-footer'>
        <Button
          type='text'
          onClick={() => {
            callback(false)
          }}
        >
          Skip
        </Button>
        <Button
          type='primary'
          loading={loading}
          onClick={async () => {
            try {
              await mutate({
                variables: {
                  skills: skills
                    .filter(({ level }) => !isNaN(level))
                    .map(({ _id, name, level }) => ({
                      _id,
                      slug: slug(name, {
                        replacement: '_',
                        lower: true
                      }),
                      level
                    }))
                }
              })
              // setDialogVisible(false)
              callback(true)
            } catch (err) {
              captureFilteredError(err)
            }
          }}
        >
          Submit
        </Button>
      </div>
    </>
  )
}

const GoalFeedbackPage = ({ currentUser }) => {
  const history = useHistory()
  const { state = {} } = useLocation()

  const { data, loading, error } = useQuery(currentUserSkillsProfile, {
    fetchPolicy: 'cache-and-network'
  })

  if (!state) return <Redirect to='/' />

  if (loading) return <LoadingSpinner />

  if (error) return <Redirect to='/error-page/500' />

  const { selectedWorkSkills = [] } = data?.currentUserSkillsProfile

  const { skills: initialSkills, finishedPath, result } = state

  const skillsWithLevel = initialSkills
    ? initialSkills.map(skill => {
        const existingSkill = selectedWorkSkills.find(
          ({ skillId }) => skillId === skill._id
        )
        if (existingSkill) {
          return {
            ...skill,
            level: existingSkill.level
          }
        }
        return skill
      })
    : []

  const callback = () => {
    if (finishedPath) {
      history.replace('/finished-path', { path: finishedPath })
    } else history.replace('/')
  }

  return (
    <>
      <div className='page-heading'>
        <div className='page-heading-info'>
          <h1>Congratulations on completing your goal!</h1>
        </div>
      </div>
      <GoalItemDashboard {...result} completed />
      <h3>Have your skills improved?</h3>
      <h4>
        Accurate data will provide you with better learning recommendations
      </h4>
      <br />
      <GoalFeedback initialSkills={skillsWithLevel} callback={callback} />
      <style>{`
        .registration-box
          > .el-message-box
          > .el-message-box__content
          > .el-message-box__status {
            font-size: 45px !important;
            margin-left: 15px
        }
      `}</style>
    </>
  )
}

export default GoalFeedbackPage
