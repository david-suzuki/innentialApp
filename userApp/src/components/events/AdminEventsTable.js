import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { generateInitialsAvatar, generateSpecialAvatar } from '$/utils'
import tableStyle from '$/styles/tableStyle'
import adminEventsTableStyle from '$/styles/adminEventsTableStyle'
import { ReactComponent as IconEvent } from '$/static/NewNav_assets/user-route-icons/paths.svg'
import { ReactComponent as IconCalendar } from '$/static/calendar.svg'
import { ReactComponent as IconAssignee } from '$/static/assignee.svg'
import { ReactComponent as IconCreator } from '$/static/user-plus.svg'
import { ReactComponent as IconSettings } from '$/static/settings.svg'
import { ReactComponent as IconDelete } from '$/static/delete-icon.svg'

const TableItem = ({
  item,
  actionButtonText,
  actionButtonHandle,
  deleteButtonHandle
}) => {
  return (
    <React.Fragment key={`op-template: ${item._id}`}>
      <tr>
        <td className='path-data'>
          <span className='path-data__title'>{item.title}</span>
        </td>
        <td className='path-data'>
          {moment(new Date(item.scheduleFromDate)).format('DD.MM.YYYY')}
        </td>
        <td className='path-data__attendees'>
          {item.invitations.slice(0, 3).map(invitation => (
            <img
              key={invitation._id}
              src={
                invitation.imageLink ||
                generateInitialsAvatar({
                  firstName: invitation.firstName,
                  lastName: invitation.lastName,
                  _id: invitation._id
                })
              }
              alt='avatar'
              width='37'
              height='37'
            />
          ))}
          {item.invitations.length > 3 && (
            <img
              src={generateSpecialAvatar({
                initials: `+${item.invitations.length - 3}`,
                initialBg: '#BDBBDD',
                initialWeight: 900,
                initialSize: 18,
                size: 40
              })}
              alt='more-users'
              width='37'
              height='37'
            />
          )}
        </td>
        <td className='path-data__creator'>
          {item.creater !== null && (
            <Link to={`/profiles/${item.creater._id}`}>
              {`${
                item.creater.firstName && item.creater.lastName
                  ? `${item.creater.firstName} ${item.creater.lastName}`
                  : item.creater.email
              } `}
            </Link>
          )}
        </td>
        <td className='path-data'>
          <div className='path-data__buttons'>
            {actionButtonText === 'Upload file' && (
              <Link to='/upload'>
                <button className='el-button el-button--default'>
                  <span>{actionButtonText}</span>
                </button>
              </Link>
            )}
            {actionButtonText === 'Edit Event' && (
              <button
                className='el-button el-button--default'
                onClick={() => actionButtonHandle(item._id)}
              >
                <span>{actionButtonText}</span>
              </button>
            )}
            {actionButtonText === 'Publish' && (
              <button
                className='el-button el-button--default action-button'
                onClick={() => actionButtonHandle(item._id)}
              >
                <span>{actionButtonText}</span>
              </button>
            )}

            <IconDelete
              className='path-data__delete-icon'
              onClick={() => deleteButtonHandle(item._id)}
            />
          </div>
        </td>
      </tr>
    </React.Fragment>
  )
}

const AdminEventsTable = ({
  events,
  actionButtonText,
  actionButtonHandle,
  deleteButtonHandle,
  handleSortEventsByDate,
  handleSortEventsByAttendeeName,
  handleSortEventsByCreatorName
}) => {
  return (
    <div className='events-table__container'>
      <table className='table' style={{ background: '#FFFFFF' }}>
        <tbody>
          <tr>
            <td style={{ width: '20%' }}>
              <div className='table-title'>
                <IconEvent className='table-icon table-icon--first' />
                Event name
              </div>
            </td>

            <td style={{ width: '14%' }}>
              <div className='table-title'>
                <IconCalendar className='table-icon table-icon--second' />
                Event Date
                <img
                  width={15}
                  style={{ marginLeft: '5px', cursor: 'pointer' }}
                  src={require('../../static/sort.svg')}
                  alt=''
                  onClick={handleSortEventsByDate}
                />
              </div>
            </td>

            <td style={{ width: '15%' }}>
              <div className='table-title'>
                <IconAssignee className='table-icon' />
                Attendees
                <img
                  width={15}
                  style={{ marginLeft: '5px', cursor: 'pointer' }}
                  src={require('../../static/sort.svg')}
                  alt=''
                  onClick={handleSortEventsByAttendeeName}
                />
              </div>
            </td>

            <td style={{ width: '15%' }}>
              <div className='table-title'>
                <IconCreator className='table-icon' />
                Created by
                <img
                  width={15}
                  style={{ marginLeft: '5px', cursor: 'pointer' }}
                  src={require('../../static/sort.svg')}
                  alt=''
                  onClick={handleSortEventsByCreatorName}
                />
              </div>
            </td>

            <td style={{ width: '10%' }}>
              <div className='table-title'>
                <IconSettings className='table-icon' />
                Settings
              </div>
            </td>
          </tr>
          {events.map(e => {
            return (
              <React.Fragment key={e._id}>
                <TableItem
                  item={e}
                  actionButtonText={actionButtonText}
                  actionButtonHandle={actionButtonHandle}
                  deleteButtonHandle={deleteButtonHandle}
                />
              </React.Fragment>
            )
          })}
        </tbody>
      </table>

      <style jsx>{tableStyle}</style>
      <style jsx>{adminEventsTableStyle}</style>
    </div>
  )
}

export default AdminEventsTable
