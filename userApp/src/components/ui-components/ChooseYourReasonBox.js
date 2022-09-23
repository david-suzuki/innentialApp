import React, { useState } from 'react'
import { Button, Checkbox, Input } from 'element-react'
// import ReactGA from 'react-ga'
import chooseYourReasonBoxStyle from '../../styles/chooseYourReasonBoxStyle'

const options = [
  'Too expensive',
  "I don't want to wait for it to be approved",
  "I've already finished that item before",
  "I don't want/need to learn this",
  "I don't like this learning item",
  'Other'
]

const ChooseYourReasonBox = ({ contentId, pathId }) => {
  const [submitted, setSubmitted] = useState(false)
  const [other, setOther] = useState('')

  return (
    <div>
      {submitted ? (
        <div className='choose-your-reason-box__submitted'>
          Thank you for your feedback!
        </div>
      ) : (
        options.map(option => (
          <div
            key={`option:${option}`}
            className='choose-your-reason-box__option'
          >
            {option !== 'Other' ? (
              <Checkbox
                onChange={() => {
                  window.analytics &&
                    window.analytics.track('removed_path_item', {
                      contentId,
                      pathId,
                      reason: option
                    })
                  // ReactGA.event({
                  //   category: 'Learning Path',
                  //   action: `Removed item:${contentId} from path: ${pathId}`,
                  //   label: `Reason: ${option}`
                  // })
                  setSubmitted(true)
                }}
              >
                {option}
              </Checkbox>
            ) : (
              <>
                <span className='choose-your-reason-box__option__other'>
                  Other:
                </span>
                <Input
                  value={other}
                  onChange={value => setOther(value)}
                  placeholder='Type...'
                />
                <Button
                  className='el-button--choose-your-reason'
                  onClick={() => {
                    window.analytics &&
                      window.analytics.track('removed_path_item', {
                        contentId,
                        pathId,
                        reason: other
                      })
                    setSubmitted(true)
                  }}
                  disabled={other.length === 0}
                  type='primary'
                  size='small'
                >
                  Done
                </Button>
              </>
            )}
          </div>
        ))
      )}
      <style>{chooseYourReasonBoxStyle}</style>
    </div>
  )
}

export default ChooseYourReasonBox
