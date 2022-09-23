import React from 'react'
import { Query } from 'react-apollo'
import { fetchOrganizationSkillFrameworks } from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'
import skillsFrameworkStyle from '../../styles/skillsFrameworkStyle'
import SkillsFrameworkStarIcon from '../../components/ui-components/SkillsFrameworkStarIcon'
import { withRouter } from 'react-router-dom'
import Container from '../../globalState'

export const SkillsFrameworkListStars = ({ level, customClassName }) => (
  <div className={customClassName || 'skills-framework__list-stars'}>
    {[...Array(level).keys()].map(item => (
      <SkillsFrameworkStarIcon key={item} />
    ))}
  </div>
)

export const SkillsFrameworkTextNodes = ({
  skillName,
  level,
  levelTexts,
  corporate
}) => (
  <div className='skills-framework'>
    <div>
      <span className='skills-framework__title-category'>{skillName}</span>{' '}
      <span className='skills-framework__title-label'>
        experience guidelines
      </span>
    </div>
    <ul className='skills-framework__list'>
      {Object.entries(levelTexts)
        .filter(([key, value]) => key !== '_id' && key !== '__typename')
        .slice(0, corporate ? 4 : undefined)
        .map(([key, value], i) => {
          return (
            <li
              key={key}
              className={`skills-framework__list__item ${
                level >= i + 1
                  ? 'skills-framework__list__item--prev-selected'
                  : ''
              } ${
                level === i + 1 ? 'skills-framework__list__item--selected' : ''
              }`}
            >
              <SkillsFrameworkListStars level={i + 1} /> {value}
            </li>
          )
        })}
    </ul>
    <style jsx>{skillsFrameworkStyle}</style>
  </div>
)

export const SkillsFrameworkOnboarding = ({
  frameworkId,
  selectedLevel,
  skillName
}) => (
  <Query query={fetchOrganizationSkillFrameworks}>
    {({ data, loading, error }) => {
      if (loading) return <LoadingSpinner />
      if (error) {
        captureFilteredError(error)
        return null
      }
      if (data) {
        // if (!frameworkId) {
        //   return (
        //     <div className="skills-framework">
        //       <h4 className="skills-framework__title-category">
        //         Skills framework
        //       </h4>
        //       <div className="skills-framework__title-label">
        //         Hover over a certain skill level to see the details of the
        //         levelling criteria.
        //       </div>
        //       <style jsx>{skillsFrameworkStyle}</style>
        //     </div>
        //   )
        // }

        const frameworkData = data.fetchOrganizationSkillFrameworks
        const selectedFramework = frameworkData.find(
          framework => framework._id === frameworkId
        )

        if (selectedFramework) {
          const { /* categoryName, */ levelTexts } = selectedFramework
          return (
            <div
              style={{
                backgroundColor: '#f6f8fc',
                padding: '1rem',
                borderRadius: '4px'
              }}
              className='skills-framework'
            >
              <div>
                <span className='skills-framework__title-category'>
                  {skillName}
                </span>{' '}
                <span className='skills-framework__title-label'>
                  experience guidelines
                </span>
              </div>
              <ul className='skills-framework__list'>
                {Object.entries(levelTexts)
                  .filter(
                    ([key, value]) => key !== '_id' && key !== '__typename'
                  )
                  .map(([key, value], i) => {
                    return (
                      <li
                        key={key}
                        className={`skills-framework__list__item ${
                          selectedLevel >= i + 1
                            ? 'skills-framework__list__item--prev-selected'
                            : ''
                        } ${
                          selectedLevel === i + 1
                            ? 'skills-framework__list__item--selected'
                            : ''
                        }`}
                      >
                        <SkillsFrameworkListStars level={i + 1} /> {value}
                      </li>
                    )
                  })}
              </ul>
              <style jsx>{skillsFrameworkStyle}</style>
            </div>
          )
        }
        // else {
        //   return (
        //     <div className="skills-framework">
        //       <div>
        //         <span className="skills-framework__title-label">
        //           No levelling guidelines yet specified for
        //         </span>{' '}
        //         <span className="skills-framework__title-category">
        //           {skillName}
        //         </span>
        //       </div>
        //       <style jsx>{skillsFrameworkStyle}</style>
        //     </div>
        //   )
        // }
      }
      return null
    }}
  </Query>
)

export const SkillsFramework = withRouter(({ currentUser }) => {
  const container = Container.useContainer()

  const { corporate } = currentUser

  const { frameworkState } = container

  const { visible } = frameworkState

  if (visible) {
    const { frameworkId, level, skillName } = frameworkState
    return (
      <Query query={fetchOrganizationSkillFrameworks}>
        {({ data, loading, error }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return null
          }
          if (data) {
            // if (!focusedSkillFrameworkId) {
            //   return (
            //     <div className="skills-framework">
            //       <h4 className="skills-framework__title-category">
            //         Skills framework
            //     </h4>
            //       <div className="skills-framework__title-label">
            //         Hover over a certain skill level to see the details of the
            //         levelling criteria.
            //     </div>
            //       <style jsx>{skillsFrameworkStyle}</style>
            //     </div>
            //   )
            // }

            const frameworkData = data.fetchOrganizationSkillFrameworks
            const selectedFramework = frameworkData.find(
              framework => framework._id === frameworkId
            )

            if (selectedFramework) {
              const { /* categoryName, */ levelTexts } = selectedFramework
              return (
                <SkillsFrameworkTextNodes
                  skillName={skillName}
                  level={level}
                  levelTexts={levelTexts}
                  corporate={corporate}
                />
              )
            }
            // else {
            //   return (
            //     <div className="skills-framework">
            //       <div>
            //         <span className="skills-framework__title-label">
            //           No levelling guidelines yet specified for
            //         </span>{' '}
            //         <span className="skills-framework__title-category">
            //           {focusedSkillName}
            //         </span>
            //       </div>
            //       <style jsx>{skillsFrameworkStyle}</style>
            //     </div>
            //   )
            // }
          }
          return null
        }}
      </Query>
    )
  }
  return null
})
