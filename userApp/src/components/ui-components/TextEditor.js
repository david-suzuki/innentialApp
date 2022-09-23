import React from 'react'
import ReactQuill from 'react-quill'

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'bullet' }],
    ['link'],
    ['clean']
  ]
}

const customStyle = {
  backgroundColor: '#fff'
}

const formats = ['bold', 'italic', 'underline', 'list', 'bullet', 'link']

export default ({ value, handleChange, placeholder, onKeyPress, onKeyUp }) => {
  return (
    <ReactQuill
      value={value ?? ''}
      onChange={value => handleChange(value)}
      modules={modules}
      formats={formats}
      theme='snow'
      style={customStyle}
      placeholder={placeholder}
      onKeyPress={onKeyPress}
      onKeyUp={onKeyUp}
    />
  )
}
