import React from 'react'
import formDescriptionStyle from '../../styles/formDescriptionStyle'

const FormDescription = ({
  label,
  largeLabel,
  description,
  children,
  register,
  mb40,
  style
}) => {
  const mb = mb40 ? { marginBottom: 40 } : style || {}
  return (
    <div className='form-description' style={mb}>
      {register ? (
        <div className='form-description--register el-form-item__label'>
          {label}
        </div>
      ) : (
        <div
          className={`el-form-item__label ${
            largeLabel ? 'el-form-item__label-large' : ''
          }`}
        >
          {label}
        </div>
      )}
      {description && (
        <div className='el-form-item__description'>{description}</div>
      )}
      {children}
      <style jsx>{formDescriptionStyle}</style>
    </div>
  )
}

export default FormDescription
