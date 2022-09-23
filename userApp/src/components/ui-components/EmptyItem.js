import React from 'react'
import handIcon from '../../static/pointingHand.png'

const Container = ({ children, isMobile }) => (
  <div
    className='empty-item-container'
    style={{
      display: 'flex',
      position: 'relative',
      padding: '32px 32px 25px 32px',
      border: '2px dashed lightGrey',
      borderRadius: '10px',
      marginBottom: '24px',
      minWidth: '250px',
      maxWidth: '400px',
      height: '164px',
      backgroundColor: '#fff',
      margin: isMobile ? '0 auto' : '0',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {children}
  </div>
)

const LearningItem = ({ isMobile, contentList }) => {
  const pstyle = {
    color: '#556685',
    fontSize: '12px'
  }
  return (
    <Container isMobile={isMobile}>
      {contentList ? (
        <p style={pstyle}>
          We couldn't find any recommendations for you 😔
          <br />
          Try changing your preferences
        </p>
      ) : (
        <p style={pstyle}>
          You don't have any Learning Card yet.
          <br />
          Add your interest from the{' '}
          {isMobile ? 'previous page' : 'list on the right side'}
          {!isMobile && (
            <img
              src={handIcon}
              alt='hand'
              width='18px'
              style={{ paddingLeft: '5px' }}
            />
          )}
        </p>
      )}
    </Container>
  )
}

export default LearningItem
