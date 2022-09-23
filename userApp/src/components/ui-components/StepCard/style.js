import css from 'styled-jsx/css'
import variables from '../../../styles/variables'

export default css.global`
  .step-card__cardContainer {
    margin: 5px 42px 25px;
    display: flex;
    justify-content: space-between;
    background: white;
    box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.12),
      0px 4px 8px rgba(0, 8, 32, 0.08);
    border-radius: 4px;
    flex-direction: column-reverse;
  }

  @media ${variables.md} {
    .step-card__cardContainer {
      flex-direction: row;
    }
  }

  .step-card__cardBody {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 24px;
    width: 100%;
  }

  .step-card__title {
    line-height: 26px;
    margin-top: 20px;
    text-align: left;
  }

  .step-card__title a {
    font-weight: bold;
    font-size: 16px;
    color: #152540;
  }

  .step-card__author {
    font-weight: normal;
    width: 100%;
    color: rgb(85, 102, 133);
    font-size: 12px;
    line-height: 18px;
    text-align: left;
  }

  .step-card__description {
    color: #556685;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    text-align: left;
    width: 100%;
    margin: 16px 0;
    padding: 10px 20px 10px 20px;
    background: #f3f3f3;
  }

  .step-card__description ol,
  .step-card__description ul {
    margin-left: 20px;
  }

  .step-card__description p:first-child {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
  }

  .step-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
  }

  .step-card__tags {
    display: flex;
    flex-wrap: wrap;
  }

  .step-card__cardContainer img {
    max-width: 332px;
    object-fit: contain;
    height: 100%;
  }

  .step-card__source {
    display: flex;
    line-height: 22px;
    font-weight: bold;
    font-size: 12px;
    color: #645a53;
  }

  .step-card__source img {
    height: 30px;
    margin-right: 5px;
  }

  .step-card__duration {
    color: #556685;
    font-size: 12px;
    line-height: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  .step-card__duration img {
    padding-right: 6px;
    width: 24px;
  }

  .step-card__cardBody button {
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    font-weight: bold;
    color: white;
    padding: 8px 22px;
    border-radius: 100px;
    outline: none;
    border: none;
    background: #5a55ab;
    font-family: 'Poppins', sans-serif;
  }

  @media (max-width: 512px) {
    .step-card__source {
      display: none;
    }
  }
`
