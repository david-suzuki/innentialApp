import css from 'styled-jsx/css'
import variables from './variables'

export const discussionFormStyle = css.global`
         .discussionForm {
         }

         .form__title {
           color: ${variables.veryDarkBlue};
           font-size: 0.875em;
           line-height: 1.375em;
           font-weight: ${variables.bold};
           text-align: left;
         }

         .form__title--underline {
           color: ${variables.veryDarkBlue};
           font-size: 0.875em;
           line-height: 1.375em;
           font-weight: ${variables.bold};
           text-align: left;
           border-bottom: 2px solid ${variables.brandPrimary};
           padding-bottom: 0.5em;
           width: fit-content;
         }

         .form__info {
           display: flex;
           align-items: flex-start;
           gap: 0.55em;
           padding: 0.5em;
           border-radius: 5px;
           background-color: ${variables.snowfallWhite};
           font-size: 0.875em;
           color: ${variables.desaturatedBlue};
           margin: 1.1em 0 0.2em;
         }

         .form__info--lower {
           background: white;
           position: relative;
           bottom: 0;
           margin: 0 0 1em;
           padding: 0;
         }

         .form__message {
           font-size: 0.75em;
           color: ${variables.desaturatedBlue};
           line-height: 1.25em;
           margin: 0.6em 0 1.1em;
         }

         .el-input__inner {
           font-family: Poppins;
           outline: 0;
           border: 1px solid ${variables.darkBlueTwo};
           border-width: 1px;
           border-radius: 4px;
           color: ${variables.black};
           font-size: 1em;
           font-weight: ${variables.bold};
           padding: 13px 16px;
           margin-top: 12px;
           background-color: ${variables.white};
         }

         .el-textarea__inner {
           font-family: Poppins;
           outline: 0;
           border: 1px solid ${variables.darkBlueTwo};
           border-width: 1px;
           border-radius: 4px;
           color: ${variables.black};
           font-size: 1em;
           padding: 13px 16px;
           margin: 0 0 0.9em;
           background-color: ${variables.white};
         }

         .el-input__inner::-webkit-input-placeholder {
           color: ${variables.desaturatedBlue};
           font-family: Poppins;
           font-size: 1em;
         }

         .el-input__inner:-ms-input-placeholder {
           color: ${variables.desaturatedBlue};
           font-family: Poppins;
           font-size: 1em;
         }

         .el-input__inner::-ms-input-placeholder {
           color: ${variables.desaturatedBlue};
           font-family: Poppins;
           font-size: 1em;
         }

         .el-input__inner::placeholder {
           color: ${variables.desaturatedBlue};
           font-family: Poppins;
           font-size: 1em;
         }

         .el-textarea__inner::-webkit-input-placeholder {
           color: ${variables.desaturatedBlue};
           font-family: Poppins;
           font-size: 1em;
         }

         .el-textarea__inner:-ms-input-placeholder {
           color: ${variables.desaturatedBlue};
           font-family: Poppins;
           font-size: 1em;
         }

         .el-textarea__inner::-ms-input-placeholder {
           color: ${variables.desaturatedBlue};
           font-family: Poppins;
           font-size: 1em;
         }

         .el-textarea__inner::placeholder {
           color: ${variables.desaturatedBlue};
           font-family: Poppins;
           font-size: 1em;
         }

         .el-button--primary span {
           font-family: Poppins;
           font-size: 1em;
           font-weight: ${variables.bold700} !important;
           letter-spacing: 0.08em;
         }

         .el-button--default {
           font-family: Poppins;
           font-size: 0.9em;
           letter-spacing: 0.008em;
           border: none;
           background: none;
         }

         .el-form-item__error {
           position: relative;
           bottom: 0.9em;
         }

         .el-form-item__error:nth-of-type(2) {
           position: relative;
           bottom: .8em;
         }

         .el-message-box__btns .el-button--default {
           font-size: .7em;
         }

         .el-message-box__btns .el-button--primary {
           color: #fff;
           background-color: ${variables.brandPrimary};
           border-color: ${variables.brandPrimary};
           font-size: .6em;
         }

         .el-button--primary:hover, .el-button--primary:focus {
              background: #7b77bc;
              border-color: #7b77bc;
              color: #fff;
       `
export default discussionFormStyle
