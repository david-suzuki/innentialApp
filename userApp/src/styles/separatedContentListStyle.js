import css from 'styled-jsx/css'
import variables from './variables'

export const separatedContentListStyle = css.global`
  .separated-list {
    display: flex;
    flex-direction: column;
  }

  .separated-list__title {
    font-size: 13px;
    color: ${variables.black};
    text-align: left;
    width: 100%;
    margin: 0 0 20px 0;
    font-weight: 500;
  }

  .tabs-list {
    white-space: normal;
  }
`
export default separatedContentListStyle
