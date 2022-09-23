import React from 'react'
import ReactQuill from 'react-quill'

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'bullet' }, { list: 'ordered' }],
    ['link'],
    ['clean']
  ]
}

const customStyle = {
  backgroundColor: '#fff'
}

const formats = ['bold', 'italic', 'underline', 'list', 'bullet', 'link']

export default ({ value, handleChange }) => {
  return (
    <ReactQuill
      value={value}
      onChange={value => handleChange(value)}
      modules={modules}
      formats={formats}
      theme='snow'
      style={customStyle}
    />
  )
}
