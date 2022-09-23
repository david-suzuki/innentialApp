import css from 'styled-jsx/css'
import variables from '$/styles/variables'

const eventsStyle = css.global`
  .events__container {
    display: flex;
    flex-wrap: wrap;
    gap: 28px;
    max-width: 1106px;
    position: relative;
  }

  .my-events__container {
    display: flex;
    gap: 12px;
    padding: 9px 9px 9px 16px;
    align-items: center;
  }

  .invitations__container {
    display: flex;
    gap: 12px;
    padding: 10px 9px 14px 16px;
    align-items: center;
  }

  .invitations__actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .details-button {
    display: flex;
    font-size: 10px;
    font-family: Poppins;
    line-height: 16px;
    align-items: center;
    color: ${variables.brandPrimary};
    border-color: ${variables.brandPrimary};
    padding: 4px 12px;
    letter-spacing: 0.1px;
  }

  .details-button:hover {
    color: ${variables.white};
    background: ${variables.brandPrimary};
    border-color: ${variables.brandPrimary};
  }

  .my-events__message {
    display: flex;
    font-size: 12px;
    font-family: Poppins;
    line-height: 18px;
    align-items: center;
    color: #22272f;
  }

  .my-events__message a {
    cursor: pointer;
  }

  .my-events__message-icon-info,
  .invitations__message-icon-info {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }

  .my-events__message-icon-info path {
    fill: #22272f;
  }

  .invitations__message {
    display: flex;
    font-size: 12px;
    font-family: Poppins;
    line-height: 18px;
    align-items: center;
    font-weight: ${variables.bold700};
    color: ${variables.brandPrimary};
  }

  .invitations__message-icon-info path {
    fill: ${variables.brandPrimary};
  }

  .invitations__actions {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 12px;
    font-family: Poppins;
    line-height: 18px;
    font-weight: ${variables.bold700};
  }

  .invitations__actions-accept,
  .invitations__actions-decline {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .invitations__actions-accept {
    color: ${variables.success80};
    cursor: pointer;
  }

  .invitations__actions-accept__icon path {
    fill: ${variables.success80};
  }

  .invitations__actions-decline {
    color: ${variables.error80};
    cursor: pointer;
  }

  .invitations__actions-decline__icon {
    border: 2px solid ${variables.error80};
    color: ${variables.error80};
    border-radius: 4px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    padding: 3px 5px 3px 7px;
  }

  .invitations__actions-decline__icon:before {
    content: '';
    height: 10px;
    width: 2px;
    background: ${variables.error80};
    border-radius: 4px;
    transform: rotate(-45deg);
  }

  .invitations__actions-decline__icon:after {
    content: '';
    height: 10px;
    width: 2px;
    background: ${variables.error80};
    border-radius: 4px;
    transform: rotate(45deg);
    position: relative;
    right: 2px;
  }

  .invitations__actions-accept__dialog span {
    font-size: 16px;
    font-family: Poppins;
    line-height: 26px;
    font-weight: ${variables.bold700};
    color: ${variables.veryDarkBlue};
  }

  /* .el-message-box__header {
    padding: 0px;
    padding-bottom: 15px;
  } */
  .el-message-box__status + .el-message-box__message {
    padding-left: 0px;
  }

  .el-message-box__btns {
    text-align: left;
    padding: 5px 15px 10px;
  }

  .el-message-box__btns button {
    padding: 10px 20px;
  }

  .list-sort__label {
  display: flex;
  font-size: 14px !important;
  line-height: 22px;
  color: ${variables.brandPrimary};
  align-items: center;
}
.transaction__filters {
  display: flex;
  align-items: center;
  margin: 6px 0px 26px;
}
.events__sort {
  display: flex;
  align-items: center;
      position: absolute;
    right: 0;
    top: -40px;
}
.events__sort .list-sort  {
  padding-bottom: 0px;
  align-items: center;
}
.events__sort .list-sort__label, .events__sort .list-sort__label span {
  white-space: nowrap;
}
.events__sort .list-sort__label span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.events__sort .list-sort__label span, .events__sort .el-icon--right {
  color: ${variables.brandPrimary};
}
.el-icon--right {
  font-weight: ${variables.bold700};
}
.events__sort .list__dropdown  {
  top: 30px;
  width: 100%;
}
.events__sort .list__dropdown ul li a {
  color: ${variables.grey80};
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  white-space: nowrap;
}
.list__dropdown.is-active  {
  background: ${variables.white};
  padding: 10px 10px 14px 10px;
  box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.1), 0px 16px 32px rgba(0, 8, 32, 0.1);
  border-radius: 4px;
}

.el-pagination .btn-next, .el-pagination .btn-prev, .el-pager li  {
    background: none;
}
`

export default eventsStyle
