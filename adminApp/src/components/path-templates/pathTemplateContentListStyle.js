import css from 'styled-jsx/css'

export default css.global`
  .role-setting__heading {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-top: 20px;
  }

  .role-setting__heading h1 {
    font-size: 22px;
    font-weight: 800;
  }

  .role-setting__heading a {
    margin-bottom: 12px;
  }

  .role-setting__heading-info {
    flex: 1;
    margin-right: 28px;
  }

  .role-setting__back__button {
    font-size: 17px;
    cursor: pointer;
    float: left;
    color: black;
    border: 1px solid;
    width: 28px;
    height: 28px;
    border-radius: 20px;
    border-color: blue;
    background-color: blue;
    padding: 5px;
  }

  .role-setting__back__button:hover {
    opacity: 0.7;
  }

  .role-setting__form__next-steps {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    line-height: 28px;
    padding: 5px 0px;
    border-bottom: 1px solid white;
    align-items: center;
  }

  .role-setting__form__add-step {
    color: grey;
    cursor: pointer;
  }

  .role-setting__form__add-step:hover {
    opacity: 0.7;
  }

  .role-setting__heading-info__subtitle {
    font-size: 14px;
    font-weight: 500;
    color: grey;
    margin-bottom: 10px;
  }

  .role-group__name {
    margin-top: 20px;
    background-color: blue;
    border-radius: 5px;
  }

  .role-group__name .el-input .el-input__inner {
    background-color: inherit;
    font-family: Poppins, sans-serif;
    color: white;
    border: none;
    font-size: 18px;
    padding: 16px 10px 16px;
    margin-top: 0;
  }

  .role-group__name .el-input .el-input__inner::placeholder {
    color: white;
    opacity: 0.7;
    font-size: 18px;
  }

  .role-form__sublabel {
    font-size: 12px;
    color: black;
  }
`
