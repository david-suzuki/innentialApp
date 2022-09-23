import css from 'styled-jsx/css'

export const profilesStyle = css.global`
  .user-skills__add-new {
    font-size: 11px;
    color: #5a55ab;
    padding: 10px 0;
    cursor: pointer;
  }
  .profile-content .el-tab-pane {
    padding-bottom: 107px;
    overflow: visible;
  }
  .profile-content .list {
    overflow: visible;
  }
  .profile-content .bottom-nav button {
    margin-top: 15px;
  }
  .profile-content .el-tab-pane {
    min-height: 500px !important;
    height: auto !important;
  }
`
export default profilesStyle
