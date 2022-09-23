import css from 'styled-jsx/css'
import variables from './variables'

export const shareContentStyle = css.global`
  .share-content__title {
    font-size: 14px;
    color: ${variables.black};
    text-align: left;
  }

  .share-content__subtitle {
    font-size: 12px;
    color: ${variables.warmGreyTwo};
    text-align: left;
  }

  .share-content__title--note {
    margin-top: 30px;
    margin-bottom: 15px;
    max-width: 70%;
  }

  .recommend-content__selected-tags {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .recommend-content__selected-list {
    margin-top: 10px;
  }

  .recommend-content__selected-list .table tr:not(:first-child) {
    border-bottom: none;
  }

   svg.table-icon--first {
    stroke: ${variables.desaturatedBlue};
  }
`
export default shareContentStyle
