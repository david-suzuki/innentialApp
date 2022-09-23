import React, { useState } from 'react'
import { DashboardButton, Statement } from './'

const DashboardItem = ({
  title,
  children,
  request,
  info,
  footerButton,
  cb,
  description
}) => {
  // const [info, setInfo] = useState(0)
  // const [isLoading, setIsLoading] = useState(true)

  // if (request && info === 0 && !isLoading) {
  //   return (
  //     <div
  //       style={{
  //         display: 'flex',
  //         alignItems: 'baseline',
  //         flexDirection: 'column',
  //         padding: '50px 0 0',
  //         height: '100%'
  //       }}
  //     >
  //       <h3 className='dashboard-item__title'>{title} </h3>
  //       <div
  //         style={{
  //           display: 'flex',
  //           height: 'calc(100% - 50px)',
  //           flexDirection: 'column',
  //           justifyContent: 'center',
  //           width: '100%'
  //         }}
  //       >
  //         <Statement content='No requests pending' />
  //       </div>
  //     </div>
  //   )
  // } else {
  return (
    <div className='dashboard-item__container'>
      <div style={request && { display: 'flex', alignItems: 'baseline' }}>
        <h3 className='dashboard-item__title'>{title} </h3>
        {request && (
          <div className='dashboard-item__info'>
            {' '}
            <span>{info}</span>{' '}
          </div>
        )}
      </div>
      <div className='dashboard-item__description'>{description}</div>
      <div className='dashboard-item__content'>
        {/* {(setInfo, info) => <Children setInfo={setInfo} info={info} />} */}
        {children}
      </div>
      {footerButton && (
        <div>
          <DashboardButton cb={cb} />
        </div>
      )}
    </div>
  )
  // }
}

export default DashboardItem
