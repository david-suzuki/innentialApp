import React from 'react'
import formGroupStyle from '../../styles/formGroupStyle'

const FormGroup = ({ mainLabel, children, noPadding, onBoarding }) => {
  return (
    <div
      className={onBoarding ? 'form-group onBoarding-form-group' : 'form-group'}
      style={{ padding: '0' }}
    >
      {mainLabel && <h4>{mainLabel}</h4>}
      {children}
      <style jsx>{formGroupStyle}</style>
    </div>
  )
}

export default FormGroup
