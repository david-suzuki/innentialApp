import React, { useState } from 'react'
import { Button, Checkbox, Input } from 'element-react'
// import ReactGA from 'react-ga'
import chooseYourReasonBoxStyle from '../../../../styles/chooseYourReasonBoxStyle'

const options = [
  'Learning Path recommendations were irrelevant',
  'I couldn’t find content to build my own path',
  'The content for skills I chose was irrelevant',
  'Other'
]

const ChooseYourReasonBox = ({ setReasonsHOC, setOtherHOC }) => {
  const [reasons, setReasonsLocal] = useState([])
  const [other, setOtherLocal] = useState('')

  // UNDOUBTEDLY THE WORST PIECE OF STATE MANAGEMENT I'VE DONE
  // ELEMENT-REACT DOES NOT CHANGE THE RENDER STATE OF THE MESSAGEBOX, EXCEPT INTERNALLY
  // SO WE CONTROL BOTH THE STATE IN THE HOC, AND INTERNALLY WITHIN THE MESSAGEBOX' CONTENT
  const setReasons = value => {
    if (reasons.some(reason => reason === value)) {
      setReasonsHOC(reasons.filter(reason => reason !== value))
      setReasonsLocal(reasons.filter(reason => reason !== value))
    } else {
      setReasonsHOC([...reasons, value])
      setReasonsLocal([...reasons, value])
    }
  }

  const setOther = value => {
    setOtherLocal(value)
    setOtherHOC(value)
  }

  return (
    <>
      {options.map(option => (
        <div
          key={`option:${option}`}
          className='choose-your-reason-box__option'
        >
          {option !== 'Other' ? (
            <Checkbox
              onChange={() => setReasons(option)}
              checked={reasons.some(reason => reason === option)}
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
            </>
          )}
        </div>
      ))}
      <style>{chooseYourReasonBoxStyle}</style>
    </>
  )
}

export default ChooseYourReasonBox
