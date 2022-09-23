import React from 'react'
import variables from '$/styles/variables'
import SmileyFaceIndicator from './SmileyFaceIndicator'
// import { Button, Checkbox, Radio } from 'element-react'
import ThunbsUp from '../../static/thumbs-up.svg'
import ThunbsDown from '../../static/thumbs-down.svg'

const BigTab = ({ children, icon, handleClick, active }) => {
  return (
    <div
      className={`big-tab ${active ? 'big-tab--active' : ''}`}
      onClick={handleClick}
    >
      <img
        src={icon}
        alt='tab-icon'
        height={24}
        style={{ marginBottom: '7px' }}
      />
      <div>{children}</div>
    </div>
  )
}

const LearningItemFeedbackBox = ({
  initialFeedbackValue,
  initialInteresting,
  setValue,
  setInteresting: setExternalInteresting
}) => {
  // const [feedback, setFeedback] = React.useState(false)
  const [currentRating, setCurrentRating] = React.useState(initialFeedbackValue)
  const [interesting, setInteresting] = React.useState(initialInteresting)

  // const sendFeedback = async () => {
  //   await mutation({
  //     variables: {
  //       value: currentRating,
  //       interesting,
  //       contentId: contentId
  //     }
  //   })
  //   setFeedback(true)
  // }

  // if (!feedback) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        <h2 className='learning-feedback__headline'>
          Did you find the content relevant to your needs?
        </h2>
        <div className='learning-feedback__buttons'>
          <BigTab
            handleClick={() => {
              setInteresting(true) //
              setExternalInteresting(true)
            }}
            active={interesting}
            icon={ThunbsUp}
          >
            <span>Yes, I did!</span>
          </BigTab>
          <BigTab
            handleClick={() => {
              setInteresting(false)
              setExternalInteresting(false)
            }}
            active={interesting === false}
            icon={ThunbsDown}
          >
            <span>No, it could be better</span>
          </BigTab>
        </div>
        {/* <Radio value={true} checked={interesting} onChange={setInteresting}>Yes</Radio>
          <Radio value={false} checked={!interesting} onChange={setInteresting}>No</Radio> */}
      </div>
      <div>
        <h2 className='learning-feedback__headline'>
          How did you like the content?
        </h2>
        <br />
        <SmileyFaceIndicator
          currentRating={currentRating}
          setCurrentRating={value => {
            setCurrentRating(value)
            setValue(value)
          }}
        />
      </div>
      {/* <div>
          <br />
          <Button
            onClick={sendFeedback}
            type='primary'
            disabled={currentRating === 0}
          >
            <strong style={{ fontFamily: 'Poppins', fontSize: '16px' }}>Send feedback</strong>
          </Button>
        </div> */}
      <style>
        {`
          .learning-feedback__headline {
            font-size: 22px;
            line-height: 32px;
          }

          .learning-feedback__buttons {
            display: flex;
            flex-direction: row;
            justify-content: space-between; 
            margin: 38px 15px 52px;
          }

          @media ${variables.xs} {
            .learning-feedback__headline {
              font-size: 16px;
              line-height: 28px
            }
            .learning-feedback__buttons {
              flex-direction: column;
              align-items: center;
              margin: 28px 0 42px;
            }
          }
        `}
      </style>
    </div>
  )
  // } else {
  //   return (
  //     <div style={{ height: '169.28px', display: 'flex', alignItems: 'center' }}>
  //       Thank you for your feedback!
  //     </div>
  //   )
  // }
}

export default LearningItemFeedbackBox
