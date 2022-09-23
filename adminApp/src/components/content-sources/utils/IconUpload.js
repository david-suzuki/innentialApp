import React, { Component } from 'react'
import { fetchIconUploadLink } from '../../../api'
import { ApolloConsumer } from 'react-apollo'
import axios from 'axios'
import { Button, Message } from 'element-react'

export default class IconUpload extends Component {
  state = {
    selectedIcon: null,
    uploadLink: null,
    previousIcon: this.props.iconSource
  }

  onFileChange = e => {
    this.setState({
      selectedIcon: e.target.files[0]
    })
    this.client
      .query({
        query: fetchIconUploadLink,
        variables: {
          sourceId: this.props.sourceId,
          contentType: 'image/png'
        }
      })
      .then(res => {
        if (res.data && res.data.fetchIconUploadLink) {
          this.setState({
            uploadLink: res.data.fetchIconUploadLink
          })
        }
      })
      .catch(e =>
        Message({
          type: 'error',
          message: `Error: ${e}`
        })
      )
  }

  deletePhoto = e => {
    e.preventDefault()
    this.setState({
      selectedIcon: null,
      uploadLink: null
    })
  }

  uploadImg = e => {
    axios
      .put(this.state.uploadLink, this.state.selectedIcon, {
        headers: {
          'Content-Type': this.state.selectedIcon.type
        }
      })
      .then(() => {
        Message({
          type: 'success',
          message: `Successfully added!`
        })
      })
      .catch(e =>
        Message({
          type: 'error',
          message: `Error: ${e}`
        })
      )
  }
  client = null

  render() {
    const { selectedIcon, previousIcon } = this.state
    const imgSrc = selectedIcon
      ? URL.createObjectURL(selectedIcon)
      : previousIcon || null
    return (
      <div>
        <ApolloConsumer>
          {client => {
            this.client = client
            return null
          }}
        </ApolloConsumer>
        <div>
          {imgSrc && (
            <div>
              <img src={imgSrc} alt='icon' />
              {selectedIcon && (
                <p onClick={this.deletePhoto} style={{ cursor: 'pointer' }}>
                  Delete icon
                </p>
              )}
            </div>
          )}
          <input type='file' onChange={e => this.onFileChange(e)} />
          <Button onClick={this.uploadImg}>Upload</Button>
        </div>
      </div>
    )
  }
}
