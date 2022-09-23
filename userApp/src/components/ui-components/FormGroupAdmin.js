import React from 'react'
import formGroupStyle from '../../styles/formGroupStyle'

const FormGroupAdmin = ({ mainLabel, children }) => {
  return (
    <div
      className='form-group form-group--admin'
      style={{ padding: '15px 0px' }}
    >
      <h4>{mainLabel}</h4>
      {children}
      <style jsx>{formGroupStyle}</style>
    </div>
  )
}

export default FormGroupAdmin
