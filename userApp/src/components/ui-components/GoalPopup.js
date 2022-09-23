import React, { useEffect, useState } from 'react'
import { Button, Select, Dialog, Notification } from 'element-react'
import { captureFilteredError } from '../general'
// import Autosuggest from 'react-autosuggest'
import { useQuery, useMutation } from 'react-apollo'
import { addContentToActiveGoal, fetchUserGoals } from '../../api'
import { BodyPortal } from './'
import Container from '../../globalState'
import { Link, useHistory } from 'react-router-dom'

const GoalPopup = () => {
  const [selectedGoal, setSelectedGoal] = useState('')
  // const [canMutate, setCanMutate] = useState(true) // DEBOUNCE TO PREVENT DOUBLE-MUTATING

  const { data, loading: loadingGoals, error } = useQuery(fetchUserGoals)

  const {
    addedContent,
    setAddedContent,
    isAddingToGoal,
    setAddingToGoal,
    setAddedContentLoading
  } = Container.useContainer()

  const [mutation, { loading }] = useMutation(addContentToActiveGoal)

  const history = useHistory()

  useEffect(() => {
    setAddedContentLoading(loading)
  }, [loading, setAddedContentLoading])

  useEffect(() => {
    if (data) {
      const activeGoals = data.fetchUserGoals.filter(
        goal => goal.status === 'ACTIVE'
      )
      if (activeGoals.length === 0 && addedContent) {
        const { contentId } = addedContent
        history.push('/goal/new', { contentId })
        setAddingToGoal(false)
        setAddedContent(null)
      }
    }
  }, [data, addedContent, setAddingToGoal, setAddedContent])

  if (loadingGoals) return null

  if (error) {
    captureFilteredError(error)
    return null
  }

  const goals = data?.fetchUserGoals || []

  const filterGroups = []

  goals.forEach(goal => {
    const findGroup = group =>
      group.every(g => g.fromPath && g.fromPath._id === goal.fromPath._id)

    if (goal.fromPath) {
      const existingGroup = filterGroups.find(findGroup)
      if (existingGroup) {
        const ix = filterGroups.findIndex(findGroup)
        filterGroups.splice(ix, 1, [...existingGroup, goal])
        return
      }
    }
    filterGroups.push([goal])
  })

  if (filterGroups.length === 0) {
    filterGroups.push(goals)
  }

  const filterOptions = filterGroups
    .filter(group => group.some(({ status }) => status === 'ACTIVE'))
    .map((group, ix) => {
      const isPath = group.some(({ fromPath }) => !!fromPath)
      const activeGoals = group.filter(({ status }) => status === 'ACTIVE')

      const firstActiveGoal = isPath
        ? activeGoals.some(({ isSelectedGoal }) => isSelectedGoal)
          ? activeGoals.find(({ isSelectedGoal }) => isSelectedGoal)
          : activeGoals.reduce((acc, { learningPathIndex, ...rest }) => {
              if (acc.learningPathIndex > learningPathIndex) {
                return {
                  learningPathIndex,
                  ...rest
                }
              }
              return acc
            }, activeGoals[0])
        : activeGoals[0]

      const name = !isPath
        ? firstActiveGoal.goalName
        : firstActiveGoal.fromPath.name

      return {
        _id: firstActiveGoal._id,
        goals: group,
        name
      }
    })

  const selectOptions = filterOptions.map(({ _id, name }, ix) => (
    <Select.Option key={ix} value={_id} label={name}>
      {name}
    </Select.Option>
  ))

  if (selectOptions.length === 0) return null

  // if (activeGoals.length < 2) return null

  // const selectOptions = activeGoals.map(goal => (
  //   <Select.Option value={goal._id} label={goal.goalName} key={goal._id} />
  // ))

  return (
    <BodyPortal>
      <Dialog
        visible={isAddingToGoal}
        onCancel={() => {
          setSelectedGoal('')
          setAddingToGoal(false)
        }}
      >
        <Dialog.Body>
          <p className='share-content__title'>Add content to path</p>
          <div className='select-autosuggest-in-modal'>
            <Select
              value={selectedGoal}
              onChange={value => setSelectedGoal(value)}
              placeholder='Pick a path...'
            >
              {selectOptions}
            </Select>
          </div>
          <div className='align-center'>
            <p style={{ margin: '10px 0px' }}>or</p>
            <Link
              to={{
                pathname: '/goal/new',
                state: {
                  contentId: addedContent?.contentId
                }
              }}
            >
              <Button
                type='primary'
                size='large'
                onClick={() => {
                  setAddingToGoal(false)
                  setSelectedGoal('')
                  setAddedContent(null)
                }}
              >
                Create a new path
              </Button>
            </Link>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            type='primary'
            disabled={!selectedGoal}
            loading={loading}
            onClick={() => {
              if (selectedGoal && addedContent) {
                const {
                  contentId,
                  price,
                  type,
                  subscriptionAvailable
                } = addedContent
                mutation({
                  variables: {
                    contentId,
                    price,
                    type,
                    goalId: selectedGoal,
                    subscriptionAvailable
                  }
                })
                  .then(() =>
                    Notification({
                      type: 'success',
                      message: 'Added to learning list',
                      duration: 2500,
                      offset: 90
                    })
                  )
                  .catch(err => {
                    captureFilteredError(err)
                    Notification({
                      type: 'warning',
                      message: 'Oops! Something went wrong',
                      duration: 2500,
                      offset: 90
                    })
                  })
                  .finally(() => {
                    setAddingToGoal(false)
                    setSelectedGoal('')
                    setAddedContent(null)
                  })
              }
            }}
          >
            Add
          </Button>
        </Dialog.Footer>
      </Dialog>
    </BodyPortal>
  )
}

export default GoalPopup
