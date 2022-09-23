import css from 'styled-jsx/css'
import variables from './variables'

export const pathTemplateFormStyle = css.global`
  .path-template__container {
    padding-top: 90px;
    max-width: 900px;
    min-height: 100vh;
    padding-bottom: 100px;
    position: relative;
    right: 40px;
  }

  .path-template__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .path-template__header-info {
    max-width: 525px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .path-template__header-info__title{
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    line-height: 38px;
    color: ${variables.veryDarkBlue};
    width: 100%;
    text-align: left;
  }

  .path-template__header-info__duration {
    display: flex;
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.008em;
    color: ${variables.grey80};
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
  }

  .path-template__header-info__duration .el-input .el-input__inner {
    margin-top: 0px;
    padding: 6px 12px;
    text-align: center;
    font-size: 14px;
    color: ${variables.desaturatedBlue};
  }

  .path-template__header-info__duration-title {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .path-template__header-info__duration-title i{
    font-size: 21px;
    font-weight: ${variables.bold700};
  }

  .path-template__header-info__duration-hours {
    color: ${variables.desaturatedBlue};
    background: #FFFFFF;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 16px;
  }

  .path-template__header-duplicate {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 10px;
    letter-spacing: 0.008em;
    color: ${variables.brandSecondary};
    border: 1px solid ${variables.brandSecondary};
    border-radius: 100px;
    padding: 6px 16px;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  svg.duplicate-icon path {
    fill: ${variables.brandSecondary};
  }

  .path-template__label {
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.black};
  }

  .path-template__form {
    display: flex;
    gap: 24px;
    margin-bottom: 55px;
  }

  .path-template__form-inputs {
    flex: 3;
  }

  .path-template__form-info {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    color: ${variables.desaturatedBlue};
    padding: 8px 0px;
  }

  .path-template__form-info--error {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    color: ${variables.error60};
    padding: 8px 0px;
  }

  .path-template__form-upload {
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
  }

  .path-template__form-upload--uploaded {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: ${variables.white};
  }

  .path-template__form-upload__delete {
    cursor: pointer;
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
  }

  .path-template__form-upload__delete i {
    font-size: 14px;
    padding-top: 1px;
  }

  .path-template__form-upload__icon {
    background: ${variables.greyishBlue};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    margin-bottom: 10px;
  }

  .path-template__form-upload__icon--uploaded {
    background: ${variables.veryDarkBlue};
  }

  .path-template__form-upload span {
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
  }

  .form-group .el-input__inner {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    padding: 9px 0 9px 16px;
  }

  .form-group .darker-border .el-input__inner {
    border: 1px solid ${variables.grey80};
  }

  .form-group .error-border .el-input__inner {
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
    color: ${variables.grey80};
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

  .el-select .el-input .el-input__inner,
  .el-select .el-input .el-input__inner::placeholder {
    font-weight: normal;
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 16px;
    line-height: 26px;
  }

  .smaller-font .el-input .el-input__inner::placeholder {
    font-weight: normal;
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 12px;
    line-height: 26px;
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

  .item__content .ql-container.ql-snow{
    max-width: 824px;
  }

  .ql-editor.ql-blank::before {
    color: ${variables.darkBlueTwo};
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
  }

  .el-button--lilac {
    opacity: 1;
    padding: 12px 30px;
    border-radius: 100px;
  }

  .el-button--lilac span {
    font-family: Poppins;
    font-size: 16px;
    font-weight: ${variables.bold700} !important;
    display: flex;
    gap: 9px;
    align-items: center;
  }

  .el-button--large {
    padding: 12px 38px !important;
    border-radius: 100px;
  }

  .el-button--large span {
    font-weight: bold !important;
    font-size: 16px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.008em;
    font-family: Poppins;
  }

  .el-button--secondary {
    color: ${variables.white};
    background-color: ${variables.hawkesBlue};
    border-color: ${variables.hawkesBlue};
  }

  /* .goal-item__skills-wrapper p {
    font-style: normal;
    font-weight: bold;
    font-size: 14px !important;
    line-height: 22px;
    color: ${variables.grey80};
  } */

  /* .list-skill-selector p {
    font-style: normal;
    font-weight: normal;
    font-size: 14px !important;
    line-height: 22px;
    color: ${variables.darkBlueTwo};
  } */

  .page-footer {
    width: 120vw;
    margin-left: calc(430px - 59vw);
    height: 100px;
    box-shadow: 0px -1px 4px RGBA(0, 8, 32, 0.04),
      0px -16px 32px RGBA(0, 8, 32, 0.04);
    display: flex;
    justify-content: center;
    position: sticky;
    top: auto;
    bottom: 0;
    right: 0;
    box-shadow: 0px -1px 4px RGBA(0, 8, 32, 0.04),
      0px -16px 32px RGBA(0, 8, 32, 0.04);
    margin-top: 200px;
    z-index: 3;
  }

  .path-template__footer {
    max-width: 900px;
    width: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .path-template__footer-back {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.008em;
    color: ${variables.desaturatedBlue};
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .path-template__footer-back i {
    font-size: 21px;
    color: ${variables.desaturatedBlue};
    background: none;
    border: none;
  }

  .quill {
    margin-bottom: 0 !important;
  }

   input.custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
  }
  input.custom-file-input::before {
    content: 'Select some files';
    display: inline-block;
    background: linear-gradient(top, #f9f9f9, #e3e3e3);
    border: 1px solid #999;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
  }
  input.custom-file-input:hover::before {
    border-color: black;
  }
  input.custom-file-input:active::before {
    background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
  }

  input[type="file"] {
    display: none;
}
.custom-file-upload {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}

.goal-item__name .el-input, .list-skill-selector__button-input {
  max-width: 590px;
}

//  .goal-item__skills {
//   max-width: 550px;
// }

.goal-item__buttons-wrapper--active{
  max-width: 550px;
}

.goal-item__skills-wrapper--path  {
    display: none !important;
  }

.ql-toolbar.ql-snow {
    border: 1px solid ${variables.grey80};
    border-radius: 4px 4px 0px 0px;
    border-bottom: none;
}

.ql-editor {
    border: 1px solid ${variables.grey80};
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
    max-width: 526px;
}

.darker-border .ql-toolbar.ql-snow {
    border: 1px solid ${variables.grey80};
    border-bottom: none;
    max-width: 526px;
}

.darker-border .ql-editor {
    border: 1px solid ${variables.grey80};
    color: ${variables.grey80};
}

.el-input__icon {
    top: 0px;
}
.el-button--primary:active, .el-button--primary:focus {
  background: ${variables.brandPrimary};
  border-color: ${variables.brandPrimary};
}

.goal-item__update-button:hover {
    background: none !important;
    border-color: ${variables.brandPrimary} !important;
    color: ${variables.brandPrimary} !important;
}

.goals-order {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 42px;
  max-width: 700px;
  cursor: default;
}

.goals-order__goals {
  display: flex;
  gap: 8px;
  align-items: center;
}

.goals-order__goals-title {
  font-size: 16px;
  font-weight: 900;
  color: ${variables.black};
}

.goals-order__goals-number {
  color: ${variables.brandPrimary};
  font-size: 12px;
  background-color: ${variables.snowfallWhite};
  border-radius: 100px;
  padding: 2px 8px;
}

.goals-order__order-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.goals-order__order-buttons__confirm {
  font-weight: ${variables.bold700};
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  letter-spacing: 0.008em;
  color: ${variables.success80};
  cursor: pointer;
  display: flex;
  gap: 3px;
  align-items: center;
}

.goals-order__order-buttons__reset {
  font-family: Poppins;
  font-style: normal;
  font-weight: ${variables.bold700};
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  letter-spacing: 0.008em;
  color: ${variables.darkBlue};
  cursor: pointer;
}

 svg.order__icon--green path {
    fill: ${variables.success80} !important;
  }

.goal-item--short .order-icon_container--order {
    margin-top: 5px !important;
  }

.goals-order .goal-item__name input {
    max-width: 800px !important;
  }

.list-skill-selector {
  cursor: pointer;
}
`
export default pathTemplateFormStyle
