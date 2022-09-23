import css from 'styled-jsx/css'
import variables from '$/styles/variables'

const eventTemplateStyle = css.global`
  .event-template__container {
    display: flex;
    gap: 24px;
    text-align: left;
  }
 
  .event-template__header {
    font-style: normal;
    font-weight: ${variables.bold900};
    font-size: 24px;
    line-height: 38px;
    color: ${variables.veryDarkBlue};
    text-align: left;
    margin-top: 75px;
  }

  .event-template__form {
    flex: 3;
    max-width: 528px;
  }

  .form-title {
    text-align: left;
  }

  .form-title .darker-border .el-input__inner {
    border: 1px solid ${variables.grey80};
  }

  .form-format__input .darker-border .el-input__inner {
    border: 1px solid ${variables.grey80};
  }

  .form-title .error-border .el-input__inner {
    border: 1px solid ${variables.error60};
  }

  .form-title .el-input__inner {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    padding: 9px 0 9px 16px;
    border: 1px solid ${variables.darkBlueTwo};
  }

  .error-border .el-input__inner {
    border: 1px solid ${variables.error60};
  }

  textarea.el-textarea__inner {
    font-family: Poppins;
    background: ${variables.white};
    border: 1px solid ${variables.darkBlueTwo};
    box-sizing: border-box;
    border-radius: 4px;
    padding: 8px 16px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.veryDarkBlue};
  }

  .form-format__input .el-input__inner{
    font-family: Poppins;
    border: 1px solid ${variables.darkBlueTwo};
    box-sizing: border-box;
    border-radius: 4px;
    padding: 8px 16px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.veryDarkBlue};
    padding-right: 36px;
  }

  .form-link .el-input__inner{
    font-family: Poppins;
    border: 1px solid ${variables.darkBlueTwo};
    box-sizing: border-box;
    border-radius: 4px;
    padding: 8px 16px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.veryDarkBlue};
  }

  .form-format__input svg {
      position: absolute;
      right: 10px;
      top: 25px;
  }

  .form-link {
      margin: 6px 0px 22px;
  }

  .el-input__inner::-webkit-input-placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
  }

  .el-input__inner:-ms-input-placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
  }

  .el-input__inner::placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
  }

  .form-format__input .el-input__inner::placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 14px;
    line-height: 22px;
    font-weight: normal;
  }

  .form-link .el-input__inner::placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 14px;
    line-height: 22px;
    font-weight: normal;
  }

  .el-select .el-input .el-input__inner::placeholder {
    font-weight: normal;
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 14px;
    line-height: 22px;
    padding: 14px;
  }

  .el-select .el-input .el-input__inner {
    color: ${variables.veryDarkBlue};
  }

  .smaller-font .el-input .el-input__inner::placeholder {
    font-weight: normal;
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 12px;
    line-height: 26px;
  }

  .form-title__info {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    color: ${variables.desaturatedBlue};
    padding: 4px 0px 18px;
  }

  .form-title__info--error {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    color: ${variables.error60};
    padding: 8px 0px;
  }

  .ql-editor {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 14px;
    max-height: 100px;
  }

  .item__content .ql-editor{
    min-height: auto;
  }

  .ql-editor.ql-blank::before {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
  }

  .ql-toolbar.ql-snow {
    border: 1px solid ${variables.darkBlueTwo};
    border-radius: 4px 4px 0px 0px;
    border-bottom: none;
}

.ql-editor {
    border: 1px solid ${variables.darkBlueTwo};
    border-radius: 0px 0px 4px 4px;
    color: ${variables.grey80};
}

.form-group .ql-toolbar.ql-snow {
    border: 1px solid ${variables.darkBlueTwo};
    border-bottom: none;
}

.form-group .ql-editor {
    border: 1px solid ${variables.darkBlueTwo};
}

.ql-container.ql-snow {
    border: none;
    margin-bottom: 16px;
}

.darker-border .ql-toolbar.ql-snow {
    border: 1px solid ${variables.grey80};
    border-bottom: none;
}

.darker-border .ql-editor {
    border: 1px solid ${variables.grey80};
    /* color: ${variables.grey80}; */
}

.ql-snow .ql-stroke {
    stroke: ${variables.darkBlueTwo};
}

.darker-border .ql-snow .ql-stroke {
    stroke: ${variables.grey80};
}

.form-type, .form-format, .form-schedule, .form-skills {
  text-align: left;
}

.form-label {
    color: ${variables.black};
    font-family: Poppins;
    font-weight: ${variables.bold700};
    font-size: 14px;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.form-type__radios, .form-format__radios, .form-price__radios {
    margin: 17px 0px 17px 0px;
    display: flex;
    align-items: center;
    position: relative;
}
.form-price__radios {
    margin-right: 19px;
}

.form-format__radios {
  justify-content: space-between;
}

.el-radio__inner {
    border: 1px solid ${variables.darkBlueTwo};
}

.el-radio__label, .el-checkbox__label, .el-checkbox__input.is-checked+.el-checkbox__label {
    font-size: 14px;
    line-height: 22px;
    color: ${variables.veryDarkBlue};
    padding-left: 12px;
}

.form-type__radios .el-radio, .form-format__radios .el-radio{
  max-width: 76px;
}

.form-format__input {
position: relative;
    width: 100%;
    max-width: 310px;
    bottom: 34px;
}
.form-format__input .el-input{
position: absolute;
}

.form-schedule__dates, .form-schedule__time, .form-price__row {
  display: flex;
  align-items: center;
  margin-bottom: 13px;
}

.form-schedule__dates {
  margin: 8px 0px 12px;
}

.form-schedule__time {
  margin-bottom: 16px;
}

.react-datepicker-wrapper {
    width: unset;
}

.react-datepicker__input-container {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 137px;
    max-height: 50px;
}

.react-datepicker__input-container input {
    width: inherit;
    height: inherit;
    color: ${variables.veryDarkBlue};
    border: 1px solid ${variables.darkBlueTwo};
    border-radius: 4px;
    padding: 13px 0px 14px 13px;
    font-size: 14px;
    line-height: 22px;
}
.react-datepicker__input-container input::placeholder {
    width: inherit;
    height: inherit;
    color: ${variables.darkBlueTwo};
}

.react-datepicker__input-container input:focus-visible {
  outline: ${variables.darkBlueTwo} auto 1px; 
}
.react-datepicker__day--selected {
  background-color: ${variables.brandPrimary};
}
.react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
  background-color: ${variables.brandPrimary};
}


.form-schedule__dates-icon {
  width: 17px;
  height: 17px;
  margin-right: 15px;
  }

.form-schedule__time-icon {
  width: 19px;
  height: 19px;
  margin-right: 13px;
  }

.form-schedule__dates-icon path {
  fill: ${variables.darkBlueTwo};
}

.form-schedule__time-icon {
  stroke: ${variables.darkBlueTwo};
}

.el-checkbox__inner {
    border-radius: 4px;
    border: 1px solid ${variables.darkBlueTwo};
    box-sizing: border-box;
}

.el-checkbox {
  max-width: 24px;
  margin-left: 24px;
}

.form-price__input {
  max-width: 69px;
  max-height: 50px;
  margin-right: 11px;
}

.form-currency__input {
  max-width: 86px;
  max-height: 50px;
}

.form-price .el-input__inner {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    padding: 14px 14px 14px 16px;
    border: 1px solid ${variables.darkBlueTwo};
    height: inherit;
    margin-top: 0px;
  }

.form-price .el-input__inner::-webkit-input-placeholder {
    color: ${variables.darkBlueTwo};
    font-family: Poppins;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
  }

  .form-price .el-input__inner:-ms-input-placeholder {
    color: ${variables.darkBlueTwo};
    font-family: Poppins;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
  }

  .form-price .el-input__inner::placeholder {
    color: ${variables.darkBlueTwo};
    font-family: Poppins;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
  }

.form-skills {
  height: 92px;
}

.form-schedule__time .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
  max-width: 135px;
  width: 100%
}

.form-schedule__time .react-datepicker  {
  max-width: 135px;
  width: 100%
}

.form-schedule__time .react-datepicker-popper[data-placement^=bottom] {
    padding-top: 10px;
    width: 135px;
}

.form-schedule__time .react-datepicker--time-only .react-datepicker__time-container {
   max-width: 133px;
   width: 100%
}

.form-schedule__time .react-datepicker__input-container input {
    width: inherit;
    height: inherit;
    color: #152540;
    border: 1px solid #8494b2;
    border-radius: 4px;
    padding: 13px 0px 14px 13px;
    font-size: 14px;
    line-height: 22px;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
    background-color: ${variables.brandPrimary};
}

.goal-skills__list {
    color: ${variables.brandPrimary};
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.goal-skills__list-tag {
    margin: 8px 15px 8px 0;
    background-color: ${variables.paleLilacTwo};
    padding: 8px 12px;
    border-radius: 4px;
}

.switch-text {
    color: ${variables.grey80};
    font-family: Poppins;
    font-weight:  normal;
    font-size: 12px;
    line-height: 18px;
    padding-right: 8px;
}

.el-switch__core {
    width: 43px;
    height: 17px;
    border: 1px solid ${variables.darkBlueTwo};
    background: ${variables.white};
}

.el-switch__core:after {
    width: 13px;
    height: 13px;
    background-color: ${variables.darkBlueTwo};
}

.el-switch.is-checked .el-switch__core {
    border-color:${variables.success80};
    background: ${variables.white};
}

.el-switch.is-checked .el-switch__core::after {
    border: 1px solid ${variables.success80};
    background-color: ${variables.success80};
    margin-left: -15px;
}

.list-skill-selector__button-input {
    border: 1px solid ${variables.darkBlueTwo};
}

.event-template__upload {
    background: ${variables.hawkesBlue};
    border-radius: 4px;
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${variables.desaturatedBlue};
    margin-top: 12px;
    position: relative;
    font-size: 12px;
    max-height: 272px;
    max-width: 390px;
  }

  .event-template__upload--uploaded {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: ${variables.white};
  }

  .event-template__upload-delete {
    cursor: pointer;
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
  }

  .event-template__upload-delete i {
    font-size: 14px;
    padding-top: 1px;
  }

  .event-template__upload-icon {
    background: ${variables.greyishBlue};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    margin-bottom: 10px;
  }

  .event-template__upload-icon--uploaded {
    background: ${variables.veryDarkBlue};
  }

  .el-icon-caret-top:before {
      content: "\\e605";
  }
  
  .el-select .el-input.is-disabled .el-input__inner {
    color: #d2d0d0;
    background-color: transparent;
  }

  .form-schedule__dates-divider {
    color: ${variables.darkBlueTwo};
    padding: 0px 20px;
    font-size: 24px;
  }

.el-input__icon {
   top: 0px;
}

.el-select:hover .el-input__inner {
    border-color: ${variables.darkBlueTwo};
    }

.list-skill-selector {
  cursor: pointer;
}

.form-skills__list {
    color: ${variables.brandPrimary};
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.form-skills__list-tag{
    margin: 8px 15px 8px 0;
    background-color: #f2f1ff;
    padding: 8px 12px;
    border-radius: 4px;
}

.list-skill-selector__button-input {
    padding: 13px 16px;
    font-size: 14px;
    color: ${variables.darkBlueTwo};
    margin: 6px 0px 16px;
}

.el-input__inner {
  border-color: ${variables.darkBlueTwo};
  height: 50px;
}

.form-title .el-input__inner {
  border-color: ${variables.darkBlueTwo};
  height: auto;
}

.page-footer {
    width: 120vw;
    margin-left: calc(430px - 59vw);
    height: 100px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    position: -webkit-sticky;
    position: sticky;
    top: auto;
    bottom: 0;
    right: 0;
    box-shadow: 0px -1px 4px RGBA(0,8,32,0.04), 0px -16px 32px RGBA(0,8,32,0.04);
    margin-top: 260px;
    z-index: 3;
}

.event-template__footer {
    max-width: 928px;
    width: inherit;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
}

.event-template__footer-back {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    text-align: center;
    -webkit-letter-spacing: 0.008em;
    -moz-letter-spacing: 0.008em;
    -ms-letter-spacing: 0.008em;
    letter-spacing: 0.008em;
    color: ${variables.desaturatedBlue};
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.event-template__footer-back i {
    font-size: 21px;
    color: ${variables.desaturatedBlue};
    background: none;
    border: none;
}

.event-template__footer-buttons {
  display: flex;
  align-items: center;
}

.event-template__footer-buttons button {
  color: ${variables.desaturatedBlue};
  font-weight: ${variables.bold700};
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 0.008em;
  font-family: Poppins;
}

.el-button--large {
    padding: 12px 38px !important;
    border-radius: 100px;
}

.el-button--large span {
    font-weight: ${variables.bold700} !important;
    font-size: 16px;
    line-height: 26px;
    text-align: center;
    -webkit-letter-spacing: 0.008em;
    -moz-letter-spacing: 0.008em;
    -ms-letter-spacing: 0.008em;
    letter-spacing: 0.008em;
    font-family: Poppins;
}

.button-disabled {
  padding: 12px 38px;
  border-radius: 100px;
  font-weight: ${variables.bold700};
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  -webkit-letter-spacing: 0.008em;
  -moz-letter-spacing: 0.008em;
  -ms-letter-spacing: 0.008em;
  letter-spacing: 0.008em;
  font-family: Poppins;
  color: ${variables.white};
  border: 1px solid ${variables.hawkesBlue};
  background-color: ${variables.hawkesBlue};
  box-sizing: border-box;
  cursor: default;
}

.form-attendees {
  margin-top: 16px;
}

.form-attendees__input {
  border: 1px solid ${variables.darkBlueTwo};
  height: 49px;
  width: 100%;
  cursor: pointer;
  border-radius: 4px;
  background: ${variables.white};
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-attendees__input span{
  color: ${variables.veryDarkBlue};
  font-size: 14px;
  line-height: 22px;
  font-family: Poppins;
}

.form-attendees__input-change{
  color: ${variables.medieval};
  font-size: 14px;
  line-height: 22px;
  font-weight: ${variables.bold700};
  font-family: Poppins;
}

.el-dialog__wrapper {
    top: 30% !important;
}

.el-dialog {
    max-width: 600px !important;
}

.el-dialog__title {
    line-height: 26px;
    font-size: 16px;
    color: ${variables.black};
    font-weight: ${variables.bold700};
}

.el-dialog__headerbtn {
    top: 20px;
    right: 20px;
    font-size: 16px;
    border: 1px solid ${variables.darkBlueTwo};
     border-radius: 50%;
}

.el-dialog__headerbtn .el-dialog__close {
    color: ${variables.darkBlueTwo};
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 2px 2px; */
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${variables.bold700};
}

.el-dialog__body {
    padding: 15px 20px 30px !important;
}

.select-autosuggest-in-modal .el-input__inner {
    color: ${variables.grey80} !important;
     line-height: 26px;
    font-size: 16px;
    font-weight: ${variables.bold700};
    height: 50px !important;
}
.select-autosuggest-in-modal .el-input__inner::placeholder {
    padding-left: 0px !important;
}

.select-autosuggest-in-modal .el-input__icon {
    top: 7px;
    right: 8px;
}

.select-autosuggest-in-modal .react-autosuggest__container input {
    color: ${variables.grey80};
}
.select-autosuggest-in-modal .react-autosuggest__container input::placeholder {
    color: ${variables.grey80};
}
`

export default eventTemplateStyle
