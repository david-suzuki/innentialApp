import React, { Component } from 'react'
import { fetchBannerUploadLink } from '../../../api'
import { ApolloConsumer } from 'react-apollo'
import axios from 'axios'
import { Button, Message } from 'element-react'

export default class BannerUpload extends Component {
  state = {
    selectedBanner: null,
    uploadLink: null,
    previousBanner: this.props.imageLink
  }

  onFileChange = e => {
    this.setState({
      selectedBanner: e.target.files[0]
    })
    this.client
      .query({
        query: fetchBannerUploadLink,
        variables: {
          pathId: this.props.pathId,
          contentType: e.target.files[0].type
        }
      })
      .then(res => {
        if (res.data && res.data.fetchBannerUploadLink) {
          this.setState({
            uploadLink: res.data.fetchBannerUploadLink
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
      selectedBanner: null,
      uploadLink: null
    })
  }

  uploadImg = e => {
    axios
      .put(this.state.uploadLink, this.state.selectedBanner, {
        headers: {
          'Content-Type': this.state.selectedBanner.type
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
    const { selectedBanner, previousBanner } = this.state
    const imgSrc = selectedBanner
      ? URL.createObjectURL(selectedBanner)
      : previousBanner || null
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
              <span>
                <figure>
                  <img
                    width='880'
                    height='510'
                    src={imgSrc}
                    alt='site-banner'
                  />
                  <figcaption style={{ fontSize: '13px' }}>
                    Banner size
                  </figcaption>
                </figure>
                <figure>
                  <img width='423' height='210' src={imgSrc} alt='site-list' />
                  <figcaption style={{ fontSize: '13px' }}>
                    List size
                  </figcaption>
                </figure>
              </span>
            </div>
          )}
          <input type='file' onChange={e => this.onFileChange(e)} />
          <Button onClick={this.uploadImg}>Upload</Button>
          {selectedBanner && (
            <Button onClick={this.deletePhoto}>Delete banner</Button>
          )}
        </div>
      </div>
    )
  }
}
