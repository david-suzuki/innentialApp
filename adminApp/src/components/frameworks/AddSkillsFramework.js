import React, { Component } from 'react'
import { Button, Dialog } from 'element-react'
import SkillsFrameworkForm from './SkillsFrameworkForm'

export default class FrameworkAdd extends Component {
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
          Add new Skill Framework
        </Button>
        <Dialog
          title={`Add skills framework`}
          visible={this.state.isFormVisible}
          onCancel={this.toggleFormVisibility}
        >
          <Dialog.Body>
            <SkillsFrameworkForm
              toggleDialog={this.toggleFormVisibility}
              forSkills={this.props.forSkills}
              organizationId={this.props.organizationId}
            />
          </Dialog.Body>
        </Dialog>
      </div>
    )
  }
}
