import React, { Component } from 'react'
import { fetchAuthorImageUploadLink } from '../../../api'
import { ApolloConsumer } from 'react-apollo'
import axios from 'axios'
import { Button, Message } from 'element-react'

export default class AuthorImageUpload extends Component {
  state = {
    selectedAuthorImage: null,
    uploadLink: null,
    previousAuthorImage: this.props.imageLink
  }

  onFileChange = e => {
    this.setState({
      selectedAuthorImage: e.target.files[0]
    })
    this.client
      .query({
        query: fetchAuthorImageUploadLink,
        variables: {
          pathId: this.props.pathId,
          contentType: e.target.files[0].type
        }
      })
      .then(res => {
        if (res.data && res.data.fetchAuthorImageUploadLink) {
          this.setState({
            uploadLink: res.data.fetchAuthorImageUploadLink
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
      selectedAuthorImage: null,
      uploadLink: null
    })
  }

  uploadImg = e => {
    axios
      .put(this.state.uploadLink, this.state.selectedAuthorImage, {
        headers: {
          'Content-Type': this.state.selectedAuthorImage.type
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
    const { selectedAuthorImage, previousAuthorImage } = this.state
    const imgSrc = selectedAuthorImage
      ? URL.createObjectURL(selectedAuthorImage)
      : previousAuthorImage || null
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
            <figure>
              <img width='240' height='240' src={imgSrc} alt='preview' />
              <figcaption style={{ fontSize: '13px' }}>Preview</figcaption>
            </figure>
          )}
          <input type='file' onChange={e => this.onFileChange(e)} />
          <Button onClick={this.uploadImg}>Upload</Button>
          {selectedAuthorImage && (
            <Button onClick={this.deletePhoto}>Delete image</Button>
          )}
        </div>
      </div>
    )
  }
}
