import React, { useEffect, useState, useSyncExternalStore } from 'react'
import {
  Button,
  Input,
  Notification,
  Select,
  Message,
  MessageBox,
  Radio,
  Checkbox,
  Switch
} from 'element-react'
import { Link, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ApolloConsumer } from 'react-apollo'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { ListSkillSelector, TextEditor } from '../ui-components'
import AssignEvent from './AssignEvent'
import eventTemplateStyle from '$/styles/eventTemplateStyle'
import { ReactComponent as IconCalendar } from '$/static/calendar.svg'
import { ReactComponent as IconClock } from '$/static/clock.svg'
import { ReactComponent as IconMaps } from '$/static/google-maps.svg'
import { UploadIcon } from '../organization-settings/components/Icons'
import {
  createEvent,
  editEvent,
  fetchAllUpcomingAdminEvents,
  fetchAllDraftAdminEvents,
  fetchAllPastAdminEvents,
  fetchEventImageUploadLink,
  deleteEventImage
} from '../../api'
import { dateCombiner } from '../../utils'
import axios from 'axios'

const Submit = ({
  inputIsValid,
  data,
  props,
  chosenImage,
  imageDeleted,
  eventAttendeesInfo
}) => {
  let history = useHistory()

  const isEdit = !!data._id
  const [mutation] = useMutation(isEdit ? editEvent : createEvent)
  const [deleteImageMutation] = useMutation(deleteEventImage)

  const handleSubmit = async isDraft => {
    const skillIds = data.skills.map(skill => skill._id)

    const scheduleFromDate = dateCombiner(
      data.scheduleFromDate,
      data.scheduleTime
    )

    let input = {
      title: data.title,
      description: data.description,
      eventType: data.type,
      format: data.format,
      eventLink: data.eventLink,
      eventLinkExternal: data.eventLinkExternal,
      eventLocation: data.eventLocation,
      isOnedayEvent: data.isOneDay,
      isPaid: data.isPaid,
      scheduleFromDate,
      scheduleToDate: data.scheduleToDate,
      price: data.price,
      currency: data.currency,
      inviteLinkUrl: data.inviteLink,
      inviteLinkStatus: data.inviteLinkStatus,
      skillIds,
      attendeeType: eventAttendeesInfo?.type,
      attendeeIds: eventAttendeesInfo?.items.map(item => item._id),
      isDraft
    }

    if (isEdit) {
      input._id = data._id
    }

    mutation({
      variables: {
        input
      },
      refetchQueries: [
        {
          query: fetchAllDraftAdminEvents
        },
        {
          query: fetchAllUpcomingAdminEvents
        },
        {
          query: fetchAllPastAdminEvents
        }
      ]
    })
      .then(async res => {
        const message = isEdit ? 'Successfully updated' : 'Successfully added'
        if (!isEdit && chosenImage?.name) {
          const uploadLink = await props.client.query({
            query: fetchEventImageUploadLink,
            variables: {
              eventId: res.data.createEvent._id,
              contentType: chosenImage?.type
            }
          })
          await axios.put(
            uploadLink.data.fetchEventImageUploadLink,
            chosenImage,
            {
              headers: {
                'Content-Type': chosenImage.type
              }
            }
          )
        } else if (isEdit) {
          if (chosenImage?.name) {
            await axios.put(data.imageLink, chosenImage, {
              headers: {
                'Content-Type': chosenImage.type
              }
            })
          } else if (imageDeleted) {
            await deleteImageMutation({
              variables: {
                eventId: data._id,
                key: 'eventTemplateForm/icons'
              }
            })
          }
        }
        Notification({
          type: 'success',
          message,
          duration: 2500,
          offset: 90
        })
        history.push(`/events/manage-events`)
      })
      .catch(e => {})
  }

  return (
    <div className='page-footer page-footer--fixed-path'>
      <div className='event-template__footer'>
        <Link to='/events'>
          <div className='event-template__footer-back'>
            <i className='page-heading__back__button icon icon-small-right icon-rotate-180' />
            Back
          </div>
        </Link>
        <div className='event-template__footer-buttons'>
          <Button type='text' onClick={() => handleSubmit(true)}>
            Save as a Draft
          </Button>
          {inputIsValid && (
            <Button
              type='primary'
              size='large'
              onClick={() => handleSubmit(false)}
            >
              Save Event
            </Button>
          )}
          {!inputIsValid && <div className='button-disabled'>Save Event</div>}
        </div>
      </div>
    </div>
  )
}

const CURRENCIES = ['EUR', 'CHF', 'USD', 'GBP']

const headerString = isEditing => `${isEditing ? 'Edit' : 'New'} Event`

const EventTemplate = props => {
  const { currentUser, queryDecider, initialData } = props
  const {
    _id,
    title,
    eventType,
    description,
    format,
    eventLink,
    eventLinkExternal,
    eventLocation,
    isOnedayEvent,
    scheduleFromDate,
    scheduleToDate,
    scheduleTime,
    isPaid,
    currency,
    price,
    skills,
    attendee,
    imageLink,
    inviteLink
  } = initialData

  const [eventState, setEventState] = useState({
    _id: _id,
    title: title,
    type: eventType,
    description: description,
    format: format,
    eventLink: eventLink,
    eventLinkExternal: eventLinkExternal,
    eventLocation: eventLocation,
    isOneDay: isOnedayEvent,
    scheduleFromDate:
      scheduleFromDate === '' ? new Date() : new Date(scheduleFromDate),
    scheduleToDate:
      scheduleToDate === '' ? new Date() : new Date(scheduleToDate),
    scheduleTime: scheduleTime === '' ? new Date() : new Date(scheduleFromDate),
    isPaid: isPaid,
    currency: currency,
    price: price,
    skills: skills,
    imageLink: imageLink,
    inviteLink: inviteLink.url,
    inviteLinkStatus: inviteLink.status
  })

  const [inviteLinkLoading, setInviteLinkLoading] = useState(false)
  const [chosenImage, setChosenImage] = useState({})
  const [chosenImageLink, setChosenImageLink] = useState(null)
  const [imageDeleted, setImageDeleted] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [changeHappened, setChangeHappened] = useState(false)
  const [inputClicked, setInputClicked] = useState(false)
  const [eventAssigneesInfo, setEventAssigneesInfo] = useState('')
  const [eventAttendeesInfo, setEventAttendeesInfo] = useState('')

  useEffect(() => {
    if (attendee.attendeeType === 'everyone') {
      setEventAssigneesInfo('Everyone')
      setEventAttendeesInfo({ type: 'everyone', items: [] })
    } else if (attendee.attendeeType === 'specificusers') {
      setEventAssigneesInfo(`${attendee.attendeeIds.length} attendees`)
      setEventAttendeesInfo({
        type: 'specificusers',
        items: attendee.attendeeIds
      })
    } else if (attendee.attendeeType === 'specificteams') {
      setEventAssigneesInfo(`${attendee.attendeeIds.length} teams`)
      setEventAttendeesInfo({
        type: 'specificusers',
        items: attendee.attendeeIds
      })
    }
  }, [attendee])

  const handleChange = (key, value) => {
    setChangeHappened(true)
    // setTitleChanged(titleChanged || key === 'title')
    if (key === 'isOneDay') {
      setEventState({ ...eventState, [key]: !eventState.isOneDay })
    } else {
      setEventState({ ...eventState, [key]: value })
      if (key === 'title' && value.length > 0) {
        setTitleError(false)
      }
      if (key === 'title' && value.length === 0) {
        setTitleError(true)
      }
    }
  }

  const handleSettingSkills = skill => {
    setEventState({ ...eventState, skills: [...skills, ...skill] })
    setChangeHappened(true)
  }

  const handleFileDelete = () => {
    if (eventState.imageLink && eventState.imageLink !== '') {
      setImageDeleted(true)
      setEventState({ ...eventState, imageLink: null })
    } else if (chosenImage && chosenImage?.name) {
      setChosenImage({})
      setEventState({ ...eventState, imageLink: null })
    }
  }

  const handleFileChange = async e => {
    if (eventState._id) {
      const bannerLink = await props.client.query({
        query: fetchEventImageUploadLink,
        variables: {
          eventId: eventState._id
        }
      })
      setEventState({
        ...eventState,
        imageLink: bannerLink.data.fetchEventImageUploadLink
      })
      setChosenImage(e)
      setChosenImageLink(URL.createObjectURL(e))
    } else {
      setChosenImage(e)
      setChosenImageLink(URL.createObjectURL(e))
    }
  }

  const selectorProps = {
    skills: eventState.skills,
    onSkillsSubmit: selected => handleSettingSkills(selected),
    buttonValue:
      eventState.skills.length > 0 ? 'Change' : 'Choose related skills',
    buttonClass:
      eventState.skills.length > 0
        ? 'list-skill-selector__button-input--selected'
        : 'list-skill-selector__button-input'
    // neededSkillsSelector: true
  }

  const isInputValid =
    changeHappened &&
    eventState.title.length > 0 &&
    eventState.description.length > 0

  return (
    <>
      <div className='event-template__header'>
        {headerString(eventState._id)}
      </div>
      <div className='event-template__container'>
        <div className='event-template__form'>
          <div className='form-title'>
            <Input
              value={eventState.title}
              placeholder='Enter event title'
              onChange={value => handleChange('title', value)}
              className={
                titleError
                  ? 'error-border'
                  : eventState.title !== ''
                  ? 'darker-border'
                  : ''
              }
              maxLength={52}
              onFocus={e => (e.target.placeholder = '')}
              onBlur={e => (e.target.placeholder = 'Enter path title')}
            />
            <div
              className={
                titleError ? 'form-title__info--error' : 'form-title__info'
              }
            >
              {titleError
                ? 'Please provide the event name'
                : 'The title must contain a maximum of 52 characters'}
            </div>
          </div>
          <div
            className={
              eventState.description !== '' &&
              eventState.description !== '<p><br></p>'
                ? 'darker-border'
                : ''
            }
          >
            <TextEditor
              value={eventState.description}
              placeholder='Event description'
              handleChange={value => {
                setEventState({ ...eventState, description: value })
                setChangeHappened(true)
              }}
              onFocus={e => (e.target.placeholder = '')}
              onBlur={e => (e.target.placeholder = 'Event description')}
            />
          </div>

          <div className='form-type'>
            <div className='form-label'>Type</div>
            <div className='form-type__radios'>
              <Radio
                value='Internal'
                checked={eventState.type === 'Internal'}
                onChange={value => {
                  handleChange('type', value)
                }}
              >
                Internal
              </Radio>
              <Radio
                value='External'
                checked={eventState.type === 'External'}
                onChange={value => {
                  handleChange('type', value)
                }}
              >
                External
              </Radio>
            </div>
          </div>
          {eventState.type !== 'Internal' && (
            <div className='form-link'>
              <div className='form-label' style={{ marginBottom: '-7px' }}>
                Link
              </div>
              <Input
                value={eventState.eventLinkExternal}
                placeholder='Paste link to event here'
                onChange={value => handleChange('eventLinkExternal', value)}
                className={
                  eventState.eventLinkExternal !== '' ? 'darker-border' : ''
                }
                // maxLength={}
                onFocus={e => (e.target.placeholder = '')}
                onBlur={e =>
                  (e.target.placeholder = 'Paste link to event here')
                }
              />
            </div>
          )}
          {eventState.type === 'Internal' && (
            <div className='form-format'>
              <div className='form-label'>Format</div>
              <div className='form-format__radios'>
                <div>
                  <Radio
                    value='Online'
                    checked={eventState.format === 'Online'}
                    onChange={value => {
                      handleChange('format', value)
                    }}
                  >
                    Online
                  </Radio>

                  <Radio
                    value='On-site'
                    checked={eventState.format === 'On-site'}
                    onChange={value => {
                      handleChange('format', value)
                    }}
                  >
                    On-site
                  </Radio>
                </div>
                {eventState.format === 'Online' && (
                  <div className='form-format__input'>
                    <Input
                      value={eventState.eventLink}
                      placeholder='Enter event link here'
                      onChange={value => handleChange('eventLink', value)}
                      className={
                        eventState.eventLink !== '' ? 'darker-border' : ''
                      }
                      // maxLength={}
                      onFocus={e => (e.target.placeholder = '')}
                      onBlur={e =>
                        (e.target.placeholder = 'Enter event link here')
                      }
                    />
                  </div>
                )}
                {eventState.format === 'On-site' && (
                  <div className='form-format__input'>
                    <Input
                      value={eventState.eventLocation}
                      placeholder='Enter event location'
                      onChange={value => handleChange('eventLocation', value)}
                      className={
                        eventState.eventLocation !== '' ? 'darker-border' : ''
                      }
                      // maxLength={}
                      onFocus={e => (e.target.placeholder = '')}
                      onBlur={e =>
                        (e.target.placeholder = 'Enter event location')
                      }
                    />
                    <IconMaps />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className='form-schedule'>
            <div className='form-label'>Schedule</div>
            <div className='form-schedule__dates'>
              <IconCalendar className='form-schedule__dates-icon' />
              <DatePicker
                selected={eventState.scheduleFromDate}
                onChange={value => {
                  handleChange('scheduleFromDate', value)
                }}
                selectsStart
                placeholderText={
                  eventState.scheduleFromDate ||
                  moment.utc().format('DD.MM.yyyy')
                }
                dateFormat='dd.MM.yyyy'
                //  isClearable
              />
              {eventState.isOneDay === false && (
                <>
                  <span className='form-schedule__dates-divider'>-</span>
                  <DatePicker
                    selected={eventState.scheduleToDate}
                    onChange={value => {
                      handleChange('scheduleToDate', value)
                    }}
                    selectsStart
                    placeholderText={
                      eventState.scheduleToDate ||
                      moment.utc().format('DD.MM.yyyy')
                    }
                    dateFormat='dd.MM.yyyy'
                    //  isClearable
                  />
                </>
              )}
              <Checkbox
                label='Multi-day event'
                checked={eventState.isOneDay !== true}
                onChange={value => {
                  handleChange('isOneDay', !value)
                }}
              />
            </div>
            <div className='form-schedule__time'>
              <IconClock className='form-schedule__time-icon' />
              <DatePicker
                selected={eventState.scheduleTime}
                onChange={value => {
                  handleChange('scheduleTime', value)
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption='Time'
                dateFormat='h:mm aa'
                placeholderText={
                  eventState.scheduleTime
                    ? moment.utc(eventState.scheduleTime).format('HH:mm')
                    : '00:00 UTC'
                }
              />
            </div>
          </div>
          <div className='form-price'>
            <div className='form-label'>Price</div>
            <div className='form-price__row'>
              <div className='form-price__radios'>
                <Radio
                  value={0}
                  checked={eventState.isPaid === false}
                  onChange={value => {
                    handleChange('isPaid', value)
                  }}
                >
                  Free
                </Radio>
                <Radio
                  value={1}
                  checked={eventState.isPaid === true}
                  onChange={value => {
                    handleChange('isPaid', value)
                  }}
                  disabled={eventState.type === 'Internal'}
                >
                  Paid
                </Radio>
              </div>
              <div className='form-price__input'>
                <Input
                  value={eventState.price}
                  placeholder='Price'
                  onChange={value => handleChange('price', value)}
                  className={
                    titleError
                      ? 'error-border'
                      : title !== ''
                      ? 'darker-border'
                      : ''
                  }
                  maxLength={5}
                  onBlur={e => (e.target.placeholder = 'Price')}
                  disabled={
                    eventState.type === 'Internal' || eventState.isPaid === 0
                  }
                />
              </div>
              <div className='form-currency__input'>
                <Select
                  disabled={
                    eventState.type === 'Internal' || eventState.isPaid === 0
                  }
                  value={eventState.currency}
                  onChange={value => handleChange('currency', value)}
                >
                  {CURRENCIES.map(el => {
                    return <Select.Option key={el} label={el} value={el} />
                  })}
                </Select>
              </div>
            </div>
          </div>
          <div className='form-skills'>
            <div className='form-label'>Related Skills</div>
            {eventState.skills.length === 0 && (
              <ListSkillSelector {...selectorProps} />
            )}
            <div className='form-skills__list'>
              {eventState.skills.length > 0 &&
                eventState.skills.map((skill, i) => (
                  <span key={`skilltag:${i}`} className='form-skills__list-tag'>
                    {skill.name}
                  </span>
                ))}
              {eventState.skills.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 2px',
                    maxHeight: '36px',
                    maxWidth: '36px'
                  }}
                >
                  <ListSkillSelector {...selectorProps} />
                </div>
              )}
            </div>
          </div>
          <div className='form-link'>
            <div className='form-label' style={{ marginBottom: '-7px' }}>
              <span>Generate invite link</span>
              {eventState.type === 'Internal' && (
                <div>
                  <span className='switch-text'>
                    {eventState.inviteLinkStatus
                      ? 'Invite link is active'
                      : 'Invite link is inactive'}
                  </span>
                  <Switch
                    value={eventState.inviteLinkStatus}
                    onChange={() =>
                      setEventState({
                        ...eventState,
                        inviteLinkStatus: !eventState.inviteLinkStatus
                      })
                    }
                    onText=''
                    offText=''
                  />
                </div>
              )}
            </div>
            <Input
              value={eventState.inviteLink}
              icon={inviteLinkLoading ? 'loading' : ''}
              onChange={value => handleChange('inviteLink', value)}
              onFocus={e => {
                e.target.select()
                window.navigator.clipboard
                  .writeText(eventState.inviteLink)
                  .then(() => {
                    Notification({
                      type: 'info',
                      message: eventState.inviteLinkStatus
                        ? 'Link copied to clipboard'
                        : 'Link is currently inactive. You need to activate it in order for employees to participate',
                      duration: 2500,
                      offset: 90,
                      iconClass: 'el-icon-info'
                    })
                  })
                  .catch(() => {})
              }}
            />
          </div>

          {eventState.type === 'Internal' && (
            <div className='form-attendees'>
              <div className='form-label' style={{ marginBottom: '6px' }}>
                Event attendees
              </div>
              <div
                className='form-attendees__input'
                onClick={() => setInputClicked(true)}
              >
                <span>{eventAssigneesInfo}</span>
                {eventAssigneesInfo !== '' && (
                  <div className='form-attendees__input-change'>Change</div>
                )}
              </div>
              <AssignEvent
                currentUser={currentUser}
                inputClicked={inputClicked}
                attendee={attendee}
                setInputClicked={setInputClicked}
                setEventAssigneesInfo={setEventAssigneesInfo}
                setEventAttendeesInfo={setEventAttendeesInfo}
              />
            </div>
          )}
        </div>
        <>
          {chosenImage?.name ? (
            <div
              style={{
                backgroundImage: ` linear-gradient(rgba(
                     0, 0, 0, 0.6), rgba(
                     0, 0, 0, 0.6)), url(${chosenImageLink})`
              }}
              className='event-template__upload event-template__upload--uploaded'
            >
              <div
                className='event-template__upload-delete'
                onClick={handleFileDelete}
              >
                Delete <i className='el-icon-close'></i>
              </div>
              <label htmlFor='file-input' style={{ cursor: 'pointer' }}>
                <div className='event-template__upload-icon event-template__upload-icon--uploaded'>
                  <UploadIcon fill='#FFFFFF' />
                </div>
              </label>
              <input
                id='file-input'
                type='file'
                onChange={async e => {
                  await handleFileChange(
                    e.target.files[e.target.files.length - 1]
                  )
                }}
                style={{ display: 'none' }}
              />
              <span>
                <b>Click</b> to change image
              </span>
              <span>JPEG, PNG (max 800x400)</span>
            </div>
          ) : eventState.imageLink ? (
            <div
              style={{
                backgroundImage: ` linear-gradient(rgba(
                       0, 0, 0, 0.6), rgba(
                       0, 0, 0, 0.6)), url(${eventState.imageLink})`
              }}
              className='event-template__upload event-template__upload--uploaded '
            >
              <div
                className='event-template__upload-delete'
                onClick={handleFileDelete}
              >
                Delete <i className='el-icon-close'></i>
              </div>
              <label htmlFor='file-input' style={{ cursor: 'pointer' }}>
                <div className='event-template__upload-icon event-template__upload-icon--uploaded'>
                  <UploadIcon fill='#FFFFFF' />
                </div>
              </label>
              <input
                id='file-input'
                type='file'
                onChange={async e => {
                  await handleFileChange(
                    e.target.files[e.target.files.length - 1]
                  )
                }}
                style={{ display: 'none' }}
              />
              <span>
                <b>Click</b> to change image
              </span>
              <span>JPEG, PNG (max 800x400)</span>
            </div>
          ) : (
            <div className='event-template__upload'>
              <label htmlFor='file-input' style={{ cursor: 'pointer' }}>
                <div className='event-template__upload-icon'>
                  <UploadIcon fill='#556685' />
                </div>
              </label>
              <input
                id='file-input'
                type='file'
                onChange={async e => {
                  await handleFileChange(
                    e.target.files[e.target.files.length - 1]
                  )
                }}
                style={{ display: 'none' }}
              />
              <span>
                <b>Click</b> to upload preview image
              </span>
              <span>JPEG, PNG (max 800x400)</span>
            </div>
          )}
        </>
      </div>
      <Submit
        inputIsValid={isInputValid}
        data={eventState}
        props={props}
        chosenImage={chosenImage}
        imageDeleted={imageDeleted}
        eventAttendeesInfo={eventAttendeesInfo}
      />
      <style jsx>{eventTemplateStyle}</style>
    </>
  )
}

export default props => {
  return (
    <ApolloConsumer>
      {client => {
        return <EventTemplate {...props} client={client} />
      }}
    </ApolloConsumer>
  )
}
