import css from 'styled-jsx/css'
import variables from '$/styles/variables'

const pastEventStyle = css.global`
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
    height: 355px;
  }

  .event-panel__info-top {
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
    font-weight: ${variables.bold900};
    line-height: 52px;
    color: ${variables.veryDarkBlue};
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .info__main-description {
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
    color: ${variables.veryDarkBlue};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    margin-top: 20px;
    padding-right: 30px;
  }

  .event-files__title,
  .info__skills-title {
    font-size: 16px;
    font-weight: ${variables.bold900};
    line-height: 26px;
    color: ${variables.veryDarkBlue};
    white-space: nowrap;
  }

  .event-files__title {
    font-weight: ${variables.bold700};
    margin: 24px 0px 16px;
  }

  
  .info__skills-title {
    font-weight: ${variables.bold700};
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

  .event-files__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .file__container {
    display: flex;
    border-radius: 4px;
  }

  .file__card {
    background: ${variables.white};
    padding: 24px;
    flex: 5;
  }

  .file__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .file__info-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .file__info-left__type, .file__info-left__duration {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: ${variables.bold700};
    line-height: 18px;
    white-space: nowrap;
    font-family: Poppins;
    color: ${variables.desaturatedBlue};
  }

  .file__info-left__type {
    border-radius: 4px;
    background: ${variables.hawkesBlue};
    padding: 4px 6px;
  }

  .file__info-left__duration {
    gap: 6px;
  }

  .file__info-icon__clock {
    width: 16px;
    height: 16px;
  }

  .file__info-icon__clock path{
    fill: ${variables.darkBlueTwo};
  }

  .file__info-right__price-tag {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: ${variables.bold700};
    line-height: 18px;
    white-space: nowrap;
    font-family: Poppins;
    color: ${variables.deepGreen};
    border-radius: 4px;
    border: 1px solid ${variables.deepGreen};
    padding: 6px;
  }

  .file__summary {
    max-width: 500px;
  }

  .file__title {
    font-size: 16px;
    font-weight: ${variables.bold700};
    line-height: 26px;
    font-family: Poppins;
    color: ${variables.veryDarkBlue};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-top: 16px;
  }

  .file__author {
    font-size: 12px;
    line-height: 18px;
    font-family: Poppins;
    color: ${variables.darkBlueTwo};
  }

  .file__description {
    border-left: 2px solid ${variables.medieval};
    margin: 16px 0px 24px;
  }

  .file__description-text {
    font-size: 14px;
    line-height: 22px;
    font-family: Poppins;
    color: ${variables.desaturatedBlue};
    padding: 4px 0px 4px 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .file__buttons {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .file__buttons-start__button, .file__buttons-save, .file__buttons-share {
    font-size: 12px;
    font-weight: ${variables.bold700};
    line-height: 18px;
    font-family: Poppins;
    letter-spacing: 0.1px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .file__buttons-start__button span {
    font-weight: ${variables.bold700} !important;
    line-height: 18px;
    font-family: Poppins;
    letter-spacing: 0.2px;
  }

  .file__buttons-save {
    color: ${variables.alloyOrange};
  }

  .file__buttons-icon__save {
    width: 16px;
    height: 14px;
    margin-right: 6px;
  }

  .file__buttons-icon__save path {
    fill: ${variables.alloyOrange};
  }

  .file__buttons-icon__send {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }

  .file__buttons-share {
    color: ${variables.desaturatedBlue};
  }

  .file__buttons-icon__share {
    margin-right: 6px;
    height: 20px;
  }

  .file__image {
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    flex: 2;
  }

  @media ${variables.lg} {
    .event-panel__background {
      display: inline-block;
    }

    .event-panel__info {
      max-width: 65%;
    }
  }
`

export default pastEventStyle
