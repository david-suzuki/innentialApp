import React, { Component } from 'react'
import { fetchAuthorCompanyLogoUploadLink } from '../../../api'
import { ApolloConsumer } from 'react-apollo'
import axios from 'axios'
import { Button, Message } from 'element-react'

export default class CompanyLogoUpload extends Component {
  state = {
    selectedCompanyLogo: null,
    uploadLink: null,
    previousCompanyLogo: this.props.imageLink
  }

  onFileChange = e => {
    this.setState({
      selectedCompanyLogo: e.target.files[0]
    })
    this.client
      .query({
        query: fetchAuthorCompanyLogoUploadLink,
        variables: {
          pathId: this.props.pathId,
          contentType: e.target.files[0].type
        }
      })
      .then(res => {
        if (res.data && res.data.fetchAuthorCompanyLogoUploadLink) {
          this.setState({
            uploadLink: res.data.fetchAuthorCompanyLogoUploadLink
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
      selectedCompanyLogo: null,
      uploadLink: null
    })
  }

  uploadImg = e => {
    axios
      .put(this.state.uploadLink, this.state.selectedCompanyLogo, {
        headers: {
          'Content-Type': this.state.selectedCompanyLogo.type
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
    const { selectedCompanyLogo, previousCompanyLogo } = this.state
    const imgSrc = selectedCompanyLogo
      ? URL.createObjectURL(selectedCompanyLogo)
      : previousCompanyLogo || null
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
              <img width='43' height='43' src={imgSrc} alt='preview' />
              <figcaption style={{ fontSize: '13px' }}>Preview</figcaption>
            </figure>
          )}
          <input type='file' onChange={e => this.onFileChange(e)} />
          <Button onClick={this.uploadImg}>Upload</Button>
          {selectedCompanyLogo && (
            <Button onClick={this.deletePhoto}>Delete image</Button>
          )}
        </div>
      </div>
    )
  }
}
