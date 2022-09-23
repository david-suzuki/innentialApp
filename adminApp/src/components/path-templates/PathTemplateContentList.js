import React, { useState } from 'react'
import { Button, Table } from 'element-react'
import pathTemplateContentListStyle from './pathTemplateContentListStyle'
import { ReactComponent as ArrowUpIcon } from '../../static/arrow-up.svg'
import { ReactComponent as ArrowDownIcon } from '../../static/arrow-down.svg'
import { TextEditor } from '../misc'

const ContentItem = ({ i, length, onOrderUpdate }) => {
  return (
    <div key={`role:${i}`} className='role-setting__form__next-steps'>
      <span
        style={{
          display: 'flex',
          height: '32px',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '5px'
          }}
        >
          {i !== 0 && (
            <ArrowUpIcon
              style={{
                opacity: 0.8,
                height: '1.5em',
                width: '1.5em'
              }}
              onClick={() => {
                onOrderUpdate(i, -1)
              }}
            />
          )}
          {i + 1 < length && (
            <ArrowDownIcon
              style={{
                opacity: 0.8,
                height: '1.5em',
                width: '1.5em'
              }}
              onClick={() => {
                onOrderUpdate(i, 1)
              }}
            />
          )}
        </div>
      </span>
      <style jsx>{pathTemplateContentListStyle}</style>
    </div>
  )
}

const NotePanel = ({
  _id: contentId,
  note: initialNote,
  handleUpdatingNote
}) => {
  const [note, setNote] = useState(initialNote)

  return (
    <>
      <TextEditor value={note} handleChange={value => setNote(value)} />
      {/* <Input
        value={note}
        onChange={value => setNote(value)}
        placeholder='Add a note...'
        type='textarea'
        autosize={{ minRows: 1 }}
      /> */}
      <Button
        type='primary'
        size='small'
        onClick={() => {
          handleUpdatingNote(contentId, note)
        }}
      >
        Accept
      </Button>
    </>
  )
}

const PathTemplateContentList = props => {
  const listColumns = (onContentRemove, onNoteUpdate, onOrderUpdate) => [
    {
      type: 'expand',
      expandPannel: data => (
        <NotePanel {...data} handleUpdatingNote={onNoteUpdate} />
      )
    },
    {
      label: 'Order',
      prop: 'order',
      sortable: true,
      render: data => {
        return (
          <ContentItem
            i={props.content.indexOf(data)}
            length={props.content.length}
            onOrderUpdate={onOrderUpdate}
          />
        )
      }
    },
    {
      label: 'Title',
      prop: 'title',
      sortable: true,
      minWidth: '400'
    },
    {
      label: 'Type',
      prop: 'type',
      sortable: true
    },
    {
      label: 'Difficulty',
      render: ({ relatedPrimarySkills = [] }) => {
        const difficultyLevels = [
          'ENTRY-LEVEL',
          'BEGINNER',
          'NOVICE',
          'INTERMEDIATE',
          'ADVANCED',
          'EXPERT'
        ]
        return difficultyLevels[
          relatedPrimarySkills.reduce((acc, curr) => {
            if (curr.skillLevel > acc) return curr.skillLevel
            return acc
          }, 0)
        ]
      },
      sortable: true,
      minWidth: '130'
    },
    {
      label: 'Operations',
      render: data => {
        return (
          <Button
            type='danger'
            size='small'
            onClick={() => onContentRemove(data._id)}
          >
            <i className='el-icon-delete' />
          </Button>
        )
      }
    }
  ]

  return (
    <>
      <Table
        columns={listColumns(
          props.onContentRemove,
          props.onNoteUpdate,
          props.onOrderUpdate
        )}
        data={[...props.content]}
        stripe
        emptyText='No learning in development plan for goal template'
        style={{ width: '100%' }}
      />
    </>
  )
}

export default PathTemplateContentList
