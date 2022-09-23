import React from 'react'
import variables from '$/styles/variables'
import SmileOne from '../../static/smile1.png'
import SmileTwo from '../../static/smile2.png'
import SmileThree from '../../static/smile3.png'
import SmileFour from '../../static/smile4.png'
import SmileFive from '../../static/smile5.png'

const smileyIcon = icon => (
  <img className='smiley-icon' src={icon} alt='smiley icon' />
)

const SmileyFaceIndicator = ({ currentRating, setCurrentRating }) => {
  const ratings = [
    smileyIcon(SmileOne),
    smileyIcon(SmileTwo),
    smileyIcon(SmileThree),
    smileyIcon(SmileFour),
    smileyIcon(SmileFive)
  ]

  const smileys = ratings.map((rating, index) => {
    const isSelected = currentRating === index + 1
    return (
      <span
        key={`smiley:${index}`}
        {...(isSelected && { style: { opacity: '100%' } })}
        className='learning-feedback__smiley'
        onClick={() => setCurrentRating(index + 1)}
        position={index + 1}
      >
        {rating}
      </span>
    )
  })

  return (
    <span className='learning-feedback__smiley-container'>
      {smileys}
      <style>{`
        .learning-feedback__smiley-container {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          padding: 30px 0;
        }

        .learning-feedback__smiley {
          cursor: pointer;
          opacity: 0.5;
        }

        .learning-feedback__smiley:hover {
          opacity: 1;
        }

        .smiley-icon {
          width: 60px;
          height: 60px;
          transition: transform .2s;
        }

        .smiley-icon:hover, .smiley-icon:active {
          transform: scale(1.3);
        }

        @media ${variables.xs} {
          .smiley-icon {
            width: 40px;
          height: 40px;
          }
        }
      `}</style>
    </span>
  )
}

export default SmileyFaceIndicator
