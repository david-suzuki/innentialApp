import React, { useRef, useState, useEffect, useContext } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { currentUserSkillsProfile, updateNeededSkills } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import slug from 'slug'
import {
  Preferences,
  ListSkillSelector,
  DurationPicker,
  Statement,
  LearningPathNewSetting
} from './'
import { Button } from 'element-react'
import { emptyGoalsStyle } from '../../styles/emptyGoalsStyle'
import Container from '../../globalState'
import { Link } from 'react-router-dom'
import { UserContext } from '../../utils'

const EmptyGoal = ({ startPolling, stopPolling }) => {
  const { _id: userId } = useContext(UserContext)
  const { data, loading, error } = useQuery(currentUserSkillsProfile)

  useEffect(() => {
    // XLP CHECKING
    startPolling(1000)

    return () => stopPolling()
  }, [])

  const {
    continued,
    setContinue,
    filters: { durationRanges },
    filtersDispatch
  } = Container.useContainer()

  useEffect(() => {
    if (continued) {
      window.hj &&
        window.hj('identify', userId, {
          'LP completing flow': true
        })
    }
  }, [continued])

  const selectorRef = useRef()
  const [mutate] = useMutation(updateNeededSkills)

  const [dialogVisible, setDialogVisible] = useState(false)

  if (loading) return <LoadingSpinner />

  if (error) return <Statement content='Oops! Something went wrong' />

  if (data) {
    const neededSkills = data?.currentUserSkillsProfile?.neededWorkSkills || []

    const selectorProps = {
      skills: neededSkills,
      preferences: true,
      onSkillsSubmit: async skills => {
        try {
          mutate({
            variables: {
              neededWorkSkills: skills.map(({ _id, skillId, name }) => ({
                _id: skillId || _id,
                slug: slug(name, {
                  replacement: '_',
                  lower: true
                })
              }))
            }
          })
        } catch (err) {
          captureFilteredError(err)
        }
      },
      neededSkillsSelector: true,
      clearState: true,
      forwardRef: selectorRef,
      hideLoading: true
    }

    return (
      <>
        <div className='journey-next-steps__container'>
          <h3>Next step in your learning journey</h3>
          <br />
          <ListSkillSelector {...selectorProps} />
          <Preferences
            skills={neededSkills}
            durationRanges={durationRanges}
            openSkillsSelector={() => {
              if (selectorRef.current) {
                selectorRef.current.toggleVisibility()
              }
            }}
            openDurationSlider={() => setDialogVisible(true)}
          />
          <DurationPicker
            initialValue={durationRanges[0]?.maxHours}
            setDialogVisible={setDialogVisible}
            dialogVisible={dialogVisible}
            setDuration={value =>
              filtersDispatch({
                type: 'SET_FILTER',
                key: 'durationRanges',
                value: [{ minHours: 0, maxHours: value }]
              })
            }
          />
          {!continued && (
            <div
              style={{
                padding: '10px',
                textAlign: 'center'
              }}
            >
              <Button
                type='primary'
                size='large'
                onClick={() => setContinue(true)}
                disabled={neededSkills.length === 0}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
        {continued && <LearningPathNewSetting neededSkills={neededSkills} />}
        <style jsx>{emptyGoalsStyle}</style>
      </>
    )
  }
}

export default EmptyGoal
