import React, { Component } from 'react'
import { fetchThumbnailUploadLink } from '../../../api'
import { ApolloConsumer } from 'react-apollo'
import axios from 'axios'
import { Button, Message } from 'element-react'

export default class ThumbnailUpload extends Component {
  state = {
    selectedThumbnail: null,
    uploadLink: null,
    previousThumbnail: this.props.imageLink
  }

  onFileChange = e => {
    this.setState({
      selectedThumbnail: e.target.files[0]
    })
    this.client
      .query({
        query: fetchThumbnailUploadLink,
        variables: {
          contentId: this.props.contentId,
          contentType: e.target.files[0].type
        }
      })
      .then(res => {
        if (res.data && res.data.fetchThumbnailUploadLink) {
          this.setState({
            uploadLink: res.data.fetchThumbnailUploadLink
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
      selectedThumbnail: null,
      uploadLink: null
    })
  }

  uploadImg = e => {
    axios
      .put(this.state.uploadLink, this.state.selectedThumbnail, {
        headers: {
          'Content-Type': this.state.selectedThumbnail.type
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
    const { selectedThumbnail, previousThumbnail } = this.state
    const imgSrc = selectedThumbnail
      ? URL.createObjectURL(selectedThumbnail)
      : previousThumbnail || null
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
              <img width='306' height='158' src={imgSrc} alt='site-Thumbnail' />
              <figcaption style={{ fontSize: '13px' }}>Preview</figcaption>
            </figure>
          )}
          <input type='file' onChange={e => this.onFileChange(e)} />
          <Button onClick={this.uploadImg}>Upload</Button>
          {selectedThumbnail && (
            <Button onClick={this.deletePhoto}>Delete thumbnail</Button>
          )}
        </div>
      </div>
    )
  }
}
