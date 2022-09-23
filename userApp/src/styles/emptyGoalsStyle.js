import css from 'styled-jsx/css'
import variables from './variables'

export const emptyGoalsStyle = css.global`
  .emptygoal__container {
    display: flex;
    flex-direction: column;
    border: 1px dashed #d9e1ee;
    padding: 40px 16px;
    border-radius: 10px;
  }
  .emptygoal__container img {
    height: 115px;
  }
  .emptygoal__container h3 {
    font-size: 20px;
    font-family: 'Poppins';
    font-weight: 900;
    padding-top: 16px;
    color: ${variables.black};
  }
  .emptygoal__container > span {
    font-family: Poppins;
    font-size: 12px;
    color: ${variables.darkBlue};
    padding: 16px 0;
  }
  .emptygoal__container > div {
    padding: 16px 0;
  }

  .emptygoal__container > ul {
    padding-left: 20px;
  }

  .emptygoal__container > ul > li {
    font-size: 13px;
    color: ${variables.veryDarkBlue};
  }

  .emptygoal__container button {
    height: 42px;
  }
  .emptygoal__container button span {
    font-weight: 700 !important;
    font-size: 14px;
    font-family: 'Poppins';
  }

  .journey-next-steps__container {
    padding: 32px;
    border-radius: 10px;
    background-color: ${variables.white};
    text-align: left;
    box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.1),
      0px 16px 32px rgba(0, 8, 32, 0.1);
  }

  @media ${variables.md} {
    .journey-next-steps__container {
      max-width: 640px;
      margin: 0 auto;
    }
  }

  @media ${variables.xxs} {
    .journey-next-steps__container {
      text-align: center;
    }
  }

  .journey-next-steps__content {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    margin-top: 32px;
    align-items: center;
  }

  .journey-next-steps__content img {
    height: 100px;
    width: 100px;
    margin-right: 20px;
    margin-bottom: 0;
  }

  @media ${variables.xxs} {
    .journey-next-steps__content img {
      margin-right: 0;
      margin-bottom: 20px;
    }
  }

  @media ${variables.xxs} {
    .journey-next-steps__content {
      flex-direction: column;
    }
  }

  .journey-next-steps__content__inner h4 {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    margin-bottom: 12px;
  }

  .journey-next-steps__content__inner p {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 26px;
    margin-bottom: 12px;
  }
`
