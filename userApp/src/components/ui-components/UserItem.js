import React, { Component } from 'react'
import userItemStyle from '../../styles/userItemStyle'
import history from '../../history'
import Location from '../../components/ui-components/Location'

// class Timer extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       time: 0,
//       isOn: false,
//       start: 0
//     }
//     this.startTimer = this.startTimer.bind(this)
//     this.stopTimer = this.stopTimer.bind(this)
//     this.resetTimer = this.resetTimer.bind(this)
//   }
//   startTimer() {
//     this.setState({
//       isOn: true,
//       time: this.state.time,
//       start: Date.now() - this.state.time
//     })
//     this.timer = setInterval(
//       () =>
//         this.setState({
//           time: Date.now() - this.state.start
//         }),
//       1
//     )
//   }
//   stopTimer() {
//     this.setState({ isOn: false })
//     clearInterval(this.timer)
//   }
//   resetTimer() {
//     this.setState({ time: 0, isOn: false })
//   }
//   render() {
//     return null
//   }
// }

// // const timerUi = (state) => {

// //   let start = (state.time == 0) ?
// //     <button onClick={startTimer}>start</button> :
// //     null
// //   let stop = (state.time == 0 || !state.isOn) ?
// //     null :
// //     <button onClick={this.stopTimer}>stop</button>
// //   let resume = (this.state.time == 0 || this.state.isOn) ?
// //     null :
// //     <button onClick={this.startTimer}>resume</button>
// //   let reset = (this.state.time == 0 || this.state.isOn) ?
// //     null :
// //     <button onClick={this.resetTimer}>reset</button>
// //   return (
// //     <div>
// //       <h3>timer: {(this.state.time)}</h3>
// //       {start}
// //       {resume}
// //       {stop}
// //       {reset}
// //     </div>
// //   )
// // }
export default class UserItem extends Component {
  state = {
    activeDropdown: false,
    closingDropdown: false,
    time: 0,
    isOn: false,
    start: 0
  }

  startTimer() {
    this.setState({
      isOn: true,
      time: this.state.time,
      start: Date.now() - this.state.time
    })
    this.timer = setInterval(
      () =>
        this.setState({
          time: Date.now() - this.state.start
        }),
      10
    )
  }

  stopTimer() {
    this.setState({ isOn: false })
    clearInterval(this.timer)
  }

  resetTimer() {
    this.setState({ time: 0, isOn: false })
  }

  dropdownOptions = this.props.dropdownOptions ? this.props.dropdownOptions : []

  toggleDropdown = () => {
    this.setState({ activeDropdown: !this.state.activeDropdown })
  }

  closeDropdownDelay = () => {
    const { time, isOn } = this.state
    if (time === 0 && !isOn) this.startTimer()
  }

  clickDropdown = () => {
    const { activeDropdown } = this.state
    if (activeDropdown) {
      this.setState({ activeDropdown: false })
      this.stopTimer()
      this.resetTimer()
    } else {
      this.setState({ activeDropdown: true })
      this.stopTimer()
      this.resetTimer()
      this.startTimer()
    }
  }

  resetDropdownDelay = () => {
    const { isOn } = this.state
    if (!isOn) return
    this.stopTimer()
    this.resetTimer()
  }

  componentWillUpdate() {
    if (this.state.time > 3500) {
      this.stopTimer()
      this.resetTimer()

      this.toggleDropdown()
    }
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  render() {
    return (
      <div className='list-item user-item'>
        <div
          className='user-item__data user-item__data-is-active'
          onClick={() => {
            history.push(`/profiles/${this.props.uuid}`)
          }}
        >
          <img src={this.props.img} alt='User' />
          <div className='user-item__details'>
            {this.props.roles && this.props.roles.indexOf('ADMIN') !== -1 && (
              <p className='user-item__is-admin'>Administrator</p>
            )}
            <div className='list-item__label'>{this.props.label}</div>
            <div className='list-item__title'>
              <div className='user-item__name'>{this.props.name}</div>

              <span
                className={`user-item__status ${
                  this.props.isActive
                    ? 'user-item__status--green'
                    : this.props.isDisabled
                    ? 'user-item__status--red'
                    : ''
                }`}
              >
                {this.props.status}
              </span>
            </div>
            <div className='user-item__details__profession'>
              {this.props.profession}
            </div>
            {this.props.location && (
              <div className='user-item__details__location'>
                <Location location={this.props.location} size='small' />
              </div>
            )}
          </div>
        </div>
        {this.dropdownOptions.length > 0 ? (
          <div>
            <div className='user-item__children' onClick={this.clickDropdown}>
              {this.props.children}
            </div>
            <div
              className={
                this.state.activeDropdown
                  ? 'user__dropdown is-active'
                  : 'user__dropdown'
              }
              onMouseLeave={this.closeDropdownDelay}
              onMouseEnter={this.resetDropdownDelay}
            >
              <ul>
                {this.dropdownOptions.map((el, idx) => {
                  // if (
                  //   el.value === 'Give feedback' ||
                  //   el.value === 'Set as leader'
                  // ) {
                  //   if (this.props.isActive || this.props.isDisabled) {
                  //     return (
                  //       <li key={idx}>
                  //         <a
                  //           onClick={e =>
                  //             el.boundFunction(
                  //               this.props.uuid,
                  //               this.props.name || this.props.email
                  //             )
                  //           }
                  //         >
                  //           {el.value}
                  //         </a>
                  //       </li>
                  //     )
                  //   } else return null
                  // }
                  return (
                    <li key={idx}>
                      <a
                        onClick={e =>
                          el.boundFunction(
                            this.props.uuid,
                            this.props.name || this.props.email
                          )
                        }
                      >
                        {el.value}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : this.props.children && this.props.isActive ? (
          this.props.children
        ) : null}
        <style jsx>{userItemStyle}</style>
      </div>
    )
  }
}
