import React, { Component } from 'react'
import { generateInitialsAvatar } from '$/utils'
import userPlaceholder from '$/static/nobody.jpg'
import photoStyle from '../../styles/photoStyle'
import { getImgUploadLink, currentUser, deleteProfileImage } from '../../api'
import { ApolloConsumer } from 'react-apollo'
import axios from 'axios'
import { Notification } from 'element-react'
import { captureFilteredError, LoadingSpinner } from '../general'

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
export default class Photo extends Component {
  state = {
    selectedFile: null,
    uploadLink: null,
    previousImage: null,
    isLoading: false,
    user: null
  }

  componentDidMount() {
    this.client
      .query({
        query: currentUser
      })
      .then(res => {
        if (res?.data?.currentUser) {
          this.setState({
            user: res.data.currentUser,
            previousImage: res?.data?.currentUser?.imageLink
          })
        }
      })
      .catch(e => captureFilteredError(e))
  }

  onFileChange = e => {
    const contentType = e.target.files[0].type
    if (
      allowedTypes.indexOf(contentType) !== -1 &&
      e.target.files[0].size < 200000
    ) {
      this.setState({
        selectedFile: e.target.files[0]
      })
      this.client
        .query({
          query: getImgUploadLink,
          variables: {
            contentType: e.target.files[0].type
          }
        })
        .then(res => {
          if (res.data && res.data.getImgUploadLink) {
            this.setState(
              {
                uploadLink: res.data.getImgUploadLink
              },
              this.uploadImg
            )
          }
        })
        .catch(e => captureFilteredError(e))
    } else {
      if (allowedTypes.indexOf(contentType) === -1) {
        Notification({
          message: 'Please input a valid image type',
          type: 'error',
          duration: 2500,
          iconClass: 'el-icon-error',
          offset: 90
        })
      }
      if (e.target.files[0].size >= 200000) {
        Notification({
          message: 'File size too large',
          type: 'error',
          duration: 2500,
          iconClass: 'el-icon-error',
          offset: 90
        })
      }
      e.target.value = ''
    }
  }

  deletePhoto = e => {
    e.preventDefault()
    this.setState({
      isLoading: true
    })

    this.client
      .mutate({
        mutation: deleteProfileImage,
        refetchQueries: ['currentUser', 'fetchCurrentUserTeams', 'fetchTeam']
      })
      .then(res => {
        this.setState({
          selectedFile: null,
          previousImage: null,
          isLoading: false
        })
        if (res.data.deleteProfileImage === 'success') {
          Notification({
            type: 'success',
            message: 'Image deleted successfully',
            duration: 2500,
            offset: 90
          })
        } else {
          Notification({
            type: 'warning',
            message: 'Something went wrong',
            duration: 2500,
            offset: 90
          })
        }
      })
      .catch(e => {
        this.setState({
          selectedFile: null,
          previousImage: null,
          isLoading: false
        })
        Notification({
          type: 'error',
          message: 'Something went wrong',
          duration: 2500,
          offset: 90,
          iconClass: 'el-icon-error'
        })
        captureFilteredError(e)
      })
  }

  uploadImg = e => {
    // TODO: USER FEEDBACK FOR UPLOAD STATE!
    this.setState({ isLoading: true })
    axios
      .put(this.state.uploadLink, this.state.selectedFile, {
        headers: {
          'Content-Type': this.state.selectedFile.type
        }
      })
      .then(res => {
        /*  VALIDATE IT WAS SUCCESSFULl */
        this.setState({ isLoading: false })
        this.client.reFetchObservableQueries()
        Notification({
          type: 'success',
          message: 'Image uploaded successfully',
          duration: 2500,
          offset: 90
        })
      })
      .catch(e => {
        captureFilteredError(e)
        this.setState({ isLoading: false })
      })
  }

  client = null

  render() {
    const { selectedFile, previousImage, isLoading } = this.state
    return (
      <div>
        <ApolloConsumer>
          {client => {
            this.client = client
            return null
          }}
        </ApolloConsumer>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <div className='el-form-item__label'>Profile image</div>
            <p className='el-form-item__caption'>
              Available formats: JPG, PNG, GIF <br />
              Size: less than 200kB
            </p>
            <div className='photo'>
              <img
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : previousImage ||
                      (this.state.user
                        ? generateInitialsAvatar(this.state.user)
                        : userPlaceholder)
                }
                alt='user'
              />
            </div>
            {(selectedFile || previousImage) && (
              <div className='photo__delete' onClick={this.deletePhoto}>
                Delete photo
              </div>
            )}
            <label
              htmlFor='file-upload'
              className='el-button el-button--primary'
            >
              Upload file
            </label>
            <input
              id='file-upload'
              type='file'
              onChange={e => this.onFileChange(e)}
              style={{ display: 'none' }}
            />
          </div>
        )}
        <style jsx>{photoStyle}</style>
      </div>
    )
  }
}
