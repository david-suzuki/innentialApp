import React, { Component } from 'react'
import { Button, Dialog } from 'element-react'
import SkillsForm from './SkillsForm'

export default class SkillsAdd extends Component {
  state = {
    isFormVisible: false
  }

  toggleFormVisibility = () => {
    this.setState(({ isFormVisible }) => ({ isFormVisible: !isFormVisible }))
  }

  render() {
    return (
      <div>
        <Button
          style={{
            marginRight: '15px'
          }}
          type='primary'
          onClick={this.toggleFormVisibility}
        >
          Add New Skill
        </Button>
        <Dialog
          title={
            this.props.organizationId
              ? 'Add skill to organization'
              : 'Add new skill'
          }
          visible={this.state.isFormVisible}
          onCancel={this.toggleFormVisibility}
        >
          <Dialog.Body>
            <SkillsForm
              organizationId={this.props.organizationId}
              toggleDialog={this.toggleFormVisibility}
            />
          </Dialog.Body>
        </Dialog>
      </div>
    )
  }
}
