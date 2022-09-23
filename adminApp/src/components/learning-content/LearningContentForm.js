import React, { useState } from 'react'
import { Radio } from 'element-react'
import { ApolloConsumer } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { LearningContentFileAdd, LearningContentUrlAdd } from './'

const LearningContentForm = props => {
  const [uploadType, setUploadType] = useState('URL')

  const TypeSelector = ({ value, setValue }) => {
    return (
      <>
        <Radio.Group
          value={value}
          style={{ width: '20%', margin: 'auto', marginBottom: '40px' }}
          onChange={setValue}
        >
          <Radio value='URL'>URL</Radio>
          <Radio value='FILE'>File</Radio>
        </Radio.Group>
      </>
    )
  }

  return (
    <>
      <div style={{ fontSize: '14px', marginBottom: '10px' }}>
        {' '}
        {'Select the type of item you want to upload:'}
      </div>
      <TypeSelector value={uploadType} setValue={setUploadType} />
      {uploadType === 'FILE' ? (
        <ApolloConsumer>
          {client => (
            <span>
              <div style={{ fontSize: '16px', marginBottom: '5px' }}>
                {'Upload a file'}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '20px' }}>
                {
                  'Accepted File Types: jpeg, png, txt, pdf, xls, ppt, doc, key, pages, wav, mp3, mp4'
                }
              </div>
              <LearningContentFileAdd {...props} apolloClient={client} />
            </span>
          )}
        </ApolloConsumer>
      ) : (
        <span>
          <div style={{ fontSize: '16px', marginBottom: '5px' }}>
            {'Upload your learning item'}
          </div>
          <div style={{ fontSize: '14px', marginBottom: '20px' }}>
            {'Provide a valid URL'}
          </div>
          <LearningContentUrlAdd {...props} />
        </span>
      )}
    </>
  )
}

export default withRouter(LearningContentForm)
