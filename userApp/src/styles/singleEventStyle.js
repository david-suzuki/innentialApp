import css from 'styled-jsx/css'
import variables from '$/styles/variables'

const singleEventStyle = css.global`
  .back__button {
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    color: #5a55ab;
    margin-bottom: -20px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-top: 58px;
  }

  .back__button i {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    bottom: 1px;
    right: 2px;
  }

  .event-container {
    text-align: left;
    font-family: Poppins;
  }

  .event-panel {
    width: 100%;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-align-items: flex-start;
    -webkit-box-align: flex-start;
    -ms-flex-align: flex-start;
    align-items: flex-start;
    margin-top: 43px;
  }

  .event-panel__info {
    background: ${variables.white};
    border-radius: 4px;
    box-shadow: 0 6px 11px 5px rgb(0 0 0 / 5%);
    width: 100%;
  }

  .event-panel__info-top {
    display: flex;
    padding: 22px 16px 24px 26px;
  }

  .event-panel__info-bottom {
    border-top: 1px solid ${variables.hawkesBlue};
  }

  .event-panel__background {
    max-height: 400px;
    padding-left: 50px;
    object-fit: contain;
    position: absolute;
    left: 65%;
    bottom: 0%;
    display: none;
    border-radius: 2px;
  }

  .info__main-title {
    font-size: 40px;
    font-weight: ${variables.bold700};
    line-height: 52px;
    color: ${variables.veryDarkBlue};
  }

  .info__rest {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 0 0 0 auto;
  }

  .info__rest-details {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info__rest-details__icon {
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 9px;
  }

  .info__rest-details__icon svg {
    width: 24px;
    height: 24px;
  }

  .info__rest-details__icon path {
    fill: white;
  }

  .info__rest-details__icon rect {
    fill: none;
  }

  .info__rest-details__text,
  .event-description__title,
  .event-description__text,
  .info__skills-title {
    font-size: 16px;
    font-weight: ${variables.bold900};
    line-height: 26px;
    color: ${variables.veryDarkBlue};
    white-space: nowrap;
  }

  .event-description__title {
    font-weight: ${variables.bold700};
    margin: 24px 0px 16px;
  }

  .event-description__text {
    font-weight: normal;
    white-space: normal;
    text-align: justify;
  }

  .info__skills-title {
    font-weight: ${variables.bold700};
  }

  .info__rest-details__attendees {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: start;
    -webkit-justify-content: flex-start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-flex-basis: 111px;
    -ms-flex-preferred-size: 111px;
    flex-basis: 111px;
  }

  .info__rest-details__attendees img {
    border-radius: 50%;
    box-sizing: content-box;
    border: 3px solid #ffffff;
  }

  .info__rest-details__attendees img:not(:first-child) {
    margin-left: -16px;
  }

  .info__skills {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 22px 16px 24px 28px;
  }

  .info__skills-skills {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .info__skills-skills__skill {
    color: ${variables.brandPrimary};
    background: ${variables.snowfallWhite};
    font-size: 12px;
    font-weight: ${variables.bold700};
    line-height: 18px;
    white-space: nowrap;
    border-radius: 4px;
    padding: 8px 12px;
  }

  // .tabs-header__container {
  //   display: none;
  // }

  .el-button span {
    font-size: 16px;
    font-weight: ${variables.bold700} !important;
    line-height: 26px;
    letter-spacing: 0.4px;
    font-family: Poppins;
  }

  .register-button {
  }

  .register-button--success,
  .register-button--success:hover {
    color: ${variables.white};
    background: ${variables.success80};
    border-color: ${variables.success80};
    cursor: default;
  }

  .accept-button {
    color: ${variables.white};
    background: ${variables.success80};
    border-color: ${variables.success80};
  }

  .accept-button:hover {
    color: ${variables.white};
    background: #1cb55ccf;
    border-color: #1cb55ccf;
  }

  .accept-button--plain {
    color: ${variables.success80};
    background: ${variables.white};
    border-color: ${variables.success80};
  }

  .accept-button--plain:hover {
    color: ${variables.white};
    background: #1cb55ccf;
    border-color: ${variables.success80};
  }

  .decline-button {
    color: ${variables.error80};
    background: ${variables.white};
    border-color: ${variables.error80};
  }

  .decline-button:hover {
    color: ${variables.white};
    background: #e72e2dd4;
    border-color: ${variables.error80};
  }

  .event-message {
    font-size: 14px;
    font-weight: ${variables.bold700};
    line-height: 22px;
    font-family: Poppins;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .event-message__success {
    color: ${variables.success80};
  }

  .event-message__warning {
    color: ${variables.error80};
  }

  .icon-info,
  .icon-warning {
    width: 24px;
    height: 24px;
  }

  .icon-info path {
    fill: ${variables.success80};
  }

  .icon-warning path {
    fill: ${variables.error80};
  }

  .event-calendars {
    display: flex;
    gap: 18px;
  }

  .event-calendars div {
    display: flex;
    align-items: center;
  }

  .event-calendars img {
    height: 40px;
  }

  .info__main-calendars,
  .info__main-calendars__dialog {
    font-size: 12px;
    font-weight: ${variables.bold700};
    color: ${variables.black};
    line-height: 18px;
    font-family: Poppins;
    display: flex;
    align-items: center;
    gap: 5px;
    max-width: 180px;
  }

  .info__main-calendars__dialog {
    font-size: 16px;
    line-height: 26px;
    gap: 24px;
    max-width: -webkit-fill-available;
  }

  .info__main-calendars__dialog .event-calendars {
    gap: 32px;
  }

  .invite-accept-div {
    display: flex;
  }

  @media ${variables.lg} {
    .event-panel__background {
      display: inline-block;
    }

    .event-description {
      max-width: 65%;
    }

    .event-panel__info {
      max-width: 65%;
    }
  }
`

export default singleEventStyle
