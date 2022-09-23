import React, { useEffect, useState } from 'react'
import { Input, Button, MessageBox } from 'element-react'
import goalItemStyle from '../../../../styles/goalItemStyle'
import { ListSkillSelector, TextEditor } from '../../../ui-components'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import RightIcon from '$/static/right-icon.svg'
import Pattern from '$/static/pattern.svg'
import { ReactComponent as OrderIcon } from '$/static/order-icon.svg'

const capitalize = s =>
  (s && s[0].toUpperCase() + s.slice(1).toLowerCase()) || ''

const ContentItem = ({
  contentId,
  title,
  note,
  source,
  uploadedBy,
  type,
  goalIndex,
  contentIndex,
  handleDeleteContent,
  handleContentDetailsChange
}) => {
  return (
    <>
      <div className='goal-item__list-item__order-icon'>
        <div className='order-icon_container'>
          <i className='el-icon-minus'></i>
          <i className='el-icon-minus'></i>
          <i className='el-icon-minus'></i>
        </div>
      </div>
      <div className='goal-item__list-item__content'>
        <div className='item__content'>
          <div className='item__content-labels'>
            <div className='item__content-labels__title'>{title}</div>
            <div className='item__content-labels-right'>
              <div className='item__content-labels__upload'>
                {uploadedBy ? (
                  <div className='upload-person'>
                    Uploaded by:{' '}
                    <span>
                      {uploadedBy.firstName + ' ' + uploadedBy.lastName}
                    </span>
                  </div>
                ) : source && source.iconSource ? (
                  <div className='upload__image'>
                    <img
                      src={source.iconSource}
                      alt='source icon'
                      className='upload__image'
                    />
                  </div>
                ) : (
                  <div className='upload__image'>{source?.name}</div>
                )}
              </div>
              {type && (
                <div className='item__content-labels__tag'>
                  <span>{capitalize(type)}</span>
                </div>
              )}
            </div>
          </div>
          <div
            className='item__content-note'
            style={{ width: '100%', textAlign: 'left' }}
          >
            <TextEditor
              placeholder='Add short explanation why this content is in the learning path'
              value={note}
              handleChange={noteValue =>
                handleContentDetailsChange(goalIndex, contentIndex, noteValue)
              }
              onFocus={e => (e.target.placeholder = '')}
              onBlur={e =>
                (e.target.placeholder =
                  'Add short explanation why this content is in the learning path')
              }
            />
          </div>
        </div>
        <div className='item__content__button'>
          <div
            className='item__content__button-container'
            style={{ cursor: 'pointer' }}
            onClick={async () =>
              await handleDeleteContent(goalIndex, contentIndex)
            }
          >
            {/* <i className='el-icon-close'></i> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default ({
  goalIndex,
  goalName,
  relatedSkills,
  measures,
  developmentPlan: { content = [], mentors = [], tasks = [] },
  removeGoal,
  addNewMeasure,
  deleteMeasure,
  onChangeName,
  onChangeMeasure,
  selectorProps,
  onDevelopmentPlanClick,
  initialGoalNo,
  total,
  active,
  showLPIndex = false,
  hideMeasures,
  showChangeOrder,
  setShowChangeOrder,
  handleDeleteContent,
  handleContentChangingOrder,
  handleContentDetailsChange
}) => {
  const [contentDnd, setContentDnd] = useState(content)
  useEffect(() => {
    setContentDnd(content)
  }, [content])
  const handleOnDragEnd = result => {
    if (!result.destination) return

    const items = contentDnd
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    handleContentChangingOrder(goalIndex, items)
  }

  return (
    <>
      {showChangeOrder && (
        <div className='list-item goal-item--short'>
          <div className='goal-item__list-item__order-icon'>
            <div className='order-icon_container order-icon_container--order'>
              <i className='el-icon-minus'></i>
              <i className='el-icon-minus'></i>
              <i className='el-icon-minus'></i>
            </div>
          </div>
          {showLPIndex && (
            <div className='goal-item__goal-number'>
              <span>goal</span>
              <span>{goalIndex + 1}</span>
              <img src={Pattern} alt='pattern' />
            </div>
          )}
          <div className='goal-item__wrapper--order'>
            <div className='goal-item__name-wrapper'>
              <div className='goal-item__name'>
                <Input
                  value={goalName}
                  onChange={value => onChangeName(goalIndex, value)}
                  placeholder='Enter goal name'
                  className={goalName !== '' ? 'darker-border' : ''}
                  onFocus={e => (e.target.placeholder = '')}
                  onBlur={e => (e.target.placeholder = 'Enter goal name')}
                />
              </div>
            </div>
            {/* <div className='goal-item__buttons-wrapper'></div> */}
          </div>
          <style>{goalItemStyle}</style>
        </div>
      )}
      {!showChangeOrder && (
        <div className='list-item goal-item' style={{ marginBottom: '-14px' }}>
          {showLPIndex && (
            <div className='goal-item__goal-number'>
              <span>goal</span>
              <span>{goalIndex + 1}</span>
              <img src={Pattern} alt='pattern' />
            </div>
          )}
          <div className='goal-item__wrapper'>
            <div className='goal-item__name-wrapper'>
              <div className='goal-item__name'>
                <Input
                  value={goalName}
                  onChange={value => onChangeName(goalIndex, value)}
                  placeholder='Enter goal name'
                  className={goalName !== '' ? 'darker-border' : ''}
                  onFocus={e => (e.target.placeholder = '')}
                  onBlur={e => (e.target.placeholder = 'Enter goal name')}
                />
                {total > 1 && (
                  <div className='goals__order' onClick={setShowChangeOrder}>
                    <OrderIcon className='order__icon' />
                    Change goals order
                  </div>
                )}
              </div>
              {/* {!hideMeasures && (
          <div className='goal-item__completion'>
            <p className='goal-item__completion--numbers'>
              <span>{Object.keys(measures).length}</span>
            </p>
            <p className='goal-item__completion-text'>success measures</p>
          </div>
            )} */}
            </div>
            <div className='goal-item__skills-wrapper'>
              <div className='goal-item__skills-wrapper__title'>
                Skills to learn
              </div>
              {relatedSkills.length === 0 && (
                <ListSkillSelector {...selectorProps} />
              )}
              <div className='goal-item__skills'>
                {relatedSkills.map((skill, i) => (
                  <span
                    key={`skilltag:${goalIndex}:${i}`}
                    className='goal-item__skill-tag'
                  >
                    {skill.name}
                  </span>
                ))}
                {relatedSkills.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center' , padding: '8px 2px', maxHeight: '36px', maxWidth: '36px'}}>
                    <ListSkillSelector {...selectorProps} />
                  </div>
                )}
              </div>
              {/* <a
          onClick={() => setActiveDialog(goalIndex, relatedSkills)}
          className='goal-item__add-button'
         >
          Change related skills
         </a> */}
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable
                droppableId='contentDnd'
                isDropDisabled={content.length < 2}
              >
                {(provided, snapshot) => (
                  <div
                    className='goal-item__list'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {contentDnd.map(
                      (
                        { _id, title, note, source, uploadedBy, type },
                        index
                      ) => {
                        return (
                          <Draggable
                            key={_id}
                            draggableId={_id}
                            index={index}
                            isDragDisabled={content.length < 2}
                          >
                            {provided => (
                              <div
                                className='goal-item__list-item'
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ContentItem
                                  title={title}
                                  note={note || ''}
                                  source={source}
                                  uploadedBy={uploadedBy}
                                  type={capitalize(type)}
                                  contentIndex={index}
                                  goalIndex={goalIndex}
                                  handleDeleteContent={handleDeleteContent}
                                  handleContentDetailsChange={
                                    handleContentDetailsChange
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        )
                      }
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* {!hideMeasures && (
                <div className='goal-item__measures-wrapper'>
                  <p>Success measures</p>
                  {measures.map((measure, i) => (
                    <Input
                      key={`measureinput:${goalIndex}:${i}`}
                      value={measure}
                      onChange={value => onChangeMeasure(goalIndex, i, value)}
                      icon='delete'
                      onIconClick={() => deleteMeasure(goalIndex, i)}
                      placeholder='How to tell if the goal is accomplished?'
                    />
                  ))}
                  <a
                    onClick={() => addNewMeasure(goalIndex)}
                    className='goal-item__add-button'
                  >
                    + Add new
                  </a>
                </div>
              )} */}
            <div
              className={`goal-item__buttons-wrapper${
                content.length + tasks.length + mentors.length > 0
                  ? ''
                  : '--active'
              }`}
            >
              {active && (
                <Button
                  className={`el-button goal-item__development-button${
                    content.length + tasks.length + mentors.length > 0
                      ? ''
                      : '--active'
                  }`}
                  style={{ float: 'left' }}
                  onClick={() => onDevelopmentPlanClick(goalIndex)}
                  disabled={!goalName || relatedSkills.length === 0}
                >
                  {content.length + tasks.length + mentors.length > 0
                    ? 'Edit'
                    : 'Add'}{' '}
                  goal content
                  {!(content.length > 0) && (
                    <img src={RightIcon} alt='forward icon' />
                  )}
                </Button>
              )}
              {/* {goalIndex >= initialGoalNo && (!total || goalIndex === total - 1) && ( */}
              {total > 1 && (
                <Button
                  // type="warning"
                  className='goal-item__update-button'
                  onClick={() => {
                    if (content.length + tasks.length + mentors.length > 0) {
                      MessageBox.confirm(
                        'All development plan data will be lost',
                        'Are you sure you want to remove the goal?',
                        {
                          type: 'warning'
                        }
                      )
                        .then(() => removeGoal(goalIndex))
                        .catch(() => {})
                    } else {
                      removeGoal(goalIndex)
                    }
                  }}
                >
                  <i className='el-icon-delete'></i>
                  Delete goal
                </Button>
              )}
            </div>
          </div>
          <style>{goalItemStyle}</style>
        </div>
      )}
    </>
  )
}
