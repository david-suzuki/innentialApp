import React from 'react'
import { useMutation } from 'react-apollo'
import ApolloCacheUpdater from 'apollo-cache-updater'
import { Button, Message, MessageBox } from 'element-react'
import { fetchInnentialLearningPaths } from '../../../api'

export default ({ formRef, form, goBack, mutation }) => {
  const create = !form._id
  const mutationKey = create ? 'createLearningPath' : 'updateLearningPath'

  const [save, { loading }] = useMutation(mutation, {
    update: (proxy, { data: { [mutationKey]: mutationResult = {} } }) => {
      // your mutation response
      const updates = ApolloCacheUpdater({
        proxy, // apollo proxy
        queriesToUpdate: [fetchInnentialLearningPaths],
        searchVariables: {},
        mutationResult,
        ID: '_id'
      })
      if (updates) {
        const message = !create ? 'Successfully updated' : 'Successfully added'
        Message({
          type: 'success',
          message
        })
      }
      goBack()
    }
  })

  const submitForm = updateExisting => {
    const {
      _id,
      __typename,
      imageLink,
      authorImageLink,
      authorCompanyLogoImageLink,
      updatedAt,
      goalTemplates = [],
      organizationId,
      ...input
    } = form

    const variables = {
      input: {
        ...input,
        id: _id,
        paid: goalTemplates.some(({ content }) =>
          content.some(({ price }) => price.value > 0)
        ),
        organizationId,
        hasContent: goalTemplates.some(({ content }) => content.length > 0),
        goalTemplate: goalTemplates.map(goal => {
          const {
            _id,
            __typename,
            relatedSkills: rawSkills = [],
            updatedAt,
            content: rawContent = [],
            ...data
          } = goal
          const relatedSkills = rawSkills
            .map(raw => {
              if (
                !raw.value ||
                !Array.isArray(raw.value) ||
                raw.value.length < 2
              )
                return null
              return raw.value[1]
            })
            .filter(value => !!value)
          const content = rawContent
            .map(({ _id: contentId, note }, ix) => ({
              contentId,
              note,
              order: ix + 1
            }))
            .sort((a, b) => {
              return a.order - b.order
            })
          return {
            ...data,
            relatedSkills,
            content,
            id: _id
          }
        }),
        skills: goalTemplates.reduce((acc, { relatedSkills }) => {
          const array = []
          relatedSkills.forEach(({ value = [] }) => {
            if (value.length === 2) {
              const [category, _id] = value // eslint-disable-line
              if (!array.some(skillId => _id === skillId)) array.push(_id)
            }
          })
          return [...acc, ...array]
        }, [])
      },
      ...(!create && { updateExisting })
    }

    save({ variables }).catch(e => {
      const message =
        e && e.graphQLErrors && e.graphQLErrors[0]
          ? `${e.graphQLErrors[0].message}`
          : 'Error'
      Message({
        type: 'error',
        message
      })
    })
  }
  return (
    <Button
      type='primary'
      size='large'
      loading={loading}
      onClick={e => {
        e.preventDefault()
        formRef.current.validate(async valid => {
          if (valid) {
            let updateExisting = false
            if (!create) {
              try {
                await MessageBox.confirm(
                  'Note: not all of the changes can be propagated later if you select "No"',
                  'Propagate any changes to existing paths?',
                  {
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    type: 'warning',
                    showClose: false
                  }
                )
                updateExisting = true
              } catch (err) {}
            }
            submitForm(updateExisting)
          }
        })
      }}
    >
      Submit
    </Button>
  )
}
