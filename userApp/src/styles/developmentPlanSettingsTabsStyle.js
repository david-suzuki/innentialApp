import css from 'styled-jsx/css'
import variables from './variables'

export const developmentPlanSettingsTabsStyle = css.global`
  .development-plan__tabs-labels {
    display: flex;
    margin-bottom: 24px;
    margin-top: 8px;
    gap: 50px;
  }

  .tabs-label {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tabs-label__title {
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 16px;
    line-height: 26px;
    color: ${variables.veryDarkBlue};
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .development-plan__tab-item-length {
    font-weight: normal;
  }

  .development-plan__tabs-content {
    display: flex;
    gap: 50px;
  }

  .development-plan__tabs-content__filtered,
  .development-plan__tabs-content__goal-content {
    flex: 1;
  }

  .development-plan__tabs-content__goal-content--empty {
    background: ${variables.hawkesBlue};
    border-radius: 4px;
    flex: 1;
    max-height: 700px;
  }

  .development-plan__tabs-content__goal-content .dev-item {
    border: 2px solid #5a55ab !important;
    border-radius: 4px;
  }

  .add-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 128px;
  }

  .add-content__icon-container {
    display: flex:
    align-items: center;
    justify-content: center;
    background: ${variables.greyishBlue};
    border-radius: 100%;
    padding: 16px;
    margin-bottom: 8px;
  }

  .add-content__icon-container .el-icon-plus {
    color: ${variables.desaturatedBlue};
    border: 2px solid ${variables.desaturatedBlue};
    font-weight: bold;
    padding: 2px;
    border-radius: 4px;
  }

  .add-content__text {
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: ${variables.desaturatedBlue};
    display: flex;
    flex-direction: column;
  }

  .add-content__text--bolder {
    font-weight: ${variables.bold700};
  }

  .development-plan__tabs-content__goal-content .learning-item-new__input {
    display: block;
  }

  .development-plan__tabs-content__goal-content .learning-item__new__number {
    display: flex;
  }

  .development-plan__tabs-content__goal-content .learning-item-new__skills {
    padding: 0 24px 12px 32px;
}

  .quill {
    width: 100%;
    text-align: left;
    margin-bottom: 0 !important;
  }

  .ql-toolbar.ql-snow {
    border: 1px solid #8494b2;
    border-radius: 4px 4px 0px 0px;
    border-bottom: none;
  }

  .ql-container.ql-snow {
    border: none;
  }

  .ql-editor {
    border: 1px solid #8494b2;
    border-radius: 0px 0px 4px 4px;
    max-width: 447px;
    min-height: 64px;
    max-height: 100px;
    color: ${variables.grey80};
  }

  .ql-editor, .ql-editor.ql-blank::before {
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
  }

  .ql-editor.ql-blank::before {
    color: ${variables.darkBlueTwo};
  }
`
export default developmentPlanSettingsTabsStyle